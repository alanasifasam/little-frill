// número grande + rótulo + sublinha — Painel, Vendas, Financeiro
import type { CSSProperties, ReactNode } from 'react';

export interface StatTileProps {
  rotulo: string;
  valor: ReactNode;
  sublinha?: ReactNode;
  corValor?: string;
  tamanho?: number;
}

export function StatTile({ rotulo, valor, sublinha, corValor, tamanho = 38 }: StatTileProps) {
  const estiloValor: CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: tamanho,
    letterSpacing: '-0.02em',
    marginTop: 'var(--space-1)',
    color: corValor,
  };

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
        }}
      >
        {rotulo}
      </div>
      <div style={estiloValor}>{valor}</div>
      {sublinha && (
        <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{sublinha}</div>
      )}
    </div>
  );
}
