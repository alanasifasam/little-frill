// Encomenda (admin) — estado/metodo partilham vocabulário com o modelo
// público (`models/encomenda.ts`), agora que o back-end real usa o mesmo
// `Core.Enums.EstadoEncomenda` dos dois lados (regra 7): o que o admin grava
// aqui é exatamente o que a cliente vê em "Os meus pedidos".
import type { EstadoEncomenda, MetodoPagamento } from '../encomenda';

export type { EstadoEncomenda, MetodoPagamento };

export type MetodoEnvioAdmin = 'ctt' | 'atelie';

/** Label de cada método de pagamento para as tabelas/listas do admin — o
 * backend não devolve `label`, só a chave (mesmo padrão de `ESTADOS_ENCOMENDA`
 * em `models/encomenda.ts`). */
export const LABEL_METODO_PAGAMENTO: Record<string, string> = {
  mbway: 'MB WAY',
  multibanco: 'Multibanco',
  cartao: 'Cartão',
  transferencia: 'Transferência bancária',
};

export interface LinhaEncomenda {
  id: number;
  qty: number;
}

export interface Encomenda {
  /** "CA-1200" */
  ref: string;
  /** Dia do mês (no protótipo; a API real envia `DateTime` em `criada`, do
   * qual isto é derivado). */
  dia: number;
  /** null = venda de balcão, sem conta. */
  clienteId: number | null;
  estado: EstadoEncomenda;
  metodo: MetodoPagamento;
  pago: boolean;
  /** "DW 1204 7788 3 PT" ou "—". */
  rastreio: string;
  envio: MetodoEnvioAdmin;
  linhas: LinhaEncomenda[];
}
