// Context + useReducer (ADD, REMOVER, SET_QTY, LIMPAR); estado = LinhaCarrinho[]
import { createContext, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import type { LinhaCarrinho } from '../models/carrinho';

export interface NotificacaoCarrinho {
  mensagem: string;
  ts: number;
}

export type AcaoCarrinho =
  | { type: 'ADD'; id: number; qty?: number }
  | { type: 'REMOVER'; id: number }
  | { type: 'SET_QTY'; id: number; qty: number }
  | { type: 'LIMPAR' };

function reducer(state: LinhaCarrinho[], acao: AcaoCarrinho): LinhaCarrinho[] {
  switch (acao.type) {
    case 'ADD': {
      const existente = state.find((l) => l.id === acao.id);
      if (existente) {
        return state.map((l) => (l.id === acao.id ? { ...l, qty: l.qty + (acao.qty ?? 1) } : l));
      }
      return [...state, { id: acao.id, qty: acao.qty ?? 1 }];
    }
    case 'REMOVER':
      return state.filter((l) => l.id !== acao.id);
    case 'SET_QTY':
      return state.map((l) => (l.id === acao.id ? { ...l, qty: Math.max(1, acao.qty) } : l));
    case 'LIMPAR':
      return [];
    default:
      return state;
  }
}

export interface CarrinhoContextValue {
  linhas: LinhaCarrinho[];
  dispatch: Dispatch<AcaoCarrinho>;
  notificacao: NotificacaoCarrinho | null;
  notificar: (mensagem: string) => void;
}

export const CarrinhoContext = createContext<CarrinhoContextValue | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [linhas, dispatch] = useReducer(reducer, []);
  const [notificacao, setNotificacao] = useState<NotificacaoCarrinho | null>(null);

  function notificar(mensagem: string) {
    setNotificacao({ mensagem, ts: Date.now() });
  }

  return (
    <CarrinhoContext.Provider value={{ linhas, dispatch, notificacao, notificar }}>
      {children}
    </CarrinhoContext.Provider>
  );
}
