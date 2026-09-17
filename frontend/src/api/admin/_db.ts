// Estado partilhado do admin, em memória — substitui o back-end enquanto
// `/api/admin/*` não existe (ver plano). Módulo interno: só os outros
// ficheiros de `api/admin/*.ts` o importam; hooks e páginas não lhe tocam
// diretamente, para a troca por chamadas reais não exigir mudanças fora daqui.
import { PRODUTOS_ADMIN_MOCK, type ProdutoAdminMock } from '../../mocks/admin/produtos.mock';
import { CLIENTES_MOCK } from '../../mocks/admin/clientes.mock';
import { ENCOMENDAS_MOCK } from '../../mocks/admin/encomendas.mock';
import { MOVS_MOCK } from '../../mocks/admin/movimentosStock.mock';
import { CARRINHOS_MOCK } from '../../mocks/admin/carrinhos.mock';
import { CONFIG_SITE_INICIAL } from '../../mocks/admin/configSite.mock';
import type { Cliente } from '../../models/admin/cliente';
import type { Encomenda } from '../../models/admin/encomenda';
import type { MovimentoStock } from '../../models/admin/movimentoStock';
import type { Carrinho } from '../../models/admin/carrinho';
import type { ConfigSite } from '../../models/admin/configSite';

function clonar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor)) as T;
}

export const db = {
  produtos: clonar(PRODUTOS_ADMIN_MOCK) as ProdutoAdminMock[],
  clientes: clonar(CLIENTES_MOCK) as Cliente[],
  encomendas: clonar(ENCOMENDAS_MOCK) as Encomenda[],
  movimentos: clonar(MOVS_MOCK) as MovimentoStock[],
  carrinhos: clonar(CARRINHOS_MOCK) as Carrinho[],
  config: clonar(CONFIG_SITE_INICIAL) as ConfigSite,
  novoIdProduto: 90,
  novoIdCliente: 590,
  seqEncomenda: 1210,
};

/** Nova referência de encomenda: `CA-` + sequência, saltando de 3 em 3 para
 * imitar referências reais não contíguas (regra 11). */
export function proximaReferencia(): string {
  const ref = `CA-${db.seqEncomenda}`;
  db.seqEncomenda += 3;
  return ref;
}
