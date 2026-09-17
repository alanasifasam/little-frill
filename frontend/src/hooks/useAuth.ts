// consome AuthContext — utilizador atual + entrar/sair
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth tem de ser usado dentro de <AuthProvider>.');
  }
  return ctx;
}
