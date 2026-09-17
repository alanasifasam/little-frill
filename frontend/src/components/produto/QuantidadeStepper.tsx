// botões -/+ com valor de quantidade controlado
import { Button } from '../ui/Button';

export interface QuantidadeStepperProps {
  value: number;
  onChange: (valor: number) => void;
  min?: number;
}

export function QuantidadeStepper({ value, onChange, min = 1 }: QuantidadeStepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)' }}>
      <Button style={{ width: 38, border: 0 }} onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuir quantidade">
        –
      </Button>
      <span style={{ minWidth: 28, textAlign: 'center', fontSize: 15 }} aria-live="polite">
        {value}
      </span>
      <Button style={{ width: 38, border: 0 }} onClick={() => onChange(value + 1)} aria-label="Aumentar quantidade">
        +
      </Button>
    </div>
  );
}
