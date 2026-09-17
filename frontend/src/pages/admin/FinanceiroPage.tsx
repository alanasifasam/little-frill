// conta do mês linha a linha, margem, ponto de equilíbrio, projeção, histórico
// de 6 meses, gestão das linhas de custo fixo e dos custos variáveis pontuais
import { useState } from 'react';
import { useAdminFinanceiro } from '../../hooks/admin/useAdminFinanceiro';
import { BarrasHorario, type ItemBarra } from '../../components/admin/BarrasHorario';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { formatarEuros, formatarEurosCurto } from '../../lib/moeda';
import type { CustoFixoDTO } from '../../api/admin/custosFixos';
import type { CustoVariavelDTO } from '../../api/admin/custosVariaveis';

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatarDataPt(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function FinanceiroPage() {
  const {
    financeiro, custosVariaveis, carregando, erro, aviso,
    adicionarCustoFixo, editarCustoFixo, removerCustoFixo,
    adicionarCustoVariavel, editarCustoVariavel, removerCustoVariavel,
  } = useAdminFinanceiro();

  const [novoLabel, setNovoLabel] = useState('');
  const [novoValor, setNovoValor] = useState(0);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [edicaoLabel, setEdicaoLabel] = useState('');
  const [edicaoValor, setEdicaoValor] = useState(0);

  const [novoLabelVar, setNovoLabelVar] = useState('');
  const [novoValorVar, setNovoValorVar] = useState(0);
  const [novoDataVar, setNovoDataVar] = useState(hoje());
  const [editandoIdVar, setEditandoIdVar] = useState<number | null>(null);
  const [edicaoLabelVar, setEdicaoLabelVar] = useState('');
  const [edicaoValorVar, setEdicaoValorVar] = useState(0);
  const [edicaoDataVar, setEdicaoDataVar] = useState('');

  if (carregando) return <p>A carregar os custos e o lucro…</p>;
  if (erro || !financeiro) return <p role="alert">{erro ?? 'Não foi possível carregar os custos e o lucro.'}</p>;

  const m = financeiro;
  const { fixos, historico, custosVariaveisDoMes } = financeiro;
  const custosVariaveisOrdenados = [...custosVariaveis].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
  const jaCoberto = Math.min(1, m.receita / m.pontoEquilibrio);
  const projecaoTexto = `Ao ritmo de ${formatarEuros(m.receita / Math.max(1, m.dia))} por dia, ${m.mesNome} fecha em ${formatarEuros(
    m.projVendas
  )} — ${
    m.projVendas >= m.metaMes
      ? `${formatarEuros(m.projVendas - m.metaMes)} acima da meta.`
      : `${formatarEuros(m.metaMes - m.projVendas)} abaixo da meta de ${formatarEuros(m.metaMes)}.`
  }`;

  const maxHist = historico.reduce((max, h) => Math.max(max, h.valor), 1);
  const itensHistorico: ItemBarra[] = historico.map((h) => ({
    chave: h.mes,
    rotulo: h.mes,
    valor: formatarEurosCurto(h.valor),
    proporcao: (h.valor / maxHist) * 100,
    destaque: h.atual,
  }));

  function iniciarEdicao(f: CustoFixoDTO) {
    setEditandoId(f.id);
    setEdicaoLabel(f.label);
    setEdicaoValor(f.valor);
  }

  function cancelarEdicao() {
    setEditandoId(null);
  }

  async function guardarEdicao(f: CustoFixoDTO) {
    const ok = await editarCustoFixo(f.id, { label: edicaoLabel, valor: edicaoValor, ativo: f.ativo });
    if (ok) setEditandoId(null);
  }

  async function alternarAtivoCustoFixo(f: CustoFixoDTO) {
    await editarCustoFixo(f.id, { label: f.label, valor: f.valor, ativo: !f.ativo });
  }

  async function submeterNovoCustoFixo() {
    if (!novoLabel.trim()) return;
    const ok = await adicionarCustoFixo({ label: novoLabel.trim(), valor: novoValor });
    if (ok) {
      setNovoLabel('');
      setNovoValor(0);
    }
  }

  function iniciarEdicaoVar(c: CustoVariavelDTO) {
    setEditandoIdVar(c.id);
    setEdicaoLabelVar(c.label);
    setEdicaoValorVar(c.valor);
    setEdicaoDataVar(c.data);
  }

  function cancelarEdicaoVar() {
    setEditandoIdVar(null);
  }

  async function guardarEdicaoVar(c: CustoVariavelDTO) {
    const ok = await editarCustoVariavel(c.id, { label: edicaoLabelVar, valor: edicaoValorVar, data: edicaoDataVar });
    if (ok) setEditandoIdVar(null);
  }

  async function submeterNovoCustoVariavel() {
    if (!novoLabelVar.trim()) return;
    const ok = await adicionarCustoVariavel({ label: novoLabelVar.trim(), valor: novoValorVar, data: novoDataVar });
    if (ok) {
      setNovoLabelVar('');
      setNovoValorVar(0);
      setNovoDataVar(hoje());
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Custos, lucro e projeção</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>
        Cada peça deixa em média {pct(m.margem)} depois do tecido, do envio e das contas fixas do ateliê.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-6)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Conta do mês
          </div>
          <table className="table" style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>Vendas de peças</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatarEuros(m.vendasPecas)}</td>
              </tr>
              <tr>
                <td>Envios cobrados</td>
                <td style={{ textAlign: 'right' }}>{formatarEuros(m.enviosCobrados)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-accent-800)' }}>Custo dos materiais vendidos</td>
                <td style={{ textAlign: 'right', color: 'var(--color-accent-800)' }}>−{formatarEuros(m.custoMateriais)}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--color-accent-800)' }}>Custo real dos envios</td>
                <td style={{ textAlign: 'right', color: 'var(--color-accent-800)' }}>−{formatarEuros(m.custoEnvios)}</td>
              </tr>
              {custosVariaveisDoMes.map((c) => (
                <tr key={`var-${c.id}`}>
                  <td style={{ color: 'var(--color-accent-800)' }}>{c.label}</td>
                  <td style={{ textAlign: 'right', color: 'var(--color-accent-800)' }}>−{formatarEuros(c.valor)}</td>
                </tr>
              ))}
              {fixos.filter((f) => f.ativo).map((f) => (
                <tr key={f.id}>
                  <td style={{ color: 'var(--color-accent-800)' }}>{f.label}</td>
                  <td style={{ textAlign: 'right', color: 'var(--color-accent-800)' }}>−{formatarEuros(f.valor)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ fontFamily: 'var(--font-heading)', fontSize: 18 }}>Lucro</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-heading)', fontSize: 18, color: m.lucro >= 0 ? 'var(--color-text)' : 'var(--color-accent-700)' }}>
                  {formatarEuros(m.lucro)}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Margem</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26 }}>{pct(m.margem)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Ponto de equilíbrio</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26 }}>{formatarEuros(m.pontoEquilibrio)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Já coberto</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, color: m.receita >= m.pontoEquilibrio ? 'var(--color-text)' : 'var(--color-accent-700)' }}>
                {pct(jaCoberto)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Projeção até fim de {m.mesNome}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>Vendas previstas</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 38, letterSpacing: '-0.02em' }}>{formatarEuros(m.projVendas)}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>Lucro previsto</div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 38, letterSpacing: '-0.02em',
                  color: m.projLucro >= 0 ? 'var(--color-text)' : 'var(--color-accent-700)',
                }}
              >
                {formatarEuros(m.projLucro)}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 'var(--space-3)' }}>{projecaoTexto}</p>

          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', margin: 'var(--space-6) 0 var(--space-3)' }}>
            Últimos seis meses
          </div>
          <BarrasHorario itens={itensHistorico} altura={160} />
          <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-3)', lineHeight: 1.5 }}>
            Barra rosa clara = mês em curso, ainda a contar. Agosto costuma render menos: metade de Lisboa está fora.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
          Custos fixos
        </div>
        <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', maxWidth: '38em', marginBottom: 'var(--space-3)' }}>
          Só as linhas ativas entram na conta do mês e no ponto de equilíbrio. Desligue uma linha em vez de a apagar
          se for uma pausa (ex.: renda suspensa por um mês).
        </p>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Custo</th>
              <th style={{ textAlign: 'right' }}>Valor (€)</th>
              <th style={{ textAlign: 'left' }}>Estado</th>
              <th style={{ textAlign: 'right' }} />
            </tr>
          </thead>
          <tbody>
            {fixos.map((f) => {
              const emEdicao = editandoId === f.id;
              return (
                <tr key={f.id}>
                  {emEdicao ? (
                    <>
                      <td>
                        <input
                          className="input"
                          value={edicaoLabel}
                          onChange={(e) => setEdicaoLabel(e.target.value)}
                          aria-label="Nome do custo fixo"
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={0.5}
                          value={edicaoValor}
                          onChange={(e) => setEdicaoValor(Number(e.target.value))}
                          aria-label="Valor do custo fixo"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td>
                        <Tag variant={f.ativo ? 'outline' : 'neutral'}>{f.ativo ? 'Ativo' : 'Desligado'}</Tag>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => guardarEdicao(f)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Guardar
                        </button>
                        <span style={{ color: 'var(--color-divider)' }}> · </span>
                        <button type="button" onClick={cancelarEdicao} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{f.label}</td>
                      <td style={{ textAlign: 'right' }}>{formatarEuros(f.valor)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => alternarAtivoCustoFixo(f)}
                          className="link-quiet"
                          style={{ fontStyle: 'normal', cursor: 'pointer' }}
                        >
                          <Tag variant={f.ativo ? 'outline' : 'neutral'}>{f.ativo ? 'Ativo' : 'Desligado'}</Tag>
                        </button>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => iniciarEdicao(f)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Editar
                        </button>
                        <span style={{ color: 'var(--color-divider)' }}> · </span>
                        <button type="button" onClick={() => removerCustoFixo(f.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Apagar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 'var(--space-3)', alignItems: 'end', marginTop: 'var(--space-4)', maxWidth: '32em' }}>
          <div className="field">
            <label htmlFor="novo-custo-label">Novo custo fixo</label>
            <input
              id="novo-custo-label"
              className="input"
              placeholder="Seguro do ateliê"
              value={novoLabel}
              onChange={(e) => setNovoLabel(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="novo-custo-valor">Valor (€)</label>
            <input
              id="novo-custo-valor"
              className="input"
              type="number"
              min={0}
              step={0.5}
              value={novoValor}
              onChange={(e) => setNovoValor(Number(e.target.value))}
            />
          </div>
          <Button variant="secondary" onClick={submeterNovoCustoFixo}>
            Adicionar
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
          Custos variáveis
        </div>
        <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', maxWidth: '38em', marginBottom: 'var(--space-3)' }}>
          Despesas pontuais e datadas do ateliê (ex.: reparação da máquina de costura). Só as do mês em curso entram
          na conta do mês; esta lista guarda o histórico completo.
        </p>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Custo</th>
              <th style={{ textAlign: 'right' }}>Valor (€)</th>
              <th style={{ textAlign: 'left' }}>Data</th>
              <th style={{ textAlign: 'right' }} />
            </tr>
          </thead>
          <tbody>
            {custosVariaveisOrdenados.map((c) => {
              const emEdicao = editandoIdVar === c.id;
              return (
                <tr key={c.id}>
                  {emEdicao ? (
                    <>
                      <td>
                        <input
                          className="input"
                          value={edicaoLabelVar}
                          onChange={(e) => setEdicaoLabelVar(e.target.value)}
                          aria-label="Nome do custo variável"
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <input
                          className="input"
                          type="number"
                          min={0}
                          step={0.5}
                          value={edicaoValorVar}
                          onChange={(e) => setEdicaoValorVar(Number(e.target.value))}
                          aria-label="Valor do custo variável"
                          style={{ textAlign: 'right' }}
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          type="date"
                          value={edicaoDataVar}
                          onChange={(e) => setEdicaoDataVar(e.target.value)}
                          aria-label="Data do custo variável"
                        />
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => guardarEdicaoVar(c)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Guardar
                        </button>
                        <span style={{ color: 'var(--color-divider)' }}> · </span>
                        <button type="button" onClick={cancelarEdicaoVar} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{c.label}</td>
                      <td style={{ textAlign: 'right' }}>{formatarEuros(c.valor)}</td>
                      <td>{formatarDataPt(c.data)}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => iniciarEdicaoVar(c)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Editar
                        </button>
                        <span style={{ color: 'var(--color-divider)' }}> · </span>
                        <button type="button" onClick={() => removerCustoVariavel(c.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                          Apagar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 'var(--space-3)', alignItems: 'end', marginTop: 'var(--space-4)', maxWidth: '38em' }}>
          <div className="field">
            <label htmlFor="novo-custo-var-label">Novo custo variável</label>
            <input
              id="novo-custo-var-label"
              className="input"
              placeholder="Reparação da máquina de costura"
              value={novoLabelVar}
              onChange={(e) => setNovoLabelVar(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="novo-custo-var-valor">Valor (€)</label>
            <input
              id="novo-custo-var-valor"
              className="input"
              type="number"
              min={0}
              step={0.5}
              value={novoValorVar}
              onChange={(e) => setNovoValorVar(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="novo-custo-var-data">Data</label>
            <input
              id="novo-custo-var-data"
              className="input"
              type="date"
              value={novoDataVar}
              onChange={(e) => setNovoDataVar(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={submeterNovoCustoVariavel}>
            Adicionar
          </Button>
        </div>

        <AvisoLinha>{aviso}</AvisoLinha>
      </div>
    </div>
  );
}
