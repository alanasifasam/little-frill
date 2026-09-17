// Fórmulas partilhadas pelos módulos ainda mock (por ora só `api/admin/carrinhos.ts`
// — `financeiro.ts` passou a cliente HTTP puro e deixou de usar este ficheiro).
// Viviam antes em `painel.ts`, que passou a ser um cliente HTTP puro; ficam
// aqui para não duplicar cálculo em cada módulo (mesmo espírito do
// `renderVals()` único do protótipo).
import { db } from './_db';
import type { ProdutoAdminMock } from '../../mocks/admin/produtos.mock';
import type { Cliente } from '../../models/admin/cliente';

const MESES_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export interface DataAdmin {
  /** Dia corrente do mês (D). */
  dia: number;
  /** Número de dias do mês corrente (N). */
  diasNoMes: number;
  mesNome: string;
}

/** Deriva D/N do calendário do sistema em vez de hardcode (o protótipo simula
 * agosto de 2026 com DIA=17 fixo; aqui usamos a data real). */
export function dataAdmin(): DataAdmin {
  const agora = new Date();
  return {
    dia: agora.getDate(),
    diasNoMes: new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getDate(),
    mesNome: MESES_PT[agora.getMonth()],
  };
}

export function produtoPorId(id: number): ProdutoAdminMock | undefined {
  return db.produtos.find((p) => p.id === id);
}

export function clientePorId(id: number | null): Cliente | undefined {
  if (id === null) return undefined;
  return db.clientes.find((c) => c.id === id);
}
