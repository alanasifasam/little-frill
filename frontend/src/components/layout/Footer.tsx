// 3 colunas (Little Frill / Loja / Conta), folho no topo
import { Link } from 'react-router-dom';
import { Ruffle } from '../ui/Ruffle';

const mutedStyle = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
};

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-surface)' }}>
      <Ruffle cor="var(--color-bg)" tamanho="lg" flip />
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6)',
          width: '100%',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 'var(--space-8)',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22 }}>Little Frill</div>
          <div style={{ ...mutedStyle, marginTop: 4 }}>by Arrais Atelier</div>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: 14,
              color: 'color-mix(in srgb,var(--color-text) 65%,transparent)',
              maxWidth: '24em',
              marginTop: 6,
            }}
          >
            Ateliê de costura em Lisboa. Feito à mão, feito com calma, desde 2019.
          </p>
        </div>
        <nav aria-label="Loja" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
          <span style={mutedStyle}>Loja</span>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/catalogo/acessorios">Acessórios</Link>
          <Link to="/carrinho">Carrinho</Link>
        </nav>
        <nav aria-label="Conta" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
          <span style={mutedStyle}>Conta</span>
          <Link to="/entrar">Entrar</Link>
          <Link to="/registo">Criar conta</Link>
          <span style={{ color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', fontSize: 13 }}>
            Envios só para Portugal
          </span>
        </nav>
      </div>
    </footer>
  );
}
