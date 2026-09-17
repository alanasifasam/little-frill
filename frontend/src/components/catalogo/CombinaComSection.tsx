// secção "Combina com" do catálogo, .card, botão "Juntar o par"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { Button } from '../ui/Button';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { useCarrinho } from '../../hooks/useCarrinho';
import { getProduto } from '../../api/produtos';
import type { Produto } from '../../models/produto';

export interface CombinaComSectionProps {
  produtos: Produto[];
}

interface Sugestao {
  original: Produto;
  par: Produto;
}

export function CombinaComSection({ produtos }: CombinaComSectionProps) {
  const { addPar } = useCarrinho();
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);

  const origens = produtos.slice(0, 3);

  useEffect(() => {
    if (origens.length === 0) {
      setSugestoes([]);
      return;
    }
    let cancelado = false;
    Promise.all(
      origens.map(async (p) => {
        const parId = p.combina[0];
        if (parId === undefined) return null;
        const par = await getProduto(parId);
        return par ? { original: p, par } : null;
      })
    ).then((resultados) => {
      if (cancelado) return;
      setSugestoes(resultados.filter((s): s is Sugestao => s !== null));
    });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origens.map((p) => p.id).join(',')]);

  if (sugestoes.length === 0) return null;

  return (
    <div>
      <div style={{ height: 2, background: 'var(--color-text)', margin: '80px 0 var(--space-4)' }} />
      <h2 style={{ fontSize: 34, margin: '0 0 4px' }}>Combina com</h2>
      <p style={{ fontStyle: 'italic', color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', maxWidth: '30em' }}>
        Pares que saem juntos do ateliê — mesmo pano, mesma fita de viés.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-4)',
        }}
      >
        {sugestoes.map(({ original, par }) => (
          <div key={`${original.id}-${par.id}`} className="card" style={{ background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <Link to={`/produto/${par.id}`} style={{ flex: 'none' }} aria-label={`Ver ${par.nome}, ${par.tecido}`}>
                <TecidoSwatch
                  padrao={par.padrao}
                  cor={par.cor}
                  altura={76}
                  style={{ width: 76 }}
                  imagemUrl={par.fotoKey ? urlFoto(par.fotoKey) : undefined}
                  focoX={par.fotoFocoX}
                  focoY={par.fotoFocoY}
                />
              </Link>
              <div>
                <div className="card-kicker">Vai bem com {original.nome}</div>
                <Link
                  to={`/produto/${par.id}`}
                  className="card-title"
                  style={{ display: 'block', marginTop: 2, color: 'var(--color-text)' }}
                >
                  {par.nome}
                </Link>
                <div style={{ fontSize: 14, marginTop: 4 }}>{formatarEuros(par.preco)}</div>
              </div>
            </div>
            <Button variant="primary" block onClick={() => addPar(original, par)}>
              Juntar o par · {formatarEuros(original.preco + par.preco)}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
