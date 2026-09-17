// linha do tempo com as 5 etapas reais da encomenda, hora exata quando alcançada
import type { EstadoEncomenda } from '../../models/encomenda';

const ETAPAS: { estado: EstadoEncomenda; label: string; descricao: string }[] = [
  { estado: 'novo', label: 'Recebida', descricao: 'Pagamento confirmado. Entra na fila da máquina.' },
  { estado: 'em producao', label: 'Em produção', descricao: 'Cosemos por ordem de chegada.' },
  { estado: 'embalada', label: 'Embalada', descricao: 'Vai com etiqueta e cartão escrito à mão.' },
  { estado: 'enviada', label: 'Enviada', descricao: 'Entregamos aos CTT no dia seguinte.' },
  { estado: 'entregue', label: 'Entregue', descricao: '2 a 4 dias úteis depois do envio.' },
];

function formatarDataHora(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' });
}

export interface LinhaTempoEncomendaProps {
  estado: EstadoEncomenda;
  criada: string;
  pago: boolean;
  dataEmProducao?: string | null;
  dataEmbalada?: string | null;
  dataEnviada?: string | null;
  dataEntregue?: string | null;
}

export function LinhaTempoEncomenda({
  estado,
  criada,
  pago,
  dataEmProducao,
  dataEmbalada,
  dataEnviada,
  dataEntregue,
}: LinhaTempoEncomendaProps) {
  const indiceAtual = ETAPAS.findIndex((e) => e.estado === estado);
  const etapas = pago
    ? ETAPAS
    : ETAPAS.map((etapa) =>
        etapa.estado === 'novo' ? { ...etapa, descricao: 'A aguardar confirmação do pagamento.' } : etapa
      );
  const datas: Record<EstadoEncomenda, string | null | undefined> = {
    novo: criada,
    'em producao': dataEmProducao,
    embalada: dataEmbalada,
    enviada: dataEnviada,
    entregue: dataEntregue,
    anulada: null,
  };

  return (
    <div style={{ display: 'flex', marginTop: 'var(--space-4)' }}>
      {etapas.map((etapa, i) => {
        const alcancada = i <= indiceAtual;
        return (
          <div key={etapa.estado} style={{ flex: i === etapas.length - 1 ? '0 0 auto' : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                aria-hidden="true"
                style={{
                  width: 13,
                  height: 13,
                  flex: 'none',
                  borderRadius: '50%',
                  background: alcancada ? 'var(--color-accent)' : 'var(--color-bg)',
                  boxShadow: alcancada
                    ? '0 0 0 3px var(--color-accent-200)'
                    : 'inset 0 0 0 2px var(--color-accent-300)',
                }}
              />
              {i < etapas.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    height: 1,
                    background: i < indiceAtual ? 'var(--color-accent)' : 'var(--color-divider)',
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 15,
                marginTop: 'var(--space-2)',
                color: alcancada ? 'var(--color-text)' : 'color-mix(in srgb,var(--color-text) 48%,transparent)',
              }}
            >
              {etapa.label}
            </div>
            <div style={{ fontSize: 12, marginTop: 2, color: 'color-mix(in srgb,var(--color-text) 50%,transparent)' }}>
              {formatarDataHora(datas[etapa.estado])}
            </div>
            <div
              style={{
                fontSize: 13,
                marginTop: 4,
                maxWidth: '14em',
                color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
              }}
            >
              {etapa.descricao}
            </div>
          </div>
        );
      })}
    </div>
  );
}
