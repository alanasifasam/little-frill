// imagem grande (520px) + vistas clicáveis: fotos reais da peça quando existem
// (imagens), senão as 3 vistas de swatch(); clicar na imagem principal
// abre a lightbox
import { useState } from 'react';
import { Ruffle } from '../ui/Ruffle';
import { swatch } from '../../lib/swatch';
import { urlFoto } from '../../lib/fotos';
import { CORES, type Produto } from '../../models/produto';
import { ImagemLightbox } from './ImagemLightbox';

export interface FotoProduto {
  key: string;
  focoX: number;
  focoY: number;
}

export interface SwatchViewerProps {
  produto: Produto;
  /** Fotos reais da peça, por ordem. Quando presentes, substituem as 3 vistas de swatch por uma galeria de fotos. */
  fotos?: FotoProduto[];
}

export function SwatchViewer({ produto, fotos }: SwatchViewerProps) {
  const vistasSwatch = [swatch(produto.padrao, produto.cor), CORES[produto.cor].lt, swatch('listras', produto.cor)];
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [lightboxAberta, setLightboxAberta] = useState(false);

  if (fotos && fotos.length > 0) {
    const imagens = fotos;
    const navegarFotos = (delta: 1 | -1) => {
      setIndiceAtivo((i) => (i + delta + imagens.length) % imagens.length);
    };
    const urls = imagens.map((img) => urlFoto(img.key));

    return (
      <div>
        <button
          type="button"
          aria-label="Ver imagem ampliada"
          onClick={() => setLightboxAberta(true)}
          style={{
            display: 'block',
            width: '100%',
            height: 520,
            padding: 0,
            border: 0,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <img
            src={urlFoto(imagens[indiceAtivo].key)}
            alt={`${produto.nome}, ${produto.tecido}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `${imagens[indiceAtivo].focoX}% ${imagens[indiceAtivo].focoY}%`,
            }}
          />
        </button>
        <Ruffle cor={CORES[produto.cor].lt} tamanho="lg" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${imagens.length},1fr)`,
            gap: 'var(--space-2)',
            marginTop: 'var(--space-3)',
          }}
        >
          {imagens.map((img, i) => (
            <button
              key={img.key}
              type="button"
              aria-label={`Ver fotografia ${i + 1}`}
              aria-pressed={i === indiceAtivo}
              onClick={() => setIndiceAtivo(i)}
              style={{
                height: 96,
                padding: 0,
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: i === indiceAtivo ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
            >
              <img
                src={urlFoto(img.key)}
                alt=""
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${img.focoX}% ${img.focoY}%` }}
              />
            </button>
          ))}
        </div>
        {lightboxAberta && (
          <ImagemLightbox
            vistas={urls}
            indiceAtivo={indiceAtivo}
            onNavegar={navegarFotos}
            onFechar={() => setLightboxAberta(false)}
            modo="foto"
          />
        )}
      </div>
    );
  }

  function navegar(delta: 1 | -1) {
    setIndiceAtivo((i) => (i + delta + vistasSwatch.length) % vistasSwatch.length);
  }

  return (
    <div>
      <button
        type="button"
        aria-label="Ver imagem ampliada"
        onClick={() => setLightboxAberta(true)}
        style={{
          display: 'block',
          width: '100%',
          height: 520,
          padding: 0,
          border: 0,
          borderRadius: 'var(--radius-md)',
          background: vistasSwatch[indiceAtivo],
          cursor: 'pointer',
        }}
      />
      <Ruffle cor={CORES[produto.cor].lt} tamanho="lg" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        {vistasSwatch.map((fundo, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ver vista ${i + 1}`}
            aria-pressed={i === indiceAtivo}
            onClick={() => setIndiceAtivo(i)}
            style={{
              height: 96,
              padding: 0,
              borderRadius: 'var(--radius-md)',
              background: fundo,
              cursor: 'pointer',
              border: i === indiceAtivo ? '2px solid var(--color-accent)' : '2px solid transparent',
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
          marginTop: 'var(--space-2)',
        }}
      >
        Frente, interior forrado e detalhe do folho.
      </div>
      {lightboxAberta && (
        <ImagemLightbox
          vistas={vistasSwatch}
          indiceAtivo={indiceAtivo}
          onNavegar={navegar}
          onFechar={() => setLightboxAberta(false)}
        />
      )}
    </div>
  );
}
