// consome AdminStockContext — sinal partilhado entre useAdminStock e useAdminProdutos
import { useContext } from 'react';
import { AdminStockContext } from '../../context/AdminStockContext';

export function useAdminStockContext() {
  const ctx = useContext(AdminStockContext);
  if (!ctx) {
    throw new Error('useAdminStockContext tem de ser usado dentro de <AdminStockProvider>.');
  }
  return ctx;
}
