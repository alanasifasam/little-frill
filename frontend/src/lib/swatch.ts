// swatch(padrao, cor) do handoff §2, tipada com Padrao e CORES
import { CORES, type Padrao } from '../models/produto';

export function swatch(padrao: Padrao, cor: keyof typeof CORES): string {
  const c = CORES[cor];
  if (padrao === 'liso') return c.lt;
  if (padrao === 'listras') return `repeating-linear-gradient(90deg,${c.md} 0 10px,${c.lt} 10px 20px)`;
  if (padrao === 'xadrez') {
    const s = `color-mix(in srgb,${c.md} 62%,transparent)`;
    return (
      `repeating-linear-gradient(90deg,${s} 0 17px,transparent 17px 34px),` +
      `repeating-linear-gradient(0deg,${s} 0 17px,transparent 17px 34px),${c.lt}`
    );
  }
  const petal = c.md;
  const mid = `color-mix(in srgb,${c.md} 55%,#fffdf9)`;
  const f = (x: number, y: number, r: number) =>
    `radial-gradient(circle at ${x}% ${y}%,${petal} 0 ${r}px,transparent ${r + 0.6}px) 0 0/42px 42px`;
  return [
    f(50, 36, 6),
    f(64, 50, 6),
    f(50, 64, 6),
    f(36, 50, 6),
    `radial-gradient(circle at 50% 50%,${mid} 0 3.5px,transparent 4px) 0 0/42px 42px`,
    `radial-gradient(circle at 50% 50%,${petal} 0 3px,transparent 3.6px) 21px 21px/42px 42px`,
    c.lt,
  ].join(',');
}
