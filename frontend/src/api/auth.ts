// login(), registo() — POST /api/auth/login, POST /api/auth/registo
import { client } from './client';

export interface LoginInput {
  email: string;
  palavraPasse: string;
}

export interface RegistoInput {
  nome: string;
  sobrenome: string;
  email: string;
  palavraPasse: string;
  codigoPostal?: string;
  distrito?: string;
  querCarta?: boolean;
}

export interface AuthResposta {
  token: string;
  nome: string;
  email: string;
  role: string;
}

export async function login(payload: LoginInput): Promise<AuthResposta> {
  const { data } = await client.post<AuthResposta>('/auth/login', payload);
  return data;
}

export async function registo(payload: RegistoInput): Promise<AuthResposta> {
  const { data } = await client.post<AuthResposta>('/auth/registo', payload);
  return data;
}
