// radio mbway|multibanco|cartao|transferencia + campos condicionais + checkbox fatura com NIF
import { RadioOption } from '../ui/RadioOption';
import { Field } from '../ui/Field';
import type { MetodoPagamento } from '../../models/encomenda';
import type { MetodoPagamentoDisponivel } from '../../api/metodosPagamento';

export interface CartaoDados {
  numero: string;
  validade: string;
  cvv: string;
}

export interface PagamentoOpcoesProps {
  metodo: MetodoPagamento;
  onMetodoChange: (metodo: MetodoPagamento) => void;
  cartao: CartaoDados;
  onCartaoChange: (cartao: CartaoDados) => void;
  querFatura: boolean;
  onQuerFaturaChange: (valor: boolean) => void;
  nif: string;
  onNifChange: (valor: string) => void;
  erros?: Record<string, string>;
  /** Métodos ativos + dados de pagamento do ateliê (vindos do backend). Vazio = ainda a carregar, mostra tudo. */
  metodosDisponiveis: MetodoPagamentoDisponivel[];
}

const METODOS: { key: MetodoPagamento; label: string; nota: string }[] = [
  { key: 'mbway', label: 'MB WAY', nota: 'Transfere para o nosso número' },
  { key: 'multibanco', label: 'Multibanco', nota: 'Damos entidade e referência, válidas 3 dias' },
  { key: 'cartao', label: 'Cartão', nota: 'Visa ou Mastercard' },
  { key: 'transferencia', label: 'Transferência bancária', nota: 'Mostramos aqui o nosso IBAN' },
];

const NOTA_CONFIRMACAO =
  'Assim que confirmarmos o pagamento (até 3 dias úteis), a encomenda segue para produção e depois para envio.';

export function PagamentoOpcoes({
  metodo,
  onMetodoChange,
  cartao,
  onCartaoChange,
  querFatura,
  onQuerFaturaChange,
  nif,
  onNifChange,
  erros,
  metodosDisponiveis,
}: PagamentoOpcoesProps) {
  const metodosVisiveis =
    metodosDisponiveis.length > 0
      ? METODOS.filter((m) => metodosDisponiveis.some((d) => d.metodo === m.key))
      : METODOS;

  const configMbway = metodosDisponiveis.find((d) => d.metodo === 'mbway');
  const configTransferencia = metodosDisponiveis.find((d) => d.metodo === 'transferencia');

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {metodosVisiveis.map((m) => (
          <RadioOption
            key={m.key}
            id={`pag-${m.key}`}
            name="pagamento"
            checked={metodo === m.key}
            onChange={() => onMetodoChange(m.key)}
            label={m.label}
            nota={m.nota}
          />
        ))}
      </div>

      {metodo === 'cartao' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <Field
            label="Número do cartão"
            id="cartao-numero"
            placeholder="0000 0000 0000 0000"
            value={cartao.numero}
            error={erros?.numero}
            style={{ gridColumn: 'span 2' }}
            onChange={(e) => onCartaoChange({ ...cartao, numero: e.target.value })}
          />
          <Field
            label="Validade"
            id="cartao-validade"
            placeholder="MM/AA"
            value={cartao.validade}
            error={erros?.validade}
            onChange={(e) => onCartaoChange({ ...cartao, validade: e.target.value })}
          />
          <Field
            label="CVV"
            id="cartao-cvv"
            placeholder="123"
            value={cartao.cvv}
            error={erros?.cvv}
            onChange={(e) => onCartaoChange({ ...cartao, cvv: e.target.value })}
          />
        </div>
      )}

      {metodo === 'mbway' && (
        <div
          style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {configMbway?.numeroMbway ? (
            <>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>Envie o pagamento para o MB WAY</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginTop: 2 }}>{configMbway.numeroMbway}</div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>Vamos enviar-lhe o nosso número de MB WAY por e-mail.</div>
          )}
          <p style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-2)' }}>
            {NOTA_CONFIRMACAO}
          </p>
        </div>
      )}

      {metodo === 'transferencia' && (
        <div
          style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {configTransferencia?.iban ? (
            <>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>Transfira para o IBAN</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginTop: 2 }}>{configTransferencia.iban}</div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>Vamos enviar-lhe o nosso IBAN por e-mail.</div>
          )}
          <p style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-2)' }}>
            {NOTA_CONFIRMACAO}
          </p>
        </div>
      )}

      <RadioOption
        type="checkbox"
        square
        id="quer-fatura"
        checked={querFatura}
        onChange={() => onQuerFaturaChange(!querFatura)}
        label="Quero fatura com NIF"
        style={{ marginTop: 'var(--space-6)' }}
      />
      {querFatura && (
        <div style={{ maxWidth: 280, marginTop: 'var(--space-3)' }}>
          <Field label="NIF" id="nif" placeholder="123456789" value={nif} error={erros?.nif} onChange={(e) => onNifChange(e.target.value)} />
        </div>
      )}
    </div>
  );
}
