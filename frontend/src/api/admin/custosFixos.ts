// GET /api/admin/custos-fixos, POST /api/admin/custos-fixos,
// PUT/DELETE /api/admin/custos-fixos/{id}
import { client } from '../client';

export interface CustoFixoDTO {
  id: number;
  label: string;
  valor: number;
  ativo: boolean;
}

export async function listarCustosFixos(): Promise<CustoFixoDTO[]> {
  const { data } = await client.get<CustoFixoDTO[]>('/admin/custos-fixos');
  return data;
}

export type NovoCustoFixo = Pick<CustoFixoDTO, 'label' | 'valor'>;
export type EdicaoCustoFixo = Pick<CustoFixoDTO, 'label' | 'valor' | 'ativo'>;

/** `ativo` é definido a `true` pelo servidor na criação. */
export async function criarCustoFixo(input: NovoCustoFixo): Promise<CustoFixoDTO> {
  const { data } = await client.post<CustoFixoDTO>('/admin/custos-fixos', input);
  return data;
}

export async function atualizarCustoFixo(id: number, input: EdicaoCustoFixo): Promise<CustoFixoDTO> {
  const { data } = await client.put<CustoFixoDTO>(`/admin/custos-fixos/${id}`, input);
  return data;
}

export async function removerCustoFixo(id: number): Promise<void> {
  await client.delete(`/admin/custos-fixos/${id}`);
}
