// estado (select livre — pode voltar atrás), rastreio, pagamento,
// anular/reabrir, apagar — a cliente vê o que aqui for gravado
import { Fragment } from 'react';
import { useAdminEncomendas } from '../../hooks/admin/useAdminEncomendas';
import { useDetalhesEncomendasAdmin } from '../../hooks/admin/useDetalhesEncomendasAdmin';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Tag } from '../../components/ui/Tag';
import { TecidoSwatch } from '../../components/ui/TecidoSwatch';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { METODOS } from '../../mocks/admin/encomendas.mock';
import { ESTADOS_ENCOMENDA, TAG_ESTILO_ESTADO, TAG_VARIANTE_ESTADO, type EstadoEncomenda } from '../../models/encomenda';

/** "Anulada" fica de fora do select de propósito — só se entra/sai desse
 * estado via Anular/Reabrir (têm efeitos próprios: stock, contas). */
const ESTADOS_SELECIONAVEIS: EstadoEncomenda[] = ['novo', 'em producao', 'embalada', 'enviada', 'entregue'];

const NUMERO_COLUNAS = 9;

export function EncomendasPage() {
  const { encomendas, carregando, erro, aviso, mudarEstado, mudarRastreio, alternarPagamento, anular, reabrir, apagar } =
    useAdminEncomendas();
  const { referenciaAberta, detalhes, carregandoRef, erroRef, alternar } = useDetalhesEncomendasAdmin();

  if (carregando) return <p>A carregar as encomendas…</p>;
  if (erro) return <p role="alert">{erro}</p>;

  const vivas = encomendas.filter((e) => e.estado !== 'anulada');
  const resumo = `${vivas.length} encomendas válidas, ${
    vivas.filter((e) => e.estado === 'em producao' || e.estado === 'novo').length
  } à espera de costura e ${vivas.filter((e) => !e.pago).length} por pagar.`;

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Encomendas</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '40em' }}>{resumo}</p>
      <AvisoLinha>{aviso}</AvisoLinha>
      <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
        O estado e o código que escrever aqui são o que a cliente vê em "Os meus pedidos".
      </p>

      <table className="table" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Ref.</th>
            <th style={{ textAlign: 'left' }}>Dia</th>
            <th style={{ textAlign: 'left' }}>Cliente</th>
            <th style={{ textAlign: 'right' }}>Peças</th>
            <th style={{ textAlign: 'right' }}>Total</th>
            <th style={{ textAlign: 'left' }}>Estado</th>
            <th style={{ textAlign: 'left' }}>Rastreio</th>
            <th style={{ textAlign: 'left' }}>Pagamento</th>
            <th style={{ textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {encomendas.map((e) => {
            const metodo = METODOS.find((m) => m.key === e.metodo)?.label ?? '—';
            const aberta = referenciaAberta === e.ref;
            const detalhe = detalhes[e.ref];
            return (
              <Fragment key={e.ref}>
              <tr style={{ opacity: e.estado === 'anulada' ? 0.5 : 1 }}>
                <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    onClick={() => alternar(e.ref)}
                    aria-expanded={aberta}
                    className="link-quiet"
                    style={{ fontStyle: 'normal', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <span aria-hidden="true" style={{ display: 'inline-block', transform: aberta ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}>
                      ›
                    </span>
                    {e.ref}
                  </button>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{e.dia}</td>
                <td>
                  <div>{e.clienteNome}</div>
                  <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
                    {e.localidade} · {e.envio === 'atelie' ? 'Ateliê' : 'CTT'}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>{e.pecas}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(e.total)}</td>
                <td>
                  {e.estado === 'anulada' ? (
                    <Tag variant={TAG_VARIANTE_ESTADO[e.estado]} style={TAG_ESTILO_ESTADO[e.estado]}>
                      {ESTADOS_ENCOMENDA[e.estado]}
                    </Tag>
                  ) : (
                    <label className="field" style={{ margin: 0 }}>
                      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                        Estado de {e.ref}
                      </span>
                      <select
                        className="input"
                        value={e.estado}
                        onChange={(ev) => mudarEstado(e.ref, ev.target.value as EstadoEncomenda)}
                        style={{ fontSize: 14, padding: '5px 8px', minWidth: 132 }}
                      >
                        {ESTADOS_SELECIONAVEIS.map((estado) => (
                          <option key={estado} value={estado}>
                            {ESTADOS_ENCOMENDA[estado]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </td>
                <td>
                  <label className="field" style={{ margin: 0 }}>
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                      Rastreio de {e.ref}
                    </span>
                    <input
                      className="input"
                      value={e.rastreio}
                      onChange={(ev) => mudarRastreio(e.ref, ev.target.value)}
                      style={{ fontSize: 14, padding: '5px 8px', width: 150 }}
                    />
                  </label>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button type="button" onClick={() => alternarPagamento(e.ref)} className="link-quiet" style={{ fontStyle: 'normal', cursor: 'pointer' }}>
                    <Tag variant={e.pago ? 'outline' : 'accent'}>{e.pago ? 'Paga' : 'Por pagar'}</Tag>
                  </button>
                  <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginTop: 3 }}>{metodo}</div>
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    onClick={() => (e.estado === 'anulada' ? reabrir(e.ref) : anular(e.ref))}
                    className="link-quiet"
                    style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}
                  >
                    {e.estado === 'anulada' ? 'Reabrir' : 'Anular'}
                  </button>
                  {e.estado === 'anulada' && (
                    <>
                      <span style={{ color: 'var(--color-divider)' }}> · </span>
                      <button type="button" onClick={() => apagar(e.ref)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                        Apagar
                      </button>
                    </>
                  )}
                </td>
              </tr>
              {aberta && (
                <tr>
                  <td colSpan={NUMERO_COLUNAS} style={{ background: 'var(--color-surface)', padding: 'var(--space-3) var(--space-4)' }}>
                    {carregandoRef === e.ref && <p style={{ margin: 0, fontSize: 13 }}>A carregar peças…</p>}
                    {erroRef === e.ref && <p role="alert" style={{ margin: 0, fontSize: 13 }}>Não foi possível carregar as peças desta encomenda.</p>}
                    {detalhe && (
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
                            marginBottom: 6,
                          }}
                        >
                          Peças desta encomenda
                        </div>
                        {detalhe.itens.map((item) => (
                          <div
                            key={item.produtoId}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: 'var(--space-3)',
                              padding: '4px 0',
                              borderTop: '1px solid var(--color-divider)',
                              fontSize: 13,
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              {item.padrao && item.cor && (
                                <TecidoSwatch
                                  padrao={item.padrao}
                                  cor={item.cor}
                                  altura={28}
                                  imagemUrl={item.fotoKey ? urlFoto(item.fotoKey) : undefined}
                                  focoX={item.fotoFocoX}
                                  focoY={item.fotoFocoY}
                                  style={{ width: 28, flex: 'none' }}
                                />
                              )}
                              {item.nomeProduto}
                              {item.quantidade > 1 ? ` × ${item.quantidade}` : ''}{' '}
                              <span style={{ color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                                ({formatarEuros(item.precoUnitario)} cada)
                              </span>
                            </span>
                            <span style={{ whiteSpace: 'nowrap' }}>{formatarEuros(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
