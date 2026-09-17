// encomendas do mês, peças vendidas, talão médio, melhor dia; caixa dia a dia; ranking top 5
import { useAdminVendas } from '../../hooks/admin/useAdminVendas';
import { StatTile } from '../../components/admin/StatTile';
import { BarrasHorario, type ItemBarra } from '../../components/admin/BarrasHorario';
import { TecidoSwatch } from '../../components/ui/TecidoSwatch';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';

export function VendasPage() {
  const { vendas, carregando, erro } = useAdminVendas();

  if (carregando) return <p>A carregar as vendas…</p>;
  if (erro || !vendas) return <p role="alert">{erro ?? 'Não foi possível carregar as vendas.'}</p>;

  const resumo = `Caixa de ${formatarEuros(vendas.receita)} em ${vendas.nDiasComVendas} dias com vendas. Talão médio de ${formatarEuros(vendas.talaoMedio)}.`;

  const itensRanking: ItemBarra[] = vendas.ranking.map((r) => ({
    chave: r.produtoId,
    rotulo: r.nome,
    valor: r.qty,
    proporcao: r.barraPct,
    visual: (
      <TecidoSwatch
        padrao={r.padrao}
        cor={r.cor}
        altura={34}
        style={{ width: 34, flex: 'none' }}
        imagemUrl={r.fotoKey ? urlFoto(r.fotoKey) : undefined}
        focoX={r.fotoFocoX}
        focoY={r.fotoFocoY}
      />
    ),
  }));

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Vendas e caixa</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>{resumo}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <StatTile rotulo="Encomendas do mês" valor={vendas.nEncomendas} tamanho={34} />
        <StatTile rotulo="Peças vendidas" valor={vendas.nPecas} tamanho={34} />
        <StatTile rotulo="Talão médio" valor={formatarEuros(vendas.talaoMedio)} tamanho={34} />
        <StatTile
          rotulo="Melhor dia"
          valor={vendas.melhorDia ? formatarEuros(vendas.melhorDia.total) : '—'}
          tamanho={34}
          sublinha={vendas.melhorDia ? `dia ${vendas.melhorDia.dia} de ${vendas.mesNome}` : 'sem vendas'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Caixa dia a dia
          </div>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Dia</th>
                <th style={{ textAlign: 'left' }}>Encomendas</th>
                <th style={{ textAlign: 'right' }}>Peças</th>
                <th style={{ textAlign: 'right' }}>Caixa</th>
                <th style={{ textAlign: 'left' }} />
              </tr>
            </thead>
            <tbody>
              {vendas.caixaDias.map((d) => (
                <tr key={d.dia}>
                  <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{d.dia}</td>
                  <td>{d.refs.join(', ')}</td>
                  <td style={{ textAlign: 'right' }}>{d.pecas}</td>
                  <td style={{ textAlign: 'right' }}>{formatarEuros(d.total)}</td>
                  <td>
                    <div style={{ height: 8, width: `${d.barraPct}%`, background: 'var(--color-accent-300)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginBottom: 'var(--space-3)' }}>
            Peças mais vendidas
          </div>
          <BarrasHorario itens={itensRanking} orientacao="horizontal" />
        </div>
      </div>
    </div>
  );
}
