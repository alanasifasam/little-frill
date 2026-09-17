// mensagemErro() — extrai a mensagem de um ErroApi normalizado pelo
// interceptor de resposta do client (api/client.ts), com fallback
import type { ErroApi } from '../api/client';

export function mensagemErro(erro: unknown, fallback: string): string {
  if (typeof erro === 'object' && erro !== null && 'error' in erro) {
    const erroApi = erro as ErroApi;
    if (typeof erroApi.error === 'string' && erroApi.error) return erroApi.error;
  }
  return fallback;
}
