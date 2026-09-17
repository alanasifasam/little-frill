// logo Little Frill, Entrar/Criar conta, botão carrinho, barra de secções (régua 3px+1px)
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../hooks/useCarrinho';
import { useAuth } from '../../hooks/useAuth';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { SECOES } from '../../models/produto';
import { formatarEuros } from '../../lib/moeda';

export function Header() {
  const { totalItens, notificacao } = useCarrinho();
  const { utilizador, sair } = useAuth();
  const { siteInfo } = useSiteInfo();
  const navigate = useNavigate();
  const [pulsar, setPulsar] = useState(false);

  useEffect(() => {
    if (!notificacao) return;
    setPulsar(true);
    const timer = setTimeout(() => setPulsar(false), 500);
    return () => clearTimeout(timer);
  }, [notificacao]);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 var(--space-6)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', padding: 'var(--space-4) 0 var(--space-2)' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 30,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Little Frill
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginTop: 5,
              }}
            >
              by Arrais
            </div>
            <div
              style={{
                fontStyle: 'italic',
                fontSize: 14,
                color: 'color-mix(in srgb,var(--color-text) 62%,transparent)',
                marginTop: 3,
              }}
            >
              feito à mão, feito com calma
            </div>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {utilizador ? (
              <>
                <Link to="/minhas-encomendas" style={{ fontSize: 13 }}>
                  Meus pedidos
                </Link>
                {utilizador.role === 'admin' && (
                  <Link to="/admin" style={{ fontSize: 13 }}>
                    Administração
                  </Link>
                )}
                <span style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                  {utilizador.nome}
                </span>
                <button
                  type="button"
                  className="link-quiet"
                  style={{ fontStyle: 'normal' }}
                  onClick={() => {
                    sair();
                    navigate('/');
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/entrar" style={{ fontSize: 13 }}>
                  Entrar
                </Link>
                <Link to="/registo" style={{ fontSize: 13 }}>
                  Criar conta
                </Link>
              </>
            )}
            <Link
              to="/carrinho"
              className={`btn btn-primary${pulsar ? ' cart-pulse' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              Carrinho · {totalItens}
            </Link>
          </div>
        </div>
        <div style={{ height: 3, background: 'var(--color-text)' }} />
        <nav className="nav" aria-label="Secções" style={{ padding: '7px 0' }}>
          {SECOES.filter((s) => siteInfo.seccoesAtivas.includes(s.key)).map((s) => (
            <NavLink
              key={s.key}
              to={`/catalogo/${s.key}`}
              style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {s.label}
            </NavLink>
          ))}
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              fontStyle: 'italic',
              color: siteInfo.feriasLigadas ? 'var(--color-accent-700)' : 'color-mix(in srgb,var(--color-text) 55%,transparent)',
            }}
          >
            {siteInfo.feriasLigadas
              ? 'De férias — encomendas novas podem demorar mais a preparar.'
              : `Envio grátis acima de ${formatarEuros(siteInfo.envioLimiarGratis)}`}
          </span>
        </nav>
        <div style={{ height: 1, background: 'var(--color-text)' }} />
      </div>
    </div>
  );
}
