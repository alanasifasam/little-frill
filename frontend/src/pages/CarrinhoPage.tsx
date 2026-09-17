// lista de LinhaCarrinho + ResumoCarrinho, via useCarrinho
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../hooks/useCarrinho';
import { LinhaCarrinho as LinhaCarrinhoItem } from '../components/carrinho/LinhaCarrinho';
import { ResumoCarrinho } from '../components/carrinho/ResumoCarrinho';

export function CarrinhoPage() {
  const { itensDetalhados, subtotal, envio, total, envioNota, setQty, remover, carregando } = useCarrinho();
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: 52, margin: '0 0 var(--space-6)', letterSpacing: '-0.02em' }}>O seu carrinho</h1>

      {itensDetalhados.length === 0 && carregando ? (
        <p>A carregar…</p>
      ) : itensDetalhados.length === 0 ? (
        <div style={{ maxWidth: '30em' }}>
          <p style={{ fontSize: 18, fontStyle: 'italic' }}>Ainda está vazio — como uma mesa antes do almoço.</p>
          <Link to="/catalogo" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 'var(--space-3)' }}>
            Ver o catálogo
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)', alignItems: 'start' }}>
          <div>
            {itensDetalhados.map(({ produto, qty }) => (
              <LinhaCarrinhoItem
                key={produto.id}
                produto={produto}
                qty={qty}
                onQtyChange={(q) => setQty(produto.id, q)}
                onRemover={() => remover(produto.id)}
              />
            ))}
            <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)' }}>
              <Link to="/catalogo" style={{ fontSize: 13 }}>
                ← Continuar a escolher
              </Link>
            </div>
          </div>
          <ResumoCarrinho
            subtotal={subtotal}
            envio={envio}
            total={total}
            envioNota={envioNota}
            onFinalizar={() => navigate('/checkout/morada')}
          />
        </div>
      )}
    </div>
  );
}
