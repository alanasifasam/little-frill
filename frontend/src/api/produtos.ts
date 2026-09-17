// getProdutos(filtros), getProduto(id) — GET /api/produtos, GET /api/produtos/{id}
import { client } from './client';
import { CORES, type Padrao, type Produto, type Sec } from '../models/produto';

export interface FiltrosProdutos {
  sec?: Sec;
  padrao?: Padrao;
  cor?: keyof typeof CORES;
  precoMax?: number;
  soStock?: boolean;
  destaque?: boolean;
  nova?: boolean;
  ordenar?: 'destaque' | 'baratos' | 'caros' | 'nome';
}

export async function getProdutos(filtros: FiltrosProdutos = {}): Promise<Produto[]> {
  const { data } = await client.get<Produto[]>('/produtos', { params: filtros });
  return data;
}

export async function getProduto(id: number): Promise<Produto | undefined> {
  const { data } = await client.get<Produto>(`/produtos/${id}`);
  return data;
}
