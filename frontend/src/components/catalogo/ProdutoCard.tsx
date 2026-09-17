// card de grelha (catálogo, novidades, combina-com) — TecidoSwatch + Tag + preço + "Juntar"
import { Link } from 'react-router-dom';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { Ruffle } from '../ui/Ruffle';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { useCarrinho } from '../../hooks/useCarrinho';
import { CORES, type Produto } from '../../models/produto';

export interface ProdutoCardProps {
  produto: Produto;
}

export function ProdutoCard({ produto }: ProdutoCardProps) {
  const { add } = useCarrinho();
  const mostrarBadge = produto.nova || produto.stock <= 3;
  const badge = produto.nova ? 'Novo' : 'Poucas';
  const badgeVariant = produto.nova ? 'accent' : 'accent-2';
  const stockText = produto.stock > 3 ? `${produto.stock} prontas na prateleira` : `só ${produto.stock} — última fornada`;

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Link to={`/produto/${produto.id}`} aria-label={`Ver ${produto.nome}, ${produto.tecido}`} style={{ display: 'block' }}>
          <TecidoSwatch
            padrao={produto.padrao}
            cor={produto.cor}
            altura={240}
            imagemUrl={produto.fotoKey ? urlFoto(produto.fotoKey) : undefined}
            focoX={produto.fotoFocoX}
            focoY={produto.fotoFocoY}
            alt={produto.nome}
          />
        </Link>
        {mostrarBadge && (
          <Tag variant={badgeVariant} style={{ position: 'absolute', top: 10, left: 10 }}>
            {badge}
          </Tag>
        )}
      </div>
      <Ruffle cor={CORES[produto.cor].lt} tamanho="sm" />
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-accent-700)',
          marginTop: 8,
        }}
      >
        {produto.tipo}
      </div>
      <Link
        to={`/produto/${produto.id}`}
        style={{
          display: 'block',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: 18,
          lineHeight: 1.15,
          marginTop: 2,
          color: 'var(--color-text)',
        }}
      >
        {produto.nome}
      </Link>
      <div
        style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
          marginTop: 3,
        }}
      >
        {stockText}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 8 }}>
        <span style={{ fontSize: 16 }}>{formatarEuros(produto.preco)}</span>
        <Button variant="secondary" style={{ marginLeft: 'auto', fontSize: 13 }} onClick={() => add(produto, 1)}>
          Juntar
        </Button>
      </div>
    </div>
  );
}
