// aviso "adicionado ao carrinho" — role=status/aria-live, desaparece sozinho
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../../hooks/useCarrinho';

const DURACAO_MS = 2500;

export function Toast() {
  const { notificacao } = useCarrinho();
  const [visivel, setVisivel] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!notificacao) return;
    setVisivel(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisivel(false), DURACAO_MS);
    return () => clearTimeout(timerRef.current);
  }, [notificacao]);

  return (
    <div role="status" aria-live="polite" className={`toast card elev-sm${visivel ? ' toast-visivel' : ''}`}>
      {notificacao && (
        <>
          <span>{notificacao.mensagem}</span>
          <Link to="/carrinho" className="link-quiet" style={{ fontStyle: 'normal', whiteSpace: 'nowrap' }}>
            Ver carrinho
          </Link>
        </>
      )}
    </div>
  );
}
