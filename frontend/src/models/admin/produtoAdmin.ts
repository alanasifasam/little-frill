// ProdutoAdmin — Produto (models/produto.ts) + campos de gestão do ateliê (AdminEspec §2)
import type { Produto } from '../produto';

export interface ProdutoAdmin extends Produto {
  /** Custo de materiais por peça (€). */
  custo: number;
  /** Visível na loja. */
  ativo: boolean;
  /** Aparece em destaque na home. */
  destaque: boolean;
  /** Key relativa do blob da foto de capa da peça — sem foto, a loja usa o padrão do tecido (swatch). */
  fotoKey?: string;
  /** Ponto focal da foto de capa (percentagem 0-100, omissão 50/50 = centro). */
  fotoFocoX?: number;
  fotoFocoY?: number;
  /** Galeria completa de fotos, com id próprio para apagar cada uma individualmente e ponto focal por foto. */
  fotos?: { id: number; key: string; ordem: number; principal: boolean; focoX: number; focoY: number }[];
}
