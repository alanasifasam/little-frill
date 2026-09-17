// GET /api/admin/stock, POST /api/admin/stock/{entrada|saida|venda}
import { client } from '../client';
import type { MotivoSaida } from '../../models/admin/movimentoStock';

export interface ItemInventario {
  produtoId: number;
  nome: string;
  tecido: string;
  custo: number;
  preco: number;
  entradas: number;
  saidas: number;
  vendidas: number;
  stock: number;
}

export interface MovimentoStockAdmin {
  data: string;
  tipo: 'entrada' | 'saida';
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  motivo?: MotivoSaida;
}

export interface StockDTO {
  inventario: ItemInventario[];
  movimentos: MovimentoStockAdmin[];
  valorStock: number;
}

export async function getStock(): Promise<StockDTO> {
  const { data } = await client.get<StockDTO>('/admin/stock');
  return data;
}

export async function registarEntrada(produtoId: number, quantidade: number): Promise<MovimentoStockAdmin> {
  const { data } = await client.post<MovimentoStockAdmin>('/admin/stock/entrada', { produtoId, quantidade });
  return data;
}

export async function registarSaida(produtoId: number, quantidade: number, motivo: MotivoSaida): Promise<MovimentoStockAdmin> {
  const { data } = await client.post<MovimentoStockAdmin>('/admin/stock/saida', { produtoId, quantidade, motivo });
  return data;
}

export async function registarVenda(produtoId: number, quantidade: number): Promise<{ referencia: string }> {
  const { data } = await client.post<{ referencia: string }>('/admin/stock/venda', { produtoId, quantidade });
  return data;
}
