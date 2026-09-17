// passo 3/3 — referência da encomenda, total pago, resumo do envio
import { Link, Navigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { PassosIndicador } from '../../components/checkout/PassosIndicador';
import { formatarEuros } from '../../lib/moeda';

export function ConfirmacaoPage() {
  const { estado } = useCheckout();
  const encomenda = estado.ultimaEncomenda;

  if (!encomenda) {
    return <Navigate to="/carrinho" replace />;
  }

  const resumoEnvio =
    (encomenda.itens === 1 ? '1 peça' : `${encomenda.itens} peças`) +
    ' · ' +
    (encomenda.metodoEnvio === 'atelie' ? 'recolha no ateliê, Lisboa' : 'CTT Expresso, 2 a 4 dias úteis');

  return (
    <div style={{ maxWidth: 660 }}>
      <PassosIndicador passoAtual={3} />
      <h1 style={{ fontSize: 56, margin: '0 0 var(--space-3)', letterSpacing: '-0.025em' }}>Ficou registada.</h1>
      <p style={{ fontSize: 19, color: 'color-mix(in srgb,var(--color-text) 78%,transparent)' }}>
        Encomenda <strong>{encomenda.referencia}</strong>. Vai um e-mail com o resumo, e outro quando a máquina
        parar e a caixa seguir para os CTT.
      </p>
      <div
        aria-hidden="true"
        style={{
          height: 14,
          opacity: 'var(--ruffle-op)',
          background:
            'radial-gradient(circle at 12px -2px,transparent 11px,var(--color-accent-200) 11px) 0 0/24px 14px repeat-x',
          margin: 'var(--space-6) 0',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: 22 }}>
        <span>{encomenda.pago ? 'Total pago' : 'Total a confirmar'}</span>
        <span>{formatarEuros(encomenda.total)}</span>
      </div>
      {!encomenda.pago && (
        <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 70%,transparent)', marginTop: 'var(--space-2)' }}>
          Assim que confirmarmos o seu pagamento (até 3 dias úteis), a encomenda segue para produção.
        </p>
      )}
      <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-2)' }}>
        {resumoEnvio}
      </p>
      <Link to="/catalogo" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 'var(--space-4)', fontSize: 15, padding: '13px 26px' }}>
        Voltar à loja
      </Link>
    </div>
  );
}
