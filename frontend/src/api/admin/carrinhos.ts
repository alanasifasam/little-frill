// GET /api/admin/carrinhos, POST .../{id}/converter, DELETE .../{id}
import { db, proximaReferencia } from './_db';
import { clientePorId, dataAdmin, produtoPorId } from './_calculoPartilhado';
import type { Carrinho } from '../../models/admin/carrinho';

export interface ItemCarrinhoAdmin {
  produtoId: number;
  nome: string;
  qty: number;
}

export interface CarrinhoLinha extends Carrinho {
  clienteNome: string;
  email: string;
  itens: ItemCarrinhoAdmin[];
  total: number;
  quente: boolean;
}

function linha(c: Carrinho): CarrinhoLinha {
  const cliente = clientePorId(c.clienteId);
  const itens = c.linhas.map((l) => ({ produtoId: l.id, nome: produtoPorId(l.id)?.nome ?? '—', qty: l.qty }));
  const total = c.linhas.reduce((t, l) => t + (produtoPorId(l.id)?.preco ?? 0) * l.qty, 0);
  return {
    ...c,
    clienteNome: cliente?.nome ?? 'Visitante sem conta',
    email: cliente?.email ?? 'sem e-mail',
    itens,
    total,
    quente: c.horas < 24,
  };
}

export async function getCarrinhosAdmin(): Promise<CarrinhoLinha[]> {
  return db.carrinhos.map(linha);
}

/** Converter carrinho cria encomenda com a referência seguinte, `novo`,
 * `pago = false`, e remove o carrinho (regra 6). */
export async function converterCarrinho(id: number): Promise<{ ref: string }> {
  const c = db.carrinhos.find((x) => x.id === id);
  if (!c) throw new Error('Carrinho não encontrado.');
  const ref = proximaReferencia();
  db.encomendas.push({
    ref,
    dia: dataAdmin().dia,
    clienteId: c.clienteId,
    estado: 'novo',
    metodo: 'mbway',
    pago: false,
    rastreio: '—',
    linhas: c.linhas,
    envio: 'ctt',
  });
  db.carrinhos = db.carrinhos.filter((x) => x.id !== id);
  return { ref };
}

export async function apagarCarrinho(id: number): Promise<void> {
  db.carrinhos = db.carrinhos.filter((x) => x.id !== id);
}
