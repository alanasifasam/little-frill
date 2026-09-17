// GET /api/admin/vendas — caixa dia a dia, ranking, talão médio
import { client } from '../client';
import type { CORES, Padrao } from '../../models/produto';

export interface CaixaDiaLinha {
  dia: number;
  refs: string[];
  pecas: number;
  total: number;
  barraPct: number;
}

export interface RankingLinha {
  produtoId: number;
  nome: string;
  padrao: Padrao;
  cor: keyof typeof CORES;
  qty: number;
  barraPct: number;
  /** Key relativa do blob da foto de capa da peça — sem foto, mostra-se o padrão do tecido (swatch). */
  fotoKey?: string;
  fotoFocoX?: number;
  fotoFocoY?: number;
}

export interface VendasDTO {
  mesNome: string;
  receita: number;
  nEncomendas: number;
  nPecas: number;
  nDiasComVendas: number;
  talaoMedio: number;
  melhorDia: { dia: number; total: number } | null;
  caixaDias: CaixaDiaLinha[];
  ranking: RankingLinha[];
}

export async function getVendas(): Promise<VendasDTO> {
  const { data } = await client.get<VendasDTO>('/admin/vendas');
  return data;
}
