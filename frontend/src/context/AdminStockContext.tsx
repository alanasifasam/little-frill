// Context fino só para sinalizar "o stock mudou" entre useAdminStock (que
// grava movimentos) e useAdminProdutos (que mostra a coluna de stock) — os
// dois hooks continuam donos do seu próprio estado, isto é só o sinal.
import { createContext, useState, type ReactNode } from 'react';

export interface AdminStockContextValue {
  versao: number;
  notificarStockAlterado: () => void;
}

export const AdminStockContext = createContext<AdminStockContextValue | undefined>(undefined);

export function AdminStockProvider({ children }: { children: ReactNode }) {
  const [versao, setVersao] = useState(0);

  function notificarStockAlterado() {
    setVersao((v) => v + 1);
  }

  return (
    <AdminStockContext.Provider value={{ versao, notificarStockAlterado }}>
      {children}
    </AdminStockContext.Provider>
  );
}
