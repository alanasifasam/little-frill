// Header + <Outlet/> + Footer, max-width 1180px
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from '../ui/Toast';

export function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Header />
      <Toast />
      <main
        style={{
          flex: 1,
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6) 80px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
