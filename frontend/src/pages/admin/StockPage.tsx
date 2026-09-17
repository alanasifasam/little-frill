// entradas, saídas e vendas rápidas; movimentos do mês; inventário completo
import { useAdminStock } from '../../hooks/admin/useAdminStock';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { formatarEuros } from '../../lib/moeda';

const MOTIVOS_OPCOES: { value: 'quebra' | 'amostra' | 'presente'; label: string }[] = [
  { value: 'quebra', label: 'Quebra ou defeito' },
  { value: 'amostra', label: 'Amostra ou feira' },
  { value: 'presente', label: 'Presente' },
];

const MOTIVO_LABEL: Record<string, string> = { quebra: 'Quebra', amostra: 'Amostra', presente: 'Presente' };

export function StockPage() {
  const { stock, carregando, erro, aviso, produtoId, setProdutoId, qty, setQty, motivo, setMotivo, registrarEntrada, registrarSaida, registrarVenda } =
    useAdminStock();

  if (carregando) return <p>A carregar o stock…</p>;
  if (erro || !stock) return <p role="alert">{erro ?? 'Não foi possível carregar o stock.'}</p>;

  const saldoMovimentos = stock.movimentos.reduce(
    (total, mv) => total + (mv.tipo === 'entrada' ? mv.quantidade : -mv.quantidade),
    0
  );

  const totalCusto = stock.inventario.reduce((total, p) => total + p.custo, 0);
  const totalPreco = stock.inventario.reduce((total, p) => total + p.preco, 0);
  const totalEntradas = stock.inventario.reduce((total, p) => total + p.entradas, 0);
  const totalSaidas = stock.inventario.reduce((total, p) => total + p.saidas, 0);
  const totalVendidas = stock.inventario.reduce((total, p) => total + p.vendidas, 0);
  const totalStock = stock.inventario.reduce((total, p) => total + p.stock, 0);
  const margemTotal = totalPreco > 0 ? `${Math.round(((totalPreco - totalCusto) / totalPreco) * 100)}%` : '—';

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Stock</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>
        Entradas quando termina uma fornada; saídas para quebras, amostras e presentes. As vendas descontam sozinhas.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-6)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Registar movimento
          </div>
          <div className="field">
            <label htmlFor="stock-peca">Peça</label>
            <select
              id="stock-peca"
              className="input"
              value={produtoId ?? ''}
              onChange={(e) => setProdutoId(Number(e.target.value))}
            >
              {stock.inventario.map((p) => (
                <option key={p.produtoId} value={p.produtoId}>
                  {p.nome} · {p.stock} em stock
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <div className="field">
              <label htmlFor="stock-qty">Quantidade</label>
              <input id="stock-qty" className="input" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </div>
            <div className="field">
              <label htmlFor="stock-motivo">Motivo da saída</label>
              <select id="stock-motivo" className="input" value={motivo} onChange={(e) => setMotivo(e.target.value as typeof motivo)}>
                {MOTIVOS_OPCOES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <Button variant="primary" onClick={registrarEntrada}>Entrada de stock</Button>
            <Button variant="secondary" onClick={registrarSaida}>Saída de stock</Button>
            <Button variant="secondary" onClick={registrarVenda}>Registar venda</Button>
          </div>
          <AvisoLinha>{aviso}</AvisoLinha>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', lineHeight: 1.5 }}>
            Uma entrada soma ao stock e ao custo de materiais do mês. Uma venda desconta do stock e entra na caixa de hoje.
          </p>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Movimentos do mês
          </div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Dia</th>
                <th style={{ textAlign: 'left' }}>Tipo</th>
                <th style={{ textAlign: 'left' }}>Peça</th>
                <th style={{ textAlign: 'right' }}>Qt.</th>
              </tr>
            </thead>
            <tbody>
              {stock.movimentos.map((mv, i) => (
                <tr key={`${mv.produtoId}-${mv.data}-${i}`}>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(mv.data).getDate()}</td>
                  <td>
                    <Tag variant={mv.tipo === 'entrada' ? 'outline' : 'accent-2'}>
                      {mv.tipo === 'entrada' ? 'Entrada' : `Saída · ${MOTIVO_LABEL[mv.motivo ?? 'quebra']}`}
                    </Tag>
                  </td>
                  <td>{mv.produtoNome}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{mv.tipo === 'entrada' ? `+${mv.quantidade}` : `−${mv.quantidade}`}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--color-divider)', fontWeight: 600 }}>
                <td colSpan={3}>Total</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {saldoMovimentos >= 0 ? `+${saldoMovimentos}` : `−${Math.abs(saldoMovimentos)}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          height: 14, opacity: 'var(--ruffle-op)',
          background: 'radial-gradient(circle at 12px -2px,transparent 11px,var(--color-accent-200) 11px) 0 0/24px 14px repeat-x',
          margin: 'var(--space-8) 0 var(--space-6)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
          Inventário
        </div>
        <div style={{ fontSize: 15 }}>
          Valor em materiais: <strong>{formatarEuros(stock.valorStock)}</strong>
        </div>
      </div>
      <table className="table" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Peça</th>
            <th style={{ textAlign: 'left' }}>Tecido</th>
            <th style={{ textAlign: 'right' }}>Custo</th>
            <th style={{ textAlign: 'right' }}>Preço</th>
            <th style={{ textAlign: 'right' }}>Margem</th>
            <th style={{ textAlign: 'right' }}>Entradas</th>
            <th style={{ textAlign: 'right' }}>Saídas</th>
            <th style={{ textAlign: 'right' }}>Vendidas</th>
            <th style={{ textAlign: 'right' }}>Stock</th>
            <th style={{ textAlign: 'left' }}>Aviso</th>
          </tr>
        </thead>
        <tbody>
          {stock.inventario.map((p) => (
            <tr key={p.produtoId}>
              <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{p.nome}</td>
              <td style={{ color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>{p.tecido}</td>
              <td style={{ textAlign: 'right' }}>{formatarEuros(p.custo)}</td>
              <td style={{ textAlign: 'right' }}>{formatarEuros(p.preco)}</td>
              <td style={{ textAlign: 'right', color: 'var(--color-accent-700)' }}>
                {p.preco > 0 ? `${Math.round(((p.preco - p.custo) / p.preco) * 100)}%` : '—'}
              </td>
              <td style={{ textAlign: 'right' }}>{p.entradas}</td>
              <td style={{ textAlign: 'right' }}>{p.saidas}</td>
              <td style={{ textAlign: 'right' }}>{p.vendidas}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.stock}</td>
              <td>
                {p.stock <= 3 && <Tag variant={p.stock <= 0 ? 'accent-2' : 'accent'}>{p.stock <= 0 ? 'Esgotada' : 'Repor'}</Tag>}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid var(--color-divider)', fontWeight: 600 }}>
            <td colSpan={2}>Total</td>
            <td style={{ textAlign: 'right' }}>{formatarEuros(totalCusto)}</td>
            <td style={{ textAlign: 'right' }}>{formatarEuros(totalPreco)}</td>
            <td style={{ textAlign: 'right', color: 'var(--color-accent-700)' }}>{margemTotal}</td>
            <td style={{ textAlign: 'right' }}>{totalEntradas}</td>
            <td style={{ textAlign: 'right' }}>{totalSaidas}</td>
            <td style={{ textAlign: 'right' }}>{totalVendidas}</td>
            <td style={{ textAlign: 'right' }}>{totalStock}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
