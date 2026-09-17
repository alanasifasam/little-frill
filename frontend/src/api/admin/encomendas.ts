// GET /api/admin/encomendas, PUT .../{ref}/estado, PATCH .../{ref}/rastreio|pago,
// POST .../{ref}/anular|reabrir, DELETE .../{ref}
import { client } from '../client';
import type { Encomenda, EstadoEncomenda, MetodoEnvioAdmin, MetodoPagamento } from '../../models/admin/encomenda';
import type { EncomendaDetalhe } from '../../models/encomenda';

export interface EncomendaLinha extends Encomenda {
  clienteNome: string;
  localidade: string;
  pecas: number;
  total: number;
}

/** Forma exata de `EncomendaAdminViewModel` (C#, serializado em camelCase). */
interface EncomendaAdminDTO {
  referencia: string;
  criada: string;
  clienteId: number | null;
  clienteNome: string;
  localidade: string;
  estado: EstadoEncomenda;
  metodo: MetodoPagamento;
  pago: boolean;
  rastreio: string;
  metodoEnvio: MetodoEnvioAdmin;
  numeroItens: number;
  total: number;
}

/** A listagem só devolve o agregado (`numeroItens`/`total`), não item a
 * item — `linhas` fica vazio, esta página não o usa (mostra `pecas`/`total`
 * já prontos). */
function linha(dto: EncomendaAdminDTO): EncomendaLinha {
  return {
    ref: dto.referencia,
    dia: new Date(dto.criada).getDate(),
    clienteId: dto.clienteId,
    estado: dto.estado,
    metodo: dto.metodo,
    pago: dto.pago,
    rastreio: dto.rastreio,
    envio: dto.metodoEnvio,
    linhas: [],
    clienteNome: dto.clienteNome,
    localidade: dto.localidade,
    pecas: dto.numeroItens,
    total: dto.total,
  };
}

export async function getEncomendasAdmin(): Promise<EncomendaLinha[]> {
  const { data } = await client.get<EncomendaAdminDTO[]>('/admin/encomendas');
  return data.map(linha);
}

/** Detalhe item a item de uma encomenda (regra de negócio §1) — mesma forma
 * que `EncomendaDetalhe` usada em "Os meus pedidos", com `clienteId`/
 * `clienteNome` a mais (venda de balcão tem `clienteId: null`) e `entrega`
 * nullable, porque nem toda encomenda de admin tem morada. */
export interface EncomendaAdminDetalhe extends Omit<EncomendaDetalhe, 'entrega'> {
  clienteId: number | null;
  clienteNome: string;
  entrega: EncomendaDetalhe['entrega'] | null;
}

export async function getEncomendaAdminDetalhe(ref: string): Promise<EncomendaAdminDetalhe> {
  const { data } = await client.get<EncomendaAdminDetalhe>(`/admin/encomendas/${ref}`);
  return data;
}

export async function definirRastreio(ref: string, codigo: string): Promise<EncomendaLinha> {
  const { data } = await client.patch<EncomendaAdminDTO>(`/admin/encomendas/${ref}/rastreio`, { codigoRastreio: codigo });
  return linha(data);
}

/** O admin escolhe livremente o estado (select, como no protótipo) — não é
 * obrigado a seguir o fluxo por ordem, pode voltar atrás para corrigir um
 * engano. Pode rejeitar (400) se tentar "enviada" sem código de rastreio
 * definido, ou (409) se a encomenda estiver anulada (tem de reabrir primeiro). */
export async function definirEstado(ref: string, estado: EstadoEncomenda): Promise<EncomendaLinha> {
  const { data } = await client.put<EncomendaAdminDTO>(`/admin/encomendas/${ref}/estado`, { estado });
  return linha(data);
}

export async function alternarPago(ref: string): Promise<EncomendaLinha> {
  const { data } = await client.patch<EncomendaAdminDTO>(`/admin/encomendas/${ref}/pago`);
  return linha(data);
}

/** Anular tira a encomenda de todas as contas e devolve o stock (regra 4). */
export async function anular(ref: string): Promise<EncomendaLinha> {
  const { data } = await client.post<EncomendaAdminDTO>(`/admin/encomendas/${ref}/anular`);
  return linha(data);
}

/** Reabrir restaura o estado exato anterior à anulação — não reinicia do
 * princípio. Pode rejeitar (409) se o stock já não estiver disponível. */
export async function reabrir(ref: string): Promise<EncomendaLinha> {
  const { data } = await client.post<EncomendaAdminDTO>(`/admin/encomendas/${ref}/reabrir`);
  return linha(data);
}

/** Apaga (soft-delete) — só é aceite pelo servidor se a encomenda já
 * estiver anulada. */
export async function apagarEncomenda(ref: string): Promise<void> {
  await client.delete(`/admin/encomendas/${ref}`);
}
