// "Saíram do ateliê esta semana" — peças com nova=true (GET /api/produtos?nova=true)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos } from '../../api/produtos';
import { ProdutoGrid } from '../catalogo/ProdutoGrid';
import type { Produto } from '../../models/produto';

export function NovidadesGrid() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    let cancelado = false;
    getProdutos({ nova: true }).then((resultado) => {
      if (!cancelado) setProdutos(resultado.slice(0, 4));
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (produtos.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)', margin: '80px 0 var(--space-4)' }}>
        <h2 style={{ fontSize: 34, margin: 0 }}>Saíram do ateliê esta semana</h2>
        <Link to="/catalogo" style={{ fontSize: 13, marginLeft: 'auto' }}>
          Ver tudo →
        </Link>
      </div>
      <ProdutoGrid produtos={produtos} />
    </div>
  );
}
