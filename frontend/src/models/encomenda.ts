// EncomendaInput, Endereco, MetodoEnvio (ctt|atelie), MetodoPagamento (mbway|multibanco|cartao|transferencia)
import { formatarEuros } from '../lib/moeda';
import type { CORES, Padrao } from './produto';

export type MetodoEnvio = 'ctt' | 'atelie';

export type MetodoPagamento = 'mbway' | 'multibanco' | 'cartao' | 'transferencia';

export interface Endereco {
  nome: string;
  email: string;
  telefone: string;
  morada: string;
  andarPorta?: string;
  codigoPostal: string;
  localidade: string;
  distrito: string;
  pais: 'PT';
  notas?: string;
}

export interface EncomendaItem {
  id: number;
  qty: number;
}

export interface EncomendaInput {
  itens: EncomendaItem[];
  entrega: Endereco;
  metodoEnvio: MetodoEnvio;
  metodoPagamento: MetodoPagamento;
  nif?: string;
  cartao?: {
    numero: string;
    validade: string;
    cvv: string;
  };
  subtotal: number;
  envio: number;
  total: number;
}

export interface EncomendaConfirmada {
  referencia: string;
  total: number;
  itens: number;
  metodoEnvio: MetodoEnvio;
  pago: boolean;
}

export type EstadoEncomenda = 'novo' | 'em producao' | 'embalada' | 'enviada' | 'entregue' | 'anulada';

export const ESTADOS_ENCOMENDA: Record<EstadoEncomenda, string> = {
  novo: 'Novo',
  'em producao': 'Em produção',
  embalada: 'Embalada',
  enviada: 'Enviada',
  entregue: 'Entregue',
  anulada: 'Anulada',
};

/** Variante de `Tag` por estado — "novo" e "em producao" usam a mesma
 * variante base ("accent"), com "em producao" a ganhar cor própria via
 * `TAG_ESTILO_ESTADO` (não é o lilás de `tag-accent-2`, reservado a outros
 * usos no site). "embalada" não aparece em nenhum exemplo do protótipo —
 * "outline" é um valor de partida plausível, a ajustar quando vir
 * renderizado. "anulada" usa a mesma variante neutra e apagada de
 * "entregue" — não há exemplo no protótipo, é o valor de partida mais
 * discreto para um estado terminal. */
export const TAG_VARIANTE_ESTADO: Record<EstadoEncomenda, 'accent' | 'neutral' | 'outline'> = {
  novo: 'accent',
  'em producao': 'accent',
  embalada: 'outline',
  enviada: 'outline',
  entregue: 'neutral',
  anulada: 'neutral',
};

export const TAG_ESTILO_ESTADO: Partial<Record<EstadoEncomenda, { background: string; color: string }>> = {
  'em producao': { background: '#fff1f4', color: '#790e3d' },
};

export interface EncomendaResumo {
  referencia: string;
  criada: string;
  total: number;
  estado: EstadoEncomenda;
  numeroItens: number;
}

export interface EncomendaItemDetalhe {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
  /** Ausentes quando o produto entretanto foi apagado (venda histórica). */
  padrao?: Padrao;
  cor?: keyof typeof CORES;
  fotoKey?: string;
  fotoFocoX?: number;
  fotoFocoY?: number;
}

export interface EncomendaDetalhe {
  referencia: string;
  criada: string;
  estado: EstadoEncomenda;
  itens: EncomendaItemDetalhe[];
  entrega: Endereco;
  subtotal: number;
  envio: number;
  total: number;
  dataEmProducao?: string | null;
  dataEmbalada?: string | null;
  dataEnviada?: string | null;
  dataEntregue?: string | null;
  codigoRastreio?: string | null;
  pago: boolean;
}

/** Custo de envio conforme o método escolhido e o subtotal (regra de negócio §4 do handoff).
 * `custoPadrao` e `limiarGratis` vêm de `/api/site-info` (ver `useSiteInfo`), configuráveis no admin. */
export function calcularCustoEnvio(subtotal: number, metodo: MetodoEnvio, custoPadrao: number, limiarGratis: number): number {
  if (metodo === 'atelie') return 0;
  return subtotal >= limiarGratis ? 0 : custoPadrao;
}

/** Nota de "falta X para envio grátis" / "envio nosso", igual ao protótipo. */
export function notaEnvioGratis(subtotal: number, limiarGratis: number): string {
  if (subtotal >= limiarGratis) {
    return `Passou os ${formatarEuros(limiarGratis)} — envio nosso.`;
  }
  return `Faltam ${formatarEuros(limiarGratis - subtotal)} para envio grátis.`;
}
