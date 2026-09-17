// /produto/:id — SwatchViewer + MedidasTabela + QuantidadeStepper + CombinaComList
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProduto } from '../hooks/useProduto';
import { useCarrinho } from '../hooks/useCarrinho';
import { getProduto } from '../api/produtos';
import { CORES, PADROES, SECOES, type Produto } from '../models/produto';
import { formatarEuros } from '../lib/moeda';
import { SwatchViewer } from '../components/produto/SwatchViewer';
import { MedidasTabela } from '../components/produto/MedidasTabela';
import { QuantidadeStepper } from '../components/produto/QuantidadeStepper';
import { CombinaComList } from '../components/produto/CombinaComList';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';

export function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const idNum = Number(id);
  const { produto, carregando, erro } = useProduto(idNum);
  const { add } = useCarrinho();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [combinaProdutos, setCombinaProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const ids = produto?.combina ?? [];
    if (ids.length === 0) {
      setCombinaProdutos([]);
      return;
    }
    let cancelado = false;
    Promise.all(ids.map((cid) => getProduto(cid))).then((resultados) => {
      if (cancelado) return;
      setCombinaProdutos(resultados.filter((p): p is Produto => Boolean(p)));
    });
    return () => {
      cancelado = true;
    };
  }, [produto?.id, produto?.combina]);

  if (carregando) {
    return <p>A carregar…</p>;
  }

  if (erro || !produto) {
    return <p role="alert">{erro ?? 'Não encontrámos esta peça.'}</p>;
  }

  const secLabel = SECOES.find((s) => s.key === produto.sec)?.label ?? '';
  const tipoSecLabel = produto.tipo === secLabel ? '' : ` · ${secLabel}`;
  const descricao =
    `Cortada e cosida à mão no ateliê, em ${produto.tecido.toLowerCase()}. ` +
    `O padrão ${PADROES[produto.padrao].toLowerCase()} em ${CORES[produto.cor].label.toLowerCase()} é lavado antes ` +
    `de costurar, por isso não encolhe depois. Cada peça leva a etiqueta cosida da casa.`;

  return (
    <div>
      <Link to="/catalogo" style={{ fontSize: 13 }}>
        ← Voltar ao catálogo
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-4)', alignItems: 'start' }}>
        <SwatchViewer produto={produto} fotos={produto.fotos} />
        <div style={{ paddingTop: 'var(--space-2)' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
            {produto.tipo}
            {tipoSecLabel}
          </div>
          <h1 style={{ fontSize: 46, margin: '8px 0 var(--space-3)', letterSpacing: '-0.02em' }}>{produto.nome}</h1>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-heading)' }}>{formatarEuros(produto.preco)}</div>
          <p
            style={{
              marginTop: 'var(--space-4)',
              fontSize: 16,
              maxWidth: '32em',
              color: 'color-mix(in srgb,var(--color-text) 80%,transparent)',
            }}
          >
            {descricao}
          </p>
          <div style={{ display: 'flex', gap: 6, margin: 'var(--space-3) 0 var(--space-4)' }}>
            <Tag variant="accent">{PADROES[produto.padrao]}</Tag>
            <Tag variant="neutral">{CORES[produto.cor].label}</Tag>
            <Tag variant="outline">{produto.stock} prontas</Tag>
          </div>
          <MedidasTabela produto={produto} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <QuantidadeStepper value={qty} onChange={setQty} />
            <Button variant="primary" style={{ fontSize: 15, padding: '13px 26px' }} onClick={() => add(produto, qty)}>
              Juntar ao carrinho
            </Button>
            <Button variant="secondary" onClick={() => navigate('/carrinho')}>
              Ver carrinho
            </Button>
          </div>
          <CombinaComList produtos={combinaProdutos} />
        </div>
      </div>
    </div>
  );
}
