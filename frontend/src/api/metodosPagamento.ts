// getMetodosPagamentoDisponiveis() — GET /api/metodos-pagamento (público, métodos ativos com dados de pagamento do ateliê)
import { client } from './client';
import type { MetodoPagamento } from '../models/encomenda';

export interface MetodoPagamentoDisponivel {
  metodo: MetodoPagamento;
  iban: string | null;
  numeroMbway: string | null;
}

export async function getMetodosPagamentoDisponiveis(): Promise<MetodoPagamentoDisponivel[]> {
  const { data } = await client.get<MetodoPagamentoDisponivel[]>('/metodos-pagamento');
  return data;
}
