// métodos no checkout (interruptor + repartição + edição de taxas/IBAN) e transações
import { useState } from 'react';
import { useAdminPagamentos } from '../../hooks/admin/useAdminPagamentos';
import type { AtualizarMetodoPagamentoInput } from '../../api/admin/metodosPagamento';
import type { MetodoLinha } from '../../api/admin/pagamentos';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Interruptor } from '../../components/admin/Interruptor';
import { PainelEdicaoLateral } from '../../components/admin/PainelEdicaoLateral';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { formatarEuros } from '../../lib/moeda';

const RASCUNHO_VAZIO: AtualizarMetodoPagamentoInput = { taxaPercent: 0, custoFixo: 0, iban: '', numeroMbway: '', nota: '' };

export function PagamentosPage() {
  const { pagamentos, carregando, erro, aviso, alternar, alternarPago, guardarMetodo } = useAdminPagamentos();
  const [editandoMetodo, setEditandoMetodo] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<AtualizarMetodoPagamentoInput>(RASCUNHO_VAZIO);

  if (carregando) return <p>A carregar os pagamentos…</p>;
  if (erro || !pagamentos) return <p role="alert">{erro ?? 'Não foi possível carregar os pagamentos.'}</p>;

  const nPagas = pagamentos.transacoes.filter((t) => !t.anulada && t.pago).length;
  const nPorPagar = pagamentos.transacoes.filter((t) => !t.anulada && !t.pago).length;
  const metodoEmEdicao = pagamentos.metodos.find((m) => m.key === editandoMetodo) ?? null;

  function abrirEdicaoMetodo(chave: string, m: MetodoLinha) {
    setRascunho({ taxaPercent: m.taxaPercent, custoFixo: m.custoFixo, iban: m.iban, numeroMbway: m.numeroMbway, nota: m.nota });
    setEditandoMetodo(chave);
  }

  function atualizarRascunho<K extends keyof AtualizarMetodoPagamentoInput>(campo: K, valor: AtualizarMetodoPagamentoInput[K]) {
    setRascunho((r) => ({ ...r, [campo]: valor }));
  }

  async function submeterEdicaoMetodo() {
    if (!editandoMetodo) return;
    const ok = await guardarMetodo(editandoMetodo, rascunho);
    if (ok) setEditandoMetodo(null);
  }

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Pagamentos</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '40em' }}>
        {nPagas} encomendas pagas e {nPorPagar} à espera de confirmação.
      </p>
      <AvisoLinha>{aviso}</AvisoLinha>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'var(--space-8)', marginTop: 'var(--space-4)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Métodos no checkout
          </div>
          {pagamentos.metodos.map((m) => (
            <div key={m.key} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <Interruptor id={`metodo-${m.key}`} ligado={m.ativo} onChange={() => alternar(m.key, m.label)} label={m.label} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 2 }}>{m.nota}</div>
                  <div style={{ height: 6, background: 'var(--color-surface)', marginTop: 8 }}>
                    <div style={{ height: '100%', width: `${m.barraPct}%`, background: 'var(--color-accent)' }} />
                  </div>
                  <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginTop: 4 }}>
                    {m.usos} encomendas · {formatarEuros(m.valor)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                  <Tag variant={m.ativo ? 'accent' : 'neutral'} style={{ whiteSpace: 'nowrap' }}>{m.ativo ? 'Ligado' : 'Desligado'}</Tag>
                  <button
                    type="button"
                    onClick={() => abrirEdicaoMetodo(m.key, m)}
                    className="link-quiet"
                    style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}

          <PainelEdicaoLateral titulo={metodoEmEdicao ? `Editar ${metodoEmEdicao.label}` : 'Editar método'} aberto={editandoMetodo !== null}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <div className="field">
                <label htmlFor="metodo-taxa">Taxa (%)</label>
                <input
                  id="metodo-taxa"
                  className="input"
                  type="number"
                  min={0}
                  step={0.1}
                  value={rascunho.taxaPercent}
                  onChange={(e) => atualizarRascunho('taxaPercent', Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label htmlFor="metodo-custo-fixo">Custo fixo (€)</label>
                <input
                  id="metodo-custo-fixo"
                  className="input"
                  type="number"
                  min={0}
                  step={0.01}
                  value={rascunho.custoFixo}
                  onChange={(e) => atualizarRascunho('custoFixo', Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label htmlFor="metodo-iban">IBAN</label>
                <input
                  id="metodo-iban"
                  className="input"
                  type="text"
                  value={rascunho.iban ?? ''}
                  onChange={(e) => atualizarRascunho('iban', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="metodo-numero-mbway">Número MB WAY</label>
                <input
                  id="metodo-numero-mbway"
                  className="input"
                  type="text"
                  value={rascunho.numeroMbway ?? ''}
                  onChange={(e) => atualizarRascunho('numeroMbway', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="metodo-nota">Nota</label>
                <input
                  id="metodo-nota"
                  className="input"
                  type="text"
                  value={rascunho.nota}
                  onChange={(e) => atualizarRascunho('nota', e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="primary" onClick={submeterEdicaoMetodo}>
                Guardar método
              </Button>
              <Button variant="secondary" onClick={() => setEditandoMetodo(null)}>
                Cancelar
              </Button>
            </div>
          </PainelEdicaoLateral>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
              Por receber
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 32, marginTop: 'var(--space-1)' }}>
              {formatarEuros(pagamentos.porPagar)}
            </div>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
              {pagamentos.nPorPagar} encomendas à espera de confirmação
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Movimentos de pagamento
          </div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Ref.</th>
                <th style={{ textAlign: 'left' }}>Dia</th>
                <th style={{ textAlign: 'left' }}>Cliente</th>
                <th style={{ textAlign: 'left' }}>Método</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ textAlign: 'left' }}>Estado</th>
                <th style={{ textAlign: 'right' }} />
              </tr>
            </thead>
            <tbody>
              {pagamentos.transacoes.map((t) => {
                const metodo = pagamentos.metodos.find((m) => m.key === t.metodo)?.label ?? '—';
                return (
                  <tr key={t.ref}>
                    <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.ref}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{t.dia}</td>
                    <td>{t.clienteNome}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>{metodo}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(t.total)}</td>
                    <td>
                      <Tag variant={t.anulada ? 'neutral' : t.pago ? 'outline' : 'accent'} style={{ whiteSpace: 'nowrap' }}>
                        {t.anulada ? 'Anulada' : t.pago ? 'Paga' : 'Por pagar'}
                      </Tag>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {!t.anulada && (
                        <button type="button" onClick={() => alternarPago(t.ref)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          {t.pago ? 'Marcar por pagar' : 'Marcar paga'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
