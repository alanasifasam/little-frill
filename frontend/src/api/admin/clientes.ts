// GET/POST /api/admin/clientes, PUT/DELETE /api/admin/clientes/{id}
import { client } from '../client';
import type { Cliente } from '../../models/admin/cliente';

export interface ClienteLinha extends Cliente {
  nEncomendas: number;
  gasto: number;
  fiel: boolean;
}

/** Forma do ClienteAdminViewModel (C#) — telefone/cp/localidade são opcionais no backend. */
interface ClienteAdminDTO {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string | null;
  cp: string | null;
  localidade: string | null;
  nEncomendas: number;
  gasto: number;
  fiel: boolean;
}

/** Absorve a diferença de nomes (telefone ↔ tel) e nulos ↔ string vazia entre a API e o frontend. */
function paraLinha(dto: ClienteAdminDTO): ClienteLinha {
  return {
    id: dto.id,
    nome: dto.nome,
    sobrenome: dto.sobrenome,
    email: dto.email,
    tel: dto.telefone ?? '',
    cp: dto.cp ?? '',
    localidade: dto.localidade ?? '',
    nEncomendas: dto.nEncomendas,
    gasto: dto.gasto,
    fiel: dto.fiel,
  };
}

export async function getClientesAdmin(): Promise<ClienteLinha[]> {
  const { data } = await client.get<ClienteAdminDTO[]>('/admin/clientes');
  return data.map(paraLinha);
}

export type NovoCliente = Omit<Cliente, 'id'>;

/** Forma do ClienteAdminInputModel (C#) esperada pelo POST/PUT. */
interface ClienteInputDTO {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string | null;
  cp: string | null;
  localidade: string | null;
}

function paraInput(dados: NovoCliente): ClienteInputDTO {
  return {
    nome: dados.nome,
    sobrenome: dados.sobrenome,
    email: dados.email,
    telefone: dados.tel || null,
    cp: dados.cp || null,
    localidade: dados.localidade || null,
  };
}

export async function criarCliente(dados: NovoCliente): Promise<ClienteLinha> {
  const { data } = await client.post<ClienteAdminDTO>('/admin/clientes', paraInput(dados));
  return paraLinha(data);
}

export async function editarCliente(id: number, dados: NovoCliente): Promise<ClienteLinha> {
  const { data } = await client.put<ClienteAdminDTO>(`/admin/clientes/${id}`, paraInput(dados));
  return paraLinha(data);
}

export interface ApagarClienteResultado {
  apagado: boolean;
  nome: string;
}

/** Cliente com encomendas no histórico não é apagado (regra 5). */
export async function apagarCliente(id: number): Promise<ApagarClienteResultado> {
  const { data } = await client.delete<ApagarClienteResultado>(`/admin/clientes/${id}`);
  return data;
}
