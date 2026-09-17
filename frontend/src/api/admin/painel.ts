// GET /api/admin/painel — métricas do mês, barras dos 10 dias, alertas de reposição,
// últimos movimentos. Cálculo feito no backend; este módulo só define o contrato
// de dados e o pedido HTTP.
import { client } from '../client';
import type { ProdutoAdmin } from '../../models/admin/produtoAdmin';
import type { MotivoSaida } from '../../models/admin/movimentoStock';

export interface Metricas {
  dia: number;
  diasNoMes: number;
  mesNome: string;
  vendasPecas: number;
  enviosCtt: number;
  enviosCobrados: number;
  custoEnvios: number;
  custoMateriais: number;
  fixosTotal: number;
  receita: number;
  lucro: number;
  margem: number;
  ritmoNecessario: number;
  projVendas: number;
  projLucro: number;
  pontoEquilibrio: number;
  talaoMedio: number;
  nEncomendas: number;
  caixaHoje: number;
  encomendasHoje: number;
  /** Meta de vendas do mês (€) — configurável em Configuração do negócio. */
  metaMes: number;
}

export interface BarraDia {
  dia: number;
  total: number;
}

export interface AlertaStock {
  produtoId: number;
  nome: string;
  padrao: ProdutoAdmin['padrao'];
  cor: ProdutoAdmin['cor'];
  stockAtual: number;
  vendidas: number;
  esgotada: boolean;
  /** Key relativa do blob da foto de capa da peça — sem foto, mostra-se o padrão do tecido (swatch). */
  fotoKey?: string;
  fotoFocoX?: number;
  fotoFocoY?: number;
}

export type TipoMovimentoPainel = 'venda' | 'entrada' | 'saida';

export interface MovimentoPainel {
  tipo: TipoMovimentoPainel;
  dia: number;
  /** Nome(s) da(s) peça(s) já unidos, ex. "Necessaire Grande + Babete com folho". */
  peca: string;
  qty: number;
  /** positivo = entra em caixa, negativo = custo/saída. */
  valor: number;
  motivo?: MotivoSaida;
}

export interface PainelDTO {
  metricas: Metricas;
  barras: BarraDia[];
  alertas: AlertaStock[];
  movimentos: MovimentoPainel[];
  stockTotal: number;
  feriasLigadas: boolean;
}

export async function getPainel(): Promise<PainelDTO> {
  const { data } = await client.get<PainelDTO>('/admin/painel');
  return data;
}
