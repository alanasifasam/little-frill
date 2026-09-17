// GET /api/admin/pagamentos, PUT/PATCH métodos e PATCH ".../encomendas/{ref}/pago"
import {
  alternarAtivoMetodoPagamento,
  atualizarMetodoPagamento,
  type AtualizarMetodoPagamentoInput,
} from './metodosPagamento';
import { alternarPago } from './encomendas';
import { client } from '../client';
import { LABEL_METODO_PAGAMENTO, type MetodoPagamento } from '../../models/admin/encomenda';

export interface MetodoLinha {
  key: MetodoPagamento;
  label: string;
  nota: string;
  ativo: boolean;
  usos: number;
  valor: number;
  barraPct: number;
  taxaPercent: number;
  custoFixo: number;
  iban: string | null;
  numeroMbway: string | null;
}

export interface TransacaoLinha {
  ref: string;
  dia: number;
  clienteNome: string;
  metodo: MetodoPagamento;
  total: number;
  anulada: boolean;
  pago: boolean;
}

export interface PagamentosDTO {
  metodos: MetodoLinha[];
  transacoes: TransacaoLinha[];
  porPagar: number;
  nPorPagar: number;
}

interface MetodoLinhaApiDTO {
  metodo: MetodoPagamento;
  ativo: boolean;
  taxaPercent: number;
  custoFixo: number;
  iban: string | null;
  numeroMbway: string | null;
  nota: string;
  usos: number;
  valor: number;
  barraPct: number;
}

interface TransacaoLinhaApiDTO {
  ref: string;
  dia: number;
  clienteNome: string;
  metodo: MetodoPagamento;
  total: number;
  anulada: boolean;
  pago: boolean;
}

interface PagamentosApiDTO {
  metodos: MetodoLinhaApiDTO[];
  transacoes: TransacaoLinhaApiDTO[];
  porPagar: number;
  nPorPagar: number;
}

export async function getPagamentos(): Promise<PagamentosDTO> {
  const { data } = await client.get<PagamentosApiDTO>('/admin/pagamentos');

  const metodos: MetodoLinha[] = data.metodos.map((m) => ({
    key: m.metodo,
    label: LABEL_METODO_PAGAMENTO[m.metodo] ?? m.metodo,
    nota: m.nota,
    ativo: m.ativo,
    usos: m.usos,
    valor: m.valor,
    barraPct: m.barraPct,
    taxaPercent: m.taxaPercent,
    custoFixo: m.custoFixo,
    iban: m.iban,
    numeroMbway: m.numeroMbway,
  }));

  const transacoes: TransacaoLinha[] = data.transacoes.map((t) => ({
    ref: t.ref,
    dia: t.dia,
    clienteNome: t.clienteNome,
    metodo: t.metodo,
    total: t.total,
    anulada: t.anulada,
    pago: t.pago,
  }));

  return {
    metodos,
    transacoes,
    porPagar: data.porPagar,
    nPorPagar: data.nPorPagar,
  };
}

export async function alternarMetodo(metodo: MetodoPagamento): Promise<boolean> {
  const config = await alternarAtivoMetodoPagamento(metodo);
  return config.ativo;
}

export async function definirPagoTransacao(ref: string): Promise<void> {
  await alternarPago(ref);
}

export async function guardarMetodo(metodo: string, input: AtualizarMetodoPagamentoInput) {
  return atualizarMetodoPagamento(metodo, input);
}

export type { AtualizarMetodoPagamentoInput };
