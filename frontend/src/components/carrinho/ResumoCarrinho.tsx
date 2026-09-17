// .card com subtotal/envio/total + nota "falta X para envio grátis"
import { Button } from '../ui/Button';
import { formatarEuros } from '../../lib/moeda';

export interface ResumoCarrinhoProps {
  subtotal: number;
  envio: number;
  total: number;
  envioNota: string;
  onFinalizar: () => void;
}

export function ResumoCarrinho({ subtotal, envio, total, envioNota, onFinalizar }: ResumoCarrinhoProps) {
  return (
    <div className="card elev-sm">
      <div className="card-kicker">Resumo</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
        <span>Subtotal</span>
        <span>{formatarEuros(subtotal)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
        <span>Envio</span>
        <span>{envio === 0 ? 'grátis' : formatarEuros(envio)}</span>
      </div>
      <div style={{ fontSize: 12, fontStyle: 'italic', color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
        {envioNota}
      </div>
      <div style={{ height: 1, background: 'var(--color-divider)', margin: 'var(--space-2) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: 22 }}>
        <span>Total</span>
        <span>{formatarEuros(total)}</span>
      </div>
      <Button variant="primary" block style={{ fontSize: 15, padding: 13 }} onClick={onFinalizar}>
        Finalizar compra
      </Button>
    </div>
  );
}
