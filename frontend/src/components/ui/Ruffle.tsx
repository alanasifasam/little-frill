// bordo ondulado (folho), controlado por --ruffle-op, aria-hidden
import type { CSSProperties } from 'react';

const TAMANHOS = {
  sm: { altura: 11, periodo: 20, raio: 9 },
  lg: { altura: 16, periodo: 28, raio: 13 },
} as const;

export interface RuffleProps {
  /** Cor a preencher os "vales" do folho — normalmente a cor clara do tecido seguinte. */
  cor: string;
  tamanho?: keyof typeof TAMANHOS;
  /** Vira o folho ao contrário — usado no topo do rodapé, onde a curva aponta para cima. */
  flip?: boolean;
  style?: CSSProperties;
}

export function Ruffle({ cor, tamanho = 'sm', flip = false, style }: RuffleProps) {
  const { altura, periodo, raio } = TAMANHOS[tamanho];
  const cy = flip ? altura : -2;
  const cx = periodo / 2;

  return (
    <div
      aria-hidden="true"
      style={{
        height: altura,
        opacity: 'var(--ruffle-op)',
        background: `radial-gradient(circle at ${cx}px ${cy}px,transparent ${raio}px,${cor} ${raio}px) 0 0/${periodo}px ${altura}px repeat-x`,
        ...style,
      }}
    />
  );
}
