// GET /api/admin/seccoes + PATCH .../{chave}/ativa — visibilidade de secções
// do separador Site.
import { client } from '../client';

export interface SeccaoConfigDTO {
  seccao: 'acessorios' | 'bebe' | 'mesa' | 'banho' | 'cama' | 'cozinha' | 'animais';
  ativa: boolean;
}

export async function getSeccoes(): Promise<SeccaoConfigDTO[]> {
  const { data } = await client.get<SeccaoConfigDTO[]>('/admin/seccoes');
  return data;
}

export async function alternarSeccao(chave: string): Promise<SeccaoConfigDTO> {
  const { data } = await client.patch<SeccaoConfigDTO>(`/admin/seccoes/${chave}/ativa`);
  return data;
}
