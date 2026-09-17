// postEncomenda(payload) — POST /api/encomendas; getMinhasEncomendas() — GET /api/encomendas/minhas;
// getEncomenda(referencia) — GET /api/encomendas/{referencia}
import { client } from './client';
import type { EncomendaConfirmada, EncomendaDetalhe, EncomendaInput, EncomendaResumo } from '../models/encomenda';

export async function postEncomenda(payload: EncomendaInput): Promise<EncomendaConfirmada> {
  const { data } = await client.post<EncomendaConfirmada>('/encomendas', payload);
  return data;
}

export async function getMinhasEncomendas(): Promise<EncomendaResumo[]> {
  const { data } = await client.get<EncomendaResumo[]>('/encomendas/minhas');
  return data;
}

export async function getEncomenda(referencia: string): Promise<EncomendaDetalhe> {
  const { data } = await client.get<EncomendaDetalhe>(`/encomendas/${referencia}`);
  return data;
}
