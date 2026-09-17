// "1 · Morada 2 · Pagamento 3 · Confirmação", passo ativo em --color-accent-700, resto a 45% opacidade

export interface PassosIndicadorProps {
  passoAtual: 1 | 2 | 3;
}

const PASSOS = [
  { n: 1 as const, label: 'Morada' },
  { n: 2 as const, label: 'Pagamento' },
  { n: 3 as const, label: 'Confirmação' },
];

export function PassosIndicador({ passoAtual }: PassosIndicadorProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        fontSize: 12,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-4)',
      }}
    >
      {PASSOS.map((p) => {
        const ativo = p.n === passoAtual;
        return (
          <span
            key={p.n}
            aria-current={ativo ? 'step' : undefined}
            style={{ color: ativo ? 'var(--color-accent-700)' : 'var(--color-text)', opacity: ativo ? 1 : 0.45 }}
          >
            {p.n} · {p.label}
          </span>
        );
      })}
    </div>
  );
}
