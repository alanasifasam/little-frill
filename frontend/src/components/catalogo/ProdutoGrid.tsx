// grelha de ProdutoCard a partir da lista filtrada
import { ProdutoCard } from './ProdutoCard';
import type { Produto } from '../../models/produto';

export interface ProdutoGridProps {
  produtos: Produto[];
}

export function ProdutoGrid({ produtos }: ProdutoGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(215px,1fr))', gap: 'var(--space-6)' }}>
      {produtos.map((p) => (
        <ProdutoCard key={p.id} produto={p} />
      ))}
    </div>
  );
}
