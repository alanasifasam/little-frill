// Carrinho (admin) — carrinhos abertos e abandonados (AdminEspec §2)

export interface LinhaCarrinhoAdmin {
  id: number;
  qty: number;
}

export interface Carrinho {
  id: number;
  /** null = visitante sem conta. */
  clienteId: number | null;
  linhas: LinhaCarrinhoAdmin[];
  /** Horas desde a última alteração. */
  horas: number;
}
