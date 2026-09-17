// linha de confirmação/erro cor-de-rosa por baixo de um formulário, anunciada por leitores de ecrã
import type { ReactNode } from 'react';

export interface AvisoLinhaProps {
  children?: ReactNode;
}

export function AvisoLinha({ children }: AvisoLinhaProps) {
  return (
    <p
      role="status"
      aria-live="polite"
      style={{ fontSize: 14, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)', minHeight: '1.5em' }}
    >
      {children}
    </p>
  );
}
