// painel de detalhe de uma encomenda — itens, linha do tempo, rastreio, morada de entrega
import { useEffect, useState } from 'react';
import { useEncomenda } from '../../hooks/useEncomenda';
import { getProduto } from '../../api/produtos';
import { ESTADOS_ENCOMENDA, TAG_ESTILO_ESTADO, TAG_VARIANTE_ESTADO } from '../../models/encomenda';
import { PADROES, CORES, type Produto } from '../../models/produto';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { LinhaTempoEncomenda } from './LinhaTempoEncomenda';

const KICKER_STYLE = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
  marginBottom: 'var(--space-2)',
};

const URL_RASTREIO_CTT = 'https://www.ctt.pt/particulares/encomendas-e-correio-expresso/seguir-encomenda';

export interface DetalheEncomendaProps {
  referencia: string;
}

export function DetalheEncomenda({ referencia }: DetalheEncomendaProps) {
  const { encomenda, carregando, erro } = useEncomenda(referencia);
  const [copiado, setCopiado] = useState(false);
  const [produtosPorId, setProdutosPorId] = useState<Map<number, Produto>>(new Map());

  useEffect(() => {
    const itens = encomenda?.itens ?? [];
    if (itens.length === 0) return;
    let cancelado = false;
    Promise.all(itens.map((item) => getProduto(item.produtoId))).then((resultados) => {
      if (cancelado) return;
      const proximo = new Map<number, Produto>();
      resultados.forEach((produto) => {
        if (produto) proximo.set(produto.id, produto);
      });
      setProdutosPorId(proximo);
    });
    return () => {
      cancelado = true;
    };
  }, [encomenda?.referencia, encomenda?.itens]);

  if (carregando) return <p>A carregar…</p>;
  if (erro || !encomenda) return <p role="alert">{erro ?? 'Não encontrámos esta encomenda.'}</p>;

  const dataEncomenda = new Date(encomenda.criada).toLocaleDateString('pt-PT');

  const codigoRastreio = encomenda.codigoRastreio;

  async function copiarCodigo() {
    if (!codigoRastreio) return;
    await navigator.clipboard.writeText(codigoRastreio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <h2 style={{ fontSize: 30, letterSpacing: '-0.02em' }}>{encomenda.referencia}</h2>
        <Tag variant={TAG_VARIANTE_ESTADO[encomenda.estado]} style={TAG_ESTILO_ESTADO[encomenda.estado]}>
          {ESTADOS_ENCOMENDA[encomenda.estado]}
        </Tag>
        <span style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
          encomendada a {dataEncomenda}
        </span>
      </div>

      <LinhaTempoEncomenda
        estado={encomenda.estado}
        criada={encomenda.criada}
        pago={encomenda.pago}
        dataEmProducao={encomenda.dataEmProducao}
        dataEmbalada={encomenda.dataEmbalada}
        dataEnviada={encomenda.dataEnviada}
        dataEntregue={encomenda.dataEntregue}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)', marginTop: 'var(--space-6)' }}>
        <div>
          <div style={KICKER_STYLE}>Peças desta encomenda</div>
          {encomenda.itens.map((item) => {
            const produto = produtosPorId.get(item.produtoId);
            return (
              <div
                key={item.produtoId}
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  alignItems: 'center',
                  padding: 'var(--space-2) 0',
                  borderTop: '1px solid var(--color-divider)',
                }}
              >
                {produto ? (
                  <TecidoSwatch
                    padrao={produto.padrao}
                    cor={produto.cor}
                    altura={38}
                    style={{ width: 38, borderRadius: 2, flex: 'none' }}
                    imagemUrl={produto.fotoKey ? urlFoto(produto.fotoKey) : undefined}
                    focoX={produto.fotoFocoX}
                    focoY={produto.fotoFocoY}
                  />
                ) : (
                  <div style={{ width: 38, height: 38, flex: 'none', borderRadius: 2, background: 'var(--color-surface)' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15 }}>
                    {item.nomeProduto}
                    {item.quantidade > 1 ? ` × ${item.quantidade}` : ''}
                  </div>
                  {produto && (
                    <div style={{ fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                      {PADROES[produto.padrao]} · {CORES[produto.cor].label}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 15 }}>{formatarEuros(item.subtotal)}</div>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderTop: '1px solid var(--color-divider)', fontSize: 14 }}>
            <span>Envio · CTT Expresso</span>
            <span>{encomenda.envio === 0 ? 'grátis' : formatarEuros(encomenda.envio)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-heading)', fontSize: 21 }}>
            <span>Total</span>
            <span>{formatarEuros(encomenda.total)}</span>
          </div>
          {!encomenda.pago && (
            <p style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-2)' }}>
              A aguardar confirmação do pagamento — confirmamos em até 3 dias úteis.
            </p>
          )}
        </div>

        <div>
          {codigoRastreio && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={KICKER_STYLE}>Rastreio</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{codigoRastreio}</div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginBottom: 'var(--space-3)' }}>
                CTT Expresso · seguimento a cada passo
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="primary" style={{ fontSize: 13 }} onClick={copiarCodigo}>
                  {copiado ? 'Copiado' : 'Copiar código'}
                </Button>
                <Button
                  variant="secondary"
                  style={{ fontSize: 13 }}
                  onClick={() => window.open(URL_RASTREIO_CTT, '_blank', 'noopener,noreferrer')}
                >
                  Abrir nos CTT
                </Button>
              </div>
            </div>
          )}

          <div style={KICKER_STYLE}>Entrega em</div>
          <div style={{ fontSize: 14 }}>
            {encomenda.entrega.nome} · {encomenda.entrega.morada}
            {encomenda.entrega.andarPorta ? `, ${encomenda.entrega.andarPorta}` : ''}
          </div>
          <div style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
            {encomenda.entrega.codigoPostal} {encomenda.entrega.localidade}
          </div>
        </div>
      </div>
    </div>
  );
}
