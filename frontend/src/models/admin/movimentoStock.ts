// MovimentoStock — entradas e saídas de stock (AdminEspec §2)

export type TipoMovimentoStock = 'entrada' | 'saida';

export type MotivoSaida = 'quebra' | 'amostra' | 'presente';

export interface MovimentoStock {
  dia: number;
  tipo: TipoMovimentoStock;
  /** id do produto. */
  id: number;
  qty: number;
  /** Só nas saídas. */
  motivo?: MotivoSaida;
}
