// filtros secção, padrão, cor, preço máximo, só stock, limpar filtros
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getProdutos } from '../../api/produtos';
import { CORES, PADROES, SECOES, type Padrao, type Produto, type Sec } from '../../models/produto';
import { formatarEuros } from '../../lib/moeda';
import { RadioOption } from '../ui/RadioOption';
import type { FiltrosCatalogo } from '../../hooks/useProdutos';
import { useSiteInfo } from '../../hooks/useSiteInfo';

export interface FiltrosSidebarProps {
  secAtual?: Sec;
  filtros: FiltrosCatalogo;
  onFiltroChange: <K extends keyof FiltrosCatalogo>(chave: K, valor: FiltrosCatalogo[K]) => void;
  onLimpar: () => void;
}

const rotulo = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
  marginBottom: 'var(--space-2)',
};

export function FiltrosSidebar({ secAtual, filtros, onFiltroChange, onLimpar }: FiltrosSidebarProps) {
  const { siteInfo } = useSiteInfo();
  const secFiltros: { key?: Sec; label: string }[] = [
    { label: 'Tudo' },
    ...SECOES.filter((s) => siteInfo.seccoesAtivas.includes(s.key)),
  ];

  // lista completa (todas as secções, sem filtros) só para calcular as
  // contagens ao lado de cada secção — não é a lista mostrada na grelha.
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    let cancelado = false;
    getProdutos({}).then((resultado) => {
      if (!cancelado) setTodosProdutos(resultado);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <aside style={{ position: 'sticky', top: 150 }}>
      <div style={rotulo}>Secção</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 'var(--space-6)' }}>
        {secFiltros.map((f) => {
          const count = f.key ? todosProdutos.filter((p) => p.sec === f.key).length : todosProdutos.length;
          const ativo = secAtual === f.key;
          return (
            <NavLink
              key={f.label}
              to={f.key ? `/catalogo/${f.key}` : '/catalogo'}
              end
              style={{ fontSize: 14, color: ativo ? 'var(--color-accent-700)' : 'var(--color-text)', display: 'flex', gap: 8 }}
            >
              <span>{f.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.55 }}>{count}</span>
            </NavLink>
          );
        })}
      </div>

      <div style={rotulo}>Padrão</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-6)' }}>
        <button
          type="button"
          className={`tag ${filtros.padrao === 'tudo' ? 'tag-accent' : 'tag-neutral'}`}
          style={{ border: 0, cursor: 'pointer' }}
          onClick={() => onFiltroChange('padrao', 'tudo')}
        >
          Tudo
        </button>
        {(Object.keys(PADROES) as Padrao[]).map((k) => (
          <button
            key={k}
            type="button"
            className={`tag ${filtros.padrao === k ? 'tag-accent' : 'tag-neutral'}`}
            style={{ border: 0, cursor: 'pointer' }}
            onClick={() => onFiltroChange('padrao', k)}
          >
            {PADROES[k]}
          </button>
        ))}
      </div>

      <div style={rotulo}>Cor</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-6)' }}>
        <button
          type="button"
          title="Todas"
          aria-label="Todas as cores"
          aria-pressed={filtros.cor === 'tudo'}
          onClick={() => onFiltroChange('cor', 'tudo')}
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-bg)',
            border: `2px solid ${filtros.cor === 'tudo' ? 'var(--color-accent)' : 'var(--color-divider)'}`,
            padding: 0,
            cursor: 'pointer',
          }}
        />
        {(Object.keys(CORES) as (keyof typeof CORES)[]).map((k) => (
          <button
            key={k}
            type="button"
            title={CORES[k].label}
            aria-label={CORES[k].label}
            aria-pressed={filtros.cor === k}
            onClick={() => onFiltroChange('cor', k)}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: CORES[k].md,
              border: `2px solid ${filtros.cor === k ? 'var(--color-accent)' : 'var(--color-divider)'}`,
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      <div style={rotulo}>Até {formatarEuros(filtros.precoMax)}</div>
      <input
        type="range"
        min={9}
        max={90}
        step={1}
        value={filtros.precoMax}
        onChange={(e) => onFiltroChange('precoMax', Number(e.target.value))}
        aria-label="Preço máximo"
        style={{ width: '100%', accentColor: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}
      />

      <RadioOption
        type="checkbox"
        square
        id="so-stock"
        checked={filtros.soStock}
        onChange={() => onFiltroChange('soStock', !filtros.soStock)}
        label="Só o que está pronto"
        style={{ marginBottom: 'var(--space-4)' }}
      />

      <div>
        <button type="button" className="link-quiet" onClick={onLimpar}>
          Limpar filtros
        </button>
      </div>
    </aside>
  );
}
