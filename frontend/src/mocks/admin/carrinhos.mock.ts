// os 3 carrinhos do protótipo (CARRINHOS0); clienteId 0 (visitante) vira null,
// forma tipada de "sem conta" (o campo `dia` do protótipo não é usado em lado nenhum)
import type { Carrinho } from '../../models/admin/carrinho';

export const CARRINHOS_MOCK: Carrinho[] = [
  { id: 1, clienteId: 3, horas: 20, linhas: [{ id: 1, qty: 1 }, { id: 5, qty: 1 }] },
  { id: 2, clienteId: 5, horas: 44, linhas: [{ id: 7, qty: 1 }] },
  { id: 3, clienteId: null, horas: 3, linhas: [{ id: 9, qty: 2 }, { id: 17, qty: 1 }] },
];
