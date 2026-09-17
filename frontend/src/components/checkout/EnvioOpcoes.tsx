// radio ctt | atelie, com nota de prazo e custo
import { RadioOption } from '../ui/RadioOption';
import { calcularCustoEnvio, type MetodoEnvio } from '../../models/encomenda';
import { formatarEuros } from '../../lib/moeda';

export interface EnvioOpcoesProps {
  value: MetodoEnvio;
  onChange: (metodo: MetodoEnvio) => void;
  subtotal: number;
  /** Custo do envio CTT (€) quando o subtotal não atinge o limiar de envio grátis. */
  custoPadrao: number;
  /** Subtotal (€) a partir do qual o envio CTT passa a ser grátis. */
  limiarGratis: number;
}

const OPCOES: { key: MetodoEnvio; label: string; nota: string }[] = [
  { key: 'ctt', label: 'CTT Expresso', nota: '2 a 4 dias úteis, com seguimento' },
  { key: 'atelie', label: 'Recolher no ateliê', nota: 'Lisboa, de terça a sábado, das 10h às 18h' },
];

export function EnvioOpcoes({ value, onChange, subtotal, custoPadrao, limiarGratis }: EnvioOpcoesProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 620 }}>
      {OPCOES.map((o) => {
        const custo = calcularCustoEnvio(subtotal, o.key, custoPadrao, limiarGratis);
        return (
          <RadioOption
            key={o.key}
            id={`envio-${o.key}`}
            name="envio"
            checked={value === o.key}
            onChange={() => onChange(o.key)}
            label={o.label}
            nota={o.nota}
            trailing={custo === 0 ? 'grátis' : formatarEuros(custo)}
          />
        );
      })}
    </div>
  );
}
