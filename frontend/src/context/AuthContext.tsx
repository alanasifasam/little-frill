// Context da sessão — utilizador { nome, email, token } | null, guardado em
// localStorage (sessão persistente) ou sessionStorage (só a aba), conforme
// "Manter sessão" no login
import { createContext, useState, type ReactNode } from 'react';
import type { Papel } from '../lib/papel';

export const CHAVE_SESSAO_AUTH = 'lf_auth';

export interface Utilizador {
  nome: string;
  email: string;
  token: string;
  role: Papel;
}

export interface AuthContextValue {
  utilizador: Utilizador | null;
  entrar: (dados: Utilizador, manter: boolean) => void;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function lerUtilizadorGuardado(): Utilizador | null {
  try {
    const bruto = localStorage.getItem(CHAVE_SESSAO_AUTH) ?? sessionStorage.getItem(CHAVE_SESSAO_AUTH);
    return bruto ? (JSON.parse(bruto) as Utilizador) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(lerUtilizadorGuardado);

  function entrar(dados: Utilizador, manter: boolean) {
    localStorage.removeItem(CHAVE_SESSAO_AUTH);
    sessionStorage.removeItem(CHAVE_SESSAO_AUTH);
    (manter ? localStorage : sessionStorage).setItem(CHAVE_SESSAO_AUTH, JSON.stringify(dados));
    setUtilizador(dados);
  }

  function sair() {
    localStorage.removeItem(CHAVE_SESSAO_AUTH);
    sessionStorage.removeItem(CHAVE_SESSAO_AUTH);
    setUtilizador(null);
  }

  return <AuthContext.Provider value={{ utilizador, entrar, sair }}>{children}</AuthContext.Provider>;
}
