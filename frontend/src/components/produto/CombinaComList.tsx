// lista lateral no detalhe do produto (layout diferente do card do catálogo)
import { Link } from 'react-router-dom';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { Button } from '../ui/Button';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { useCarrinho } from '../../hooks/useCarrinho';
import type { Produto } from '../../models/produto';

export interface CombinaComListProps {
  produtos: Produto[];
}

export function CombinaComList({ produtos }: CombinaComListProps) {
  const { add } = useCarrinho();

  if (produtos.length === 0) return null;

  return (
    <div style={{ marginTop: 80 }}>
      <h2 style={{ fontSize: 26, marginBottom: 'var(--space-3)' }}>Combina com</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {produtos.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Link to={`/produto/${p.id}`} style={{ flex: 'none' }} aria-label={`Ver ${p.nome}, ${p.tecido}`}>
              <TecidoSwatch
                padrao={p.padrao}
                cor={p.cor}
                altura={64}
                style={{ width: 64 }}
                imagemUrl={p.fotoKey ? urlFoto(p.fotoKey) : undefined}
                focoX={p.fotoFocoX}
                focoY={p.fotoFocoY}
              />
            </Link>
            <div>
              <Link to={`/produto/${p.id}`} style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: 'var(--color-text)' }}>
                {p.nome}
              </Link>
              <div style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>
                {formatarEuros(p.preco)}
              </div>
            </div>
            <Button variant="secondary" style={{ marginLeft: 'auto', fontSize: 13 }} onClick={() => add(p, 1)}>
              Juntar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
