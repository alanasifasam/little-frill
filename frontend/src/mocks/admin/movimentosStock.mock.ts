// os movimentos de stock do protótipo (MOVS0) + rótulos dos motivos de saída
import type { MotivoSaida, MovimentoStock } from '../../models/admin/movimentoStock';

export const MOVS_MOCK: MovimentoStock[] = [
  { dia: 1, tipo: 'entrada', id: 5, qty: 12 },
  { dia: 3, tipo: 'entrada', id: 9, qty: 8 },
  { dia: 6, tipo: 'saida', id: 3, qty: 1, motivo: 'quebra' },
  { dia: 9, tipo: 'entrada', id: 3, qty: 6 },
  { dia: 10, tipo: 'saida', id: 17, qty: 2, motivo: 'amostra' },
  { dia: 13, tipo: 'entrada', id: 1, qty: 3 },
  { dia: 16, tipo: 'entrada', id: 19, qty: 2 },
];

export const MOTIVOS: Record<MotivoSaida, string> = {
  quebra: 'Quebra',
  amostra: 'Amostra',
  presente: 'Presente',
};
