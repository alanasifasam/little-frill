// rodapé da administração — folho no topo, nota de que os números mexem em tempo real
import { Ruffle } from '../ui/Ruffle';

export function AdminFooter() {
  return (
    <div style={{ background: 'var(--color-surface)' }}>
      <Ruffle cor="var(--color-bg)" tamanho="lg" flip />
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'var(--space-6)',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20, fontStyle: 'italic' }}>Little Frill</div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginTop: 4 }}>
            by Arrais Atelier · administração
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
          Os números mexem à medida que registar movimentos nesta página.
        </div>
      </div>
    </div>
  );
}
