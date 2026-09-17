// bloco decorativo de tecido via swatch(padrao, cor), aria-hidden, alturas 240px/520px
import { useEffect, useState, type CSSProperties } from 'react';
import { swatch } from '../../lib/swatch';
import type { CORES, Padrao } from '../../models/produto';

export interface TecidoSwatchProps {
  padrao: Padrao;
  cor: keyof typeof CORES;
  /**
   * Altura em px. Alturas canónicas: 240 no catálogo, 520 no detalhe — mantidas
   * quando entrarem fotos reais. Outros valores são usados só para miniaturas
   * (carrinho, "combina com"), nunca para a imagem principal de um produto.
   */
  altura?: number;
  style?: CSSProperties;
  /** Foto real do produto (caminho já resolvido via urlFoto, em /api/fotos/...). Quando presente, substitui o swatch. */
  imagemUrl?: string;
  /** Ponto focal da foto (percentagem 0-100), aplicado via object-position. @default 50 */
  focoX?: number;
  /** @default 50 */
  focoY?: number;
  /** Texto alternativo da fotografia. Por omissão decorativo (`''`, `aria-hidden`) — só deve levar
   * texto nos sítios em que a foto é o conteúdo principal sem o nome do produto já visível ao lado. */
  alt?: string;
}

export function TecidoSwatch({ padrao, cor, altura = 240, style, imagemUrl, focoX = 50, focoY = 50, alt = '' }: TecidoSwatchProps) {
  // Se a foto não carregar (key sem blob correspondente, rede em baixo),
  // cai para o swatch de tecido em vez de deixar um ícone de imagem partida.
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    setFalhou(false);
  }, [imagemUrl]);

  if (imagemUrl && !falhou) {
    return (
      <img
        src={imagemUrl}
        alt={alt}
        aria-hidden={alt === '' ? 'true' : undefined}
        loading="lazy"
        onError={() => setFalhou(true)}
        style={{
          height: altura,
          width: '100%',
          objectFit: 'cover',
          borderRadius: 'var(--radius-md)',
          objectPosition: `${focoX}% ${focoY}%`,
          // Fallback de layout (evita saltos ao carregar): a generalidade dos usos é
          // quadrada (miniaturas com width igual a `altura`); o card do catálogo,
          // com largura fluida, fica próximo disso na grelha de facto.
          aspectRatio: altura ? '1' : undefined,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        height: altura,
        borderRadius: 'var(--radius-md)',
        background: swatch(padrao, cor),
        ...style,
      }}
    />
  );
}
