// "Nada com esses filtros" + botão limpar filtros
import { Button } from '../ui/Button';

export interface EstadoVazioProps {
  onLimpar: () => void;
}

export function EstadoVazio({ onLimpar }: EstadoVazioProps) {
  return (
    <div style={{ padding: 'var(--space-8) 0' }}>
      <h3 style={{ fontSize: 26, marginBottom: 'var(--space-2)' }}>Nada com esses filtros.</h3>
      <p style={{ maxWidth: '26em', color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
        Solte um filtro ou dois — ou diga-nos o que procura e costuramos por encomenda.
      </p>
      <Button variant="primary" style={{ marginTop: 'var(--space-3)' }} onClick={onLimpar}>
        Limpar filtros
      </Button>
    </div>
  );
}
