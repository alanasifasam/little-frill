// instância axios (baseURL da API .NET) + interceptor de pedido para
// Authorization e de resposta para normalizar erro { "error": "..." }
import axios, { type AxiosError } from 'axios';
import { CHAVE_SESSAO_AUTH, type Utilizador } from '../context/AuthContext';

export interface ErroApi {
  error: string;
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const bruto = localStorage.getItem(CHAVE_SESSAO_AUTH) ?? sessionStorage.getItem(CHAVE_SESSAO_AUTH);
  if (bruto) {
    const { token } = JSON.parse(bruto) as Utilizador;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (resposta) => resposta,
  (erro: AxiosError<{ error?: string }>) => {
    // 401 num pedido que já levava token = sessão expirada/inválida, não
    // credenciais erradas (isso é um 401 do próprio /auth/login, sem
    // Authorization, tratado à parte por quem chama login()). Limpa a
    // sessão e força reentrada — sem isto, o cabeçalho continua a mostrar
    // "sessão ativa" com dados presos no estado do React enquanto todos os
    // pedidos falham silenciosamente com uma mensagem genérica.
    const tinhaToken = Boolean(erro.config?.headers?.Authorization);
    if (erro.response?.status === 401 && tinhaToken) {
      localStorage.removeItem(CHAVE_SESSAO_AUTH);
      sessionStorage.removeItem(CHAVE_SESSAO_AUTH);
      window.location.href = '/entrar';
    }

    const mensagem =
      erro.response?.data?.error ??
      (erro.code === 'ERR_NETWORK'
        ? 'Não foi possível ligar ao servidor. Tente novamente dentro de momentos.'
        : 'Ocorreu um erro inesperado. Tente novamente.');
    const erroNormalizado: ErroApi = { error: mensagem };
    return Promise.reject(erroNormalizado);
  }
);
