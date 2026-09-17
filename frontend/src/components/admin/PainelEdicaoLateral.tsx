// painel que abre por baixo do título, borda rosa à esquerda — editor de Produtos e de Clientes
import type { ReactNode } from 'react';

export interface PainelEdicaoLateralProps {
  titulo: string;
  aberto: boolean;
  children: ReactNode;
}

export function PainelEdicaoLateral({ titulo, aberto, children }: PainelEdicaoLateralProps) {
  if (!aberto) return null;

  return (
    <div style={{ marginTop: 'var(--space-4)', borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-4)' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
        {titulo}
      </div>
      {children}
    </div>
  );
}
