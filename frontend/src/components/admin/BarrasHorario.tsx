// lista de barras proporcionais com rótulo — reaproveitada em três formatos:
// colunas verticais (caixa dos 10 dias, histórico de 6 meses) e barra fina
// horizontal com miniatura (ranking de peças mais vendidas)
import type { ReactNode } from 'react';

export interface ItemBarra {
  chave: string | number;
  rotulo: ReactNode;
  /** Texto acima da barra (vertical) ou à direita do rótulo (horizontal). */
  valor: ReactNode;
  /** 0–100, proporção face ao maior item da lista. */
  proporcao: number;
  /** Cor cheia (mês/dia em curso) em vez do tom suave. */
  destaque?: boolean;
  /** Miniatura opcional (ex.: swatch de tecido), só no modo horizontal. */
  visual?: ReactNode;
}

export interface BarrasHorarioProps {
  itens: ItemBarra[];
  orientacao?: 'vertical' | 'horizontal';
  /** Altura total em px, só no modo vertical. */
  altura?: number;
}

export function BarrasHorario({ itens, orientacao = 'vertical', altura = 150 }: BarrasHorarioProps) {
  if (orientacao === 'horizontal') {
    return (
      <div>
        {itens.map((item) => (
          <div key={item.chave} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {item.visual}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{item.rotulo}</span>
                  <span>{item.valor}</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-surface)', marginTop: 5 }}>
                  <div style={{ height: '100%', width: `${Math.max(0, item.proporcao)}%`, background: 'var(--color-accent)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: altura }}>
      {itens.map((item) => (
        <div key={item.chave} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
          <div
            style={{
              fontSize: 11,
              textAlign: 'center',
              color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
              marginBottom: 4,
            }}
          >
            {item.valor}
          </div>
          <div
            style={{
              height: `${Math.max(0, item.proporcao)}%`,
              background: item.destaque ? 'var(--color-accent)' : 'var(--color-accent-300)',
            }}
          />
          <div
            style={{
              fontSize: 11,
              textAlign: 'center',
              marginTop: 6,
              color: item.destaque ? 'var(--color-accent-700)' : 'color-mix(in srgb,var(--color-text) 60%,transparent)',
            }}
          >
            {item.rotulo}
          </div>
        </div>
      ))}
    </div>
  );
}
