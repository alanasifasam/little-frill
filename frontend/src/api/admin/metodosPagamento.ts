// GET /api/admin/metodos-pagamento, PUT/PATCH .../{metodo}[/ativo]
import { client } from '../client';

export interface MetodoPagamentoConfigDTO {
  metodo: 'mbway' | 'multibanco' | 'cartao' | 'transferencia';
  ativo: boolean;
  taxaPercent: number;
  custoFixo: number;
  iban: string | null;
  numeroMbway: string | null;
  nota: string;
}

export interface AtualizarMetodoPagamentoInput {
  taxaPercent: number;
  custoFixo: number;
  iban: string | null;
  numeroMbway: string | null;
  nota: string;
}

export async function getMetodosPagamentoAdmin(): Promise<MetodoPagamentoConfigDTO[]> {
  const { data } = await client.get<MetodoPagamentoConfigDTO[]>('/admin/metodos-pagamento');
  return data;
}

export async function atualizarMetodoPagamento(
  metodo: string,
  input: AtualizarMetodoPagamentoInput
): Promise<MetodoPagamentoConfigDTO> {
  const { data } = await client.put<MetodoPagamentoConfigDTO>(`/admin/metodos-pagamento/${metodo}`, input);
  return data;
}

export async function alternarAtivoMetodoPagamento(metodo: string): Promise<MetodoPagamentoConfigDTO> {
  const { data } = await client.patch<MetodoPagamentoConfigDTO>(`/admin/metodos-pagamento/${metodo}/ativo`);
  return data;
}
