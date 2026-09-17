// logo Little Frill + data + separador de secções do admin (régua 3px + 1px)
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

const ABAS = [
  { to: '/admin', label: 'Painel', fim: true },
  { to: '/admin/stock', label: 'Stock' },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/encomendas', label: 'Encomendas' },
  { to: '/admin/carrinhos', label: 'Carrinhos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/pagamentos', label: 'Pagamentos' },
  { to: '/admin/vendas', label: 'Vendas e caixa' },
  { to: '/admin/financeiro', label: 'Custos e lucro' },
  { to: '/admin/site', label: 'Site e manutenção' },
];

const hoje = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

export function AdminHeader() {
  const { utilizador, sair } = useAuth();

  function logout() {
    // Navegação de página inteira, não useNavigate: o router é assíncrono
    // (mesmo para rotas sem lazy loading), por isso limpar a sessão e navegar
    // no cliente corre o risco do AdminLayout, ainda montado, ver
    // utilizador===null a meio da transição e redirecionar para /entrar em
    // vez de deixar este "Sair" levar diretamente à loja.
    sair();
    window.location.href = '/';
  }

  return (
    <div style={{ borderBottom: '3px solid var(--color-text)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'var(--space-6) var(--space-6) 0', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, lineHeight: 1, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
              Little Frill
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginTop: 4 }}>
              by Arrais · administração do ateliê
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <Link to="/" className="btn btn-primary" style={{ fontSize: 13, padding: '7px 14px' }}>
                Ver site de vendas
              </Link>
              <Button type="button" variant="primary" style={{ fontSize: 13, padding: '7px 14px' }} onClick={logout}>
                Sair
              </Button>
            </div>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginTop: 4 }}>{hoje}</div>
            <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
              {utilizador ? utilizador.nome : 'Maria Arrais'} · ateliê Lisboa
            </div>
          </div>
        </div>
        <nav
          aria-label="Separadores da administração"
          style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-3)', flexWrap: 'wrap' }}
        >
          {ABAS.map((aba) => (
            <NavLink
              key={aba.to}
              to={aba.to}
              end={aba.fim}
              style={({ isActive }) => ({
                fontSize: 15,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--color-text)' : 'color-mix(in srgb,var(--color-text) 62%,transparent)',
                paddingBottom: 'var(--space-3)',
                boxShadow: isActive ? 'inset 0 -3px 0 var(--color-accent)' : 'inset 0 -3px 0 transparent',
                textDecoration: 'none',
              })}
            >
              {aba.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
