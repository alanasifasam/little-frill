// mosaico das secções visíveis (label "Pets" para animais)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos } from '../../api/produtos';
import { CORES, SECOES, type Produto } from '../../models/produto';
import { Ruffle } from '../ui/Ruffle';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { urlFoto } from '../../lib/fotos';
import { useSiteInfo } from '../../hooks/useSiteInfo';

export function SecTiles() {
  const { siteInfo } = useSiteInfo();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const seccoesVisiveis = SECOES.filter((s) => siteInfo.seccoesAtivas.includes(s.key));

  useEffect(() => {
    let cancelado = false;
    getProdutos().then((resultado) => {
      if (!cancelado) setProdutos(resultado);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (produtos.length === 0) return null;

  return (
    <div>
      <h2 style={{ fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '80px 0 var(--space-4)', fontWeight: 400 }}>
        Secções da casa
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--space-4)' }}>
        {seccoesVisiveis.map((s) => {
          const primeiro = produtos.find((p) => p.sec === s.key);
          if (!primeiro) return null;
          const count = produtos.filter((p) => p.sec === s.key).length;

          return (
            <Link key={s.key} to={`/catalogo/${s.key}`} style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
              <TecidoSwatch
                padrao={primeiro.padrao}
                cor={primeiro.cor}
                altura={130}
                imagemUrl={primeiro.fotoKey ? urlFoto(primeiro.fotoKey) : undefined}
                focoX={primeiro.fotoFocoX}
                focoY={primeiro.fotoFocoY}
              />
              <Ruffle cor={CORES[primeiro.cor].lt} tamanho="sm" />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>
                {count} peças
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
