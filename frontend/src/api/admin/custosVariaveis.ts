// GET /api/admin/custos-variaveis, POST /api/admin/custos-variaveis,
// PUT/DELETE /api/admin/custos-variaveis/{id}
import { client } from '../client';

export interface CustoVariavelDTO {
  id: number;
  label: string;
  valor: number;
  /** Data ISO (YYYY-MM-DD), adequada a um `<input type="date">`. */
  data: string;
}

export async function listarCustosVariaveis(): Promise<CustoVariavelDTO[]> {
  const { data } = await client.get<CustoVariavelDTO[]>('/admin/custos-variaveis');
  return data;
}

export type NovoCustoVariavel = Pick<CustoVariavelDTO, 'label' | 'valor' | 'data'>;
export type EdicaoCustoVariavel = Pick<CustoVariavelDTO, 'label' | 'valor' | 'data'>;

export async function criarCustoVariavel(input: NovoCustoVariavel): Promise<CustoVariavelDTO> {
  const { data } = await client.post<CustoVariavelDTO>('/admin/custos-variaveis', input);
  return data;
}

export async function atualizarCustoVariavel(id: number, input: EdicaoCustoVariavel): Promise<CustoVariavelDTO> {
  const { data } = await client.put<CustoVariavelDTO>(`/admin/custos-variaveis/${id}`, input);
  return data;
}

export async function removerCustoVariavel(id: number): Promise<void> {
  await client.delete(`/admin/custos-variaveis/${id}`);
}
