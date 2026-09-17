// cobre /catalogo e /catalogo/:sec (useParams); FiltrosSidebar + ProdutoGrid + CombinaComSection
import { useParams } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import { FiltrosSidebar } from '../components/catalogo/FiltrosSidebar';
import { OrdenarSelect } from '../components/catalogo/OrdenarSelect';
import { ProdutoGrid } from '../components/catalogo/ProdutoGrid';
import { EstadoVazio } from '../components/catalogo/EstadoVazio';
import { CombinaComSection } from '../components/catalogo/CombinaComSection';
import { SECOES, type Sec } from '../models/produto';

export function CatalogoPage() {
  const { sec } = useParams<{ sec?: string }>();
  const secTipada = sec as Sec | undefined;
  const { produtos, filtros, atualizarFiltro, limparFiltros, carregando, erro } = useProdutos(secTipada);

  const catTitle = secTipada ? SECOES.find((s) => s.key === secTipada)?.label ?? 'Catálogo' : 'Tudo o que está feito';
  const countText = produtos.length === 1 ? '1 peça' : `${produtos.length} peças`;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
            Catálogo
          </div>
          <h1 style={{ fontSize: 52, margin: '6px 0 0', letterSpacing: '-0.02em' }}>{catTitle}</h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 13 }}>
          <span style={{ color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>{countText}</span>
          <OrdenarSelect value={filtros.ordenar} onChange={(v) => atualizarFiltro('ordenar', v)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <FiltrosSidebar secAtual={secTipada} filtros={filtros} onFiltroChange={atualizarFiltro} onLimpar={limparFiltros} />
        <div>
          {erro && (
            <p role="alert" style={{ color: 'var(--color-accent-800)' }}>
              {erro}
            </p>
          )}
          {!erro && !carregando && produtos.length > 0 && <ProdutoGrid produtos={produtos} />}
          {!erro && !carregando && produtos.length === 0 && <EstadoVazio onLimpar={limparFiltros} />}
          <CombinaComSection produtos={produtos} />
        </div>
      </div>
    </div>
  );
}
