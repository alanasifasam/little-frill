// GET /api/admin/financeiro — conta do mês, margem, equilíbrio, projeção, histórico
import { client } from '../client';
import type { CustoFixoDTO } from './custosFixos';
import type { CustoVariavelDTO } from './custosVariaveis';

export interface MesHistoricoLinha {
  mes: string;
  valor: number;
  atual: boolean;
}

export interface FinanceiroDTO {
  dia: number;
  diasNoMes: number;
  mesNome: string;
  vendasPecas: number;
  enviosCtt: number;
  enviosCobrados: number;
  custoEnvios: number;
  custoMateriais: number;
  fixosTotal: number;
  /** Soma dos custos variáveis (pontuais, datados) do mês em curso. */
  custoVariavelTotal: number;
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
  /** Meta de vendas do mês (€) — cf. `configuracao-negocio`. */
  metaMes: number;
  /** Todas as linhas de custo fixo, ativas e inativas — só as ativas entram em `fixosTotal`. */
  fixos: CustoFixoDTO[];
  /** Só os custos variáveis cuja data cai no mês em curso — para a "Conta do mês". */
  custosVariaveisDoMes: CustoVariavelDTO[];
  /** Últimos seis meses, do mais antigo ao atual; a última entrada é o mês em curso. */
  historico: MesHistoricoLinha[];
}

export async function getFinanceiro(): Promise<FinanceiroDTO> {
  const { data } = await client.get<FinanceiroDTO>('/admin/financeiro');
  return data;
}
