// leitura do mês em curso: 4 números, meta, barras dos 10 dias, últimos movimentos, alertas
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminPainel } from '../../hooks/admin/useAdminPainel';
import { useConfiguracaoNegocio } from '../../hooks/admin/useConfiguracaoNegocio';
import type { ConfiguracaoNegocioDTO } from '../../api/admin/configuracaoNegocio';
import { StatTile } from '../../components/admin/StatTile';
import { BarrasHorario, type ItemBarra } from '../../components/admin/BarrasHorario';
import { PainelEdicaoLateral } from '../../components/admin/PainelEdicaoLateral';
import { Interruptor } from '../../components/admin/Interruptor';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { TecidoSwatch } from '../../components/ui/TecidoSwatch';
import { formatarEuros, formatarEurosCurto } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

const MOTIVO_LABEL: Record<string, string> = { quebra: 'Quebra', amostra: 'Amostra', presente: 'Presente' };

const RASCUNHO_VAZIO: ConfiguracaoNegocioDTO = {
  metaMes: 0, envioRealCtt: 0, feriasLigadas: false,
};

export function PainelPage() {
  const { painel, carregando, erro, recarregar } = useAdminPainel();
  const { configuracao, aviso: avisoParametros, guardar: guardarParametros } = useConfiguracaoNegocio();
  const [editandoParametros, setEditandoParametros] = useState(false);
  const [rascunho, setRascunho] = useState<ConfiguracaoNegocioDTO>(RASCUNHO_VAZIO);

  if (carregando) return <p>A carregar o painel…</p>;
  if (erro || !painel) return <p role="alert">{erro ?? 'Não foi possível carregar o painel.'}</p>;

  function abrirEdicaoParametros() {
    setRascunho(configuracao ?? RASCUNHO_VAZIO);
    setEditandoParametros(true);
  }

  function atualizarRascunho<K extends keyof ConfiguracaoNegocioDTO>(campo: K, valor: ConfiguracaoNegocioDTO[K]) {
    setRascunho((r) => ({ ...r, [campo]: valor }));
  }

  async function submeterParametros() {
    const ok = await guardarParametros(rascunho);
    if (ok) {
      setEditandoParametros(false);
      recarregar();
    }
  }

  const { metricas: m, barras, alertas, movimentos, stockTotal, feriasLigadas } = painel;

  const resumoMes = `${m.nEncomendas} encomendas em ${m.dia} dias, ${formatarEuros(m.receita)} de receita. ${
    m.receita >= m.ritmoNecessario
      ? 'Está à frente do ritmo da meta.'
      : `Falta ${formatarEuros(m.ritmoNecessario - m.receita)} para acompanhar o ritmo da meta.`
  }`;

  const projecaoTexto = `Ao ritmo de ${formatarEuros(m.receita / Math.max(1, m.dia))} por dia, ${m.mesNome} fecha em ${formatarEuros(
    m.projVendas
  )} — ${
    m.projVendas >= m.metaMes
      ? `${formatarEuros(m.projVendas - m.metaMes)} acima da meta.`
      : `${formatarEuros(m.metaMes - m.projVendas)} abaixo da meta de ${formatarEuros(m.metaMes)}.`
  }`;

  const maxBarra = barras.reduce((max, b) => Math.max(max, b.total), 1);
  const itensBarras: ItemBarra[] = barras.map((b) => ({
    chave: b.dia,
    rotulo: String(b.dia),
    valor: b.total > 0 ? formatarEurosCurto(b.total) : '',
    proporcao: (b.total / maxBarra) * 100,
    destaque: b.dia === m.dia,
  }));

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>O mês em curso</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>{resumoMes}</p>
      {feriasLigadas && (
        <p style={{ fontSize: 15, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)' }}>
          Modo de férias ligado — a loja aceita encomendas mas avisa que só saem no regresso.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <StatTile
          rotulo="Vendas do mês"
          valor={formatarEuros(m.vendasPecas)}
          sublinha={`${pct(m.receita / m.metaMes)} da meta de ${formatarEuros(m.metaMes)}`}
        />
        <StatTile
          rotulo="Caixa de hoje"
          valor={formatarEuros(m.caixaHoje)}
          sublinha={m.encomendasHoje === 0 ? 'ainda sem encomendas hoje' : `${m.encomendasHoje} encomenda${m.encomendasHoje > 1 ? 's' : ''} hoje`}
        />
        <StatTile
          rotulo="Lucro do mês"
          valor={formatarEuros(m.lucro)}
          corValor={m.lucro >= 0 ? 'var(--color-text)' : 'var(--color-accent-700)'}
          sublinha={`margem de ${pct(m.margem)}`}
        />
        <StatTile
          rotulo="Peças em stock"
          valor={stockTotal}
          sublinha={alertas.length === 0 ? 'nada por repor' : `${alertas.length} a repor`}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
              Meta de {m.mesNome}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{formatarEuros(m.metaMes)}</span>
              <button
                type="button"
                onClick={abrirEdicaoParametros}
                className="link-quiet"
                style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}
              >
                Editar
              </button>
            </div>
          </div>
          <div style={{ height: 22, background: 'var(--color-surface)', marginTop: 'var(--space-3)', position: 'relative' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (m.receita / m.metaMes) * 100)}%`, background: 'var(--color-accent)' }} />
            <div
              style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${Math.min(100, (m.dia / m.diasNoMes) * 100)}%`, width: 2, background: 'var(--color-text)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 'var(--space-2)' }}>
            <span>{pct(m.receita / m.metaMes)} da meta</span>
            <span style={{ color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>risco preto = ritmo necessário hoje</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, marginTop: 'var(--space-4)' }}>{projecaoTexto}</p>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
            Caixa dos últimos 10 dias
          </div>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <BarrasHorario itens={itensBarras} altura={150} />
          </div>
        </div>
      </div>

      <PainelEdicaoLateral titulo="Editar parâmetros do mês" aberto={editandoParametros}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <div className="field">
            <label htmlFor="param-meta">Meta do mês (€)</label>
            <input
              id="param-meta"
              className="input"
              type="number"
              min={0}
              step={50}
              value={rascunho.metaMes}
              onChange={(e) => atualizarRascunho('metaMes', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="param-envio">Custo real de envio CTT (€)</label>
            <input
              id="param-envio"
              className="input"
              type="number"
              min={0}
              step={0.1}
              value={rascunho.envioRealCtt}
              onChange={(e) => atualizarRascunho('envioRealCtt', Number(e.target.value))}
            />
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginTop: 'var(--space-3)' }}>
          Os custos fixos mensais (renda, luz, embalagem…) já não se editam aqui — geram-se agora em{' '}
          <Link to="/admin/financeiro">Custos e lucro</Link>.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Interruptor
            id="param-ferias"
            ligado={rascunho.feriasLigadas}
            onChange={() => atualizarRascunho('feriasLigadas', !rascunho.feriasLigadas)}
            label="Modo férias"
          />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>Modo férias</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Button variant="primary" onClick={submeterParametros}>
            Guardar parâmetros
          </Button>
          <Button variant="secondary" onClick={() => setEditandoParametros(false)}>
            Cancelar
          </Button>
        </div>
        <AvisoLinha>{avisoParametros}</AvisoLinha>
      </PainelEdicaoLateral>

      <div
        aria-hidden="true"
        style={{
          height: 14, opacity: 'var(--ruffle-op)',
          background: 'radial-gradient(circle at 12px -2px,transparent 11px,var(--color-accent-200) 11px) 0 0/24px 14px repeat-x',
          margin: 'var(--space-8) 0 var(--space-6)',
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'var(--space-8)' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Últimos movimentos
          </div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Dia</th>
                <th style={{ textAlign: 'left' }}>Movimento</th>
                <th style={{ textAlign: 'left' }}>Peça</th>
                <th style={{ textAlign: 'right' }}>Qt.</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {movimentos.map((mv, i) => (
                <tr key={`${mv.tipo}-${mv.dia}-${mv.peca}-${i}`}>
                  <td style={{ whiteSpace: 'nowrap' }}>{mv.dia}</td>
                  <td>
                    <Tag variant={mv.tipo === 'venda' ? 'accent' : mv.tipo === 'entrada' ? 'outline' : 'accent-2'}>
                      {mv.tipo === 'venda' ? 'Venda' : mv.tipo === 'entrada' ? 'Entrada' : `Saída · ${MOTIVO_LABEL[mv.motivo ?? 'quebra']}`}
                    </Tag>
                  </td>
                  <td>{mv.peca}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{mv.tipo === 'venda' ? `−${mv.qty}` : mv.tipo === 'entrada' ? `+${mv.qty}` : `−${mv.qty}`}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: mv.tipo === 'venda' ? 'var(--color-text)' : 'var(--color-accent-800)' }}>
                    {mv.valor >= 0 ? '+' : '−'}{formatarEuros(Math.abs(mv.valor))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            A precisar de atenção
          </div>
          {alertas.map((a) => (
            <div key={a.produtoId} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <TecidoSwatch
                  padrao={a.padrao}
                  cor={a.cor}
                  altura={38}
                  style={{ width: 38, flex: 'none' }}
                  imagemUrl={a.fotoKey ? urlFoto(a.fotoKey) : undefined}
                  focoX={a.fotoFocoX}
                  focoY={a.fotoFocoY}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>{a.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-accent-700)' }}>
                    {a.esgotada ? 'Esgotada — sai do site até haver fornada' : `Só ${a.stockAtual} — vendeu ${a.vendidas} este mês`}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-3)' }}>
            {alertas.length === 0 ? 'Nada a repor hoje. Boa altura para cortar tecido novo.' : 'Reponha antes de sexta para não perder o fim de semana.'}
          </p>
        </div>
      </div>
    </div>
  );
}
