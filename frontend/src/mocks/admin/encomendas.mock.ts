// as 13 encomendas do protótipo (VENDAS0) + tabelas de referência ESTADOS_ENC / METODOS
import type { Encomenda, EstadoEncomenda, MetodoPagamento } from '../../models/admin/encomenda';
import type { TagProps } from '../../components/ui/Tag';

// Nota: `estado` usa o vocabulário partilhado com o back-end real
// (`novo` | `em producao` | ... — ver `models/encomenda.ts`), não o
// vocabulário antigo do protótipo de admin (`recebida` | `producao`).
// Este mock só continua a servir `painel.ts`/`carrinhos.ts`/`pagamentos.ts`,
// ainda por migrar — `EncomendasPage` já usa o back-end real.
export const ENCOMENDAS_MOCK: Encomenda[] = [
  { ref: 'CA-1176', dia: 2, clienteId: 2, estado: 'entregue', metodo: 'mbway', pago: true, rastreio: 'DW 1176 2210 4 PT', linhas: [{ id: 5, qty: 2 }, { id: 9, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1178', dia: 4, clienteId: 3, estado: 'entregue', metodo: 'multibanco', pago: true, rastreio: 'DW 1178 6641 2 PT', linhas: [{ id: 3, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1181', dia: 5, clienteId: 1, estado: 'entregue', metodo: 'mbway', pago: true, rastreio: '—', linhas: [{ id: 1, qty: 1 }, { id: 5, qty: 1 }], envio: 'atelie' },
  { ref: 'CA-1183', dia: 7, clienteId: 4, estado: 'entregue', metodo: 'cartao', pago: true, rastreio: 'DW 1183 9075 8 PT', linhas: [{ id: 17, qty: 2 }], envio: 'ctt' },
  { ref: 'CA-1185', dia: 8, clienteId: 5, estado: 'entregue', metodo: 'mbway', pago: true, rastreio: 'DW 1185 4418 1 PT', linhas: [{ id: 12, qty: 1 }, { id: 3, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1187', dia: 11, clienteId: 1, estado: 'em producao', metodo: 'mbway', pago: true, rastreio: 'DW 1187 4412 9 PT', linhas: [{ id: 3, qty: 1 }, { id: 5, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1190', dia: 12, clienteId: 3, estado: 'enviada', metodo: 'transferencia', pago: true, rastreio: 'DW 1190 3327 5 PT', linhas: [{ id: 7, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1193', dia: 13, clienteId: 2, estado: 'entregue', metodo: 'mbway', pago: true, rastreio: '—', linhas: [{ id: 9, qty: 3 }], envio: 'atelie' },
  { ref: 'CA-1196', dia: 14, clienteId: 4, estado: 'enviada', metodo: 'cartao', pago: true, rastreio: 'DW 1196 8802 7 PT', linhas: [{ id: 1, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1200', dia: 14, clienteId: 1, estado: 'novo', metodo: 'mbway', pago: true, rastreio: 'DW 1204 7788 3 PT', linhas: [{ id: 19, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1203', dia: 15, clienteId: 5, estado: 'embalada', metodo: 'multibanco', pago: false, rastreio: '—', linhas: [{ id: 5, qty: 3 }, { id: 17, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1206', dia: 16, clienteId: 2, estado: 'em producao', metodo: 'mbway', pago: true, rastreio: '—', linhas: [{ id: 3, qty: 1 }, { id: 12, qty: 1 }], envio: 'ctt' },
  { ref: 'CA-1209', dia: 17, clienteId: 3, estado: 'novo', metodo: 'cartao', pago: true, rastreio: '—', linhas: [{ id: 9, qty: 2 }], envio: 'atelie' },
];

export const ESTADOS_ENC: { key: EstadoEncomenda; label: string; variant: NonNullable<TagProps['variant']> }[] = [
  { key: 'novo', label: 'Recebida', variant: 'accent' },
  { key: 'em producao', label: 'Em produção', variant: 'accent-2' },
  { key: 'embalada', label: 'Embalada', variant: 'accent-2' },
  { key: 'enviada', label: 'Enviada', variant: 'outline' },
  { key: 'entregue', label: 'Entregue', variant: 'neutral' },
  { key: 'anulada', label: 'Anulada', variant: 'neutral' },
];

export const METODOS: { key: MetodoPagamento; label: string; nota: string }[] = [
  { key: 'mbway', label: 'MB WAY', nota: 'Pedido para o telefone, sem comissão de terminal' },
  { key: 'multibanco', label: 'Multibanco', nota: 'Entidade e referência, válidas 3 dias' },
  { key: 'cartao', label: 'Cartão', nota: 'Visa e Mastercard, 1,4% + 0,25 € por cobrança' },
  { key: 'transferencia', label: 'Transferência', nota: 'IBAN por e-mail, confirmação manual' },
];
