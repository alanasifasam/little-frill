// chrome próprio da administração (AdminHeader + <Outlet/> + AdminFooter), max-width 1240px —
// não é o Layout da loja: sem carrinho, sem nav de secções, rodapé diferente
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminFooter } from '../admin/AdminFooter';
import { useAuth } from '../../hooks/useAuth';
import { AdminStockProvider } from '../../context/AdminStockContext';

export function AdminLayout() {
  const { utilizador } = useAuth();
  const location = useLocation();

  if (utilizador === null) {
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  if (utilizador.role !== 'admin') {
    return (
      <div style={{ padding: 'var(--space-8) 0' }}>
        <h3 style={{ fontSize: 26, marginBottom: 'var(--space-2)' }}>
          Esta área é reservada à administração do ateliê.
        </h3>
        <p style={{ maxWidth: '26em', color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
          Se acha que devia ter acesso, contacte o ateliê.
        </p>
        <Link to="/" style={{ display: 'inline-block', marginTop: 'var(--space-3)' }}>
          Voltar à loja
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <AdminHeader />
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: 'var(--space-6)', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        <AdminStockProvider>
          <Outlet />
        </AdminStockProvider>
      </main>
      <AdminFooter />
    </div>
  );
}
