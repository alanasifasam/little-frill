// formatarEuros(n) => "48,00 €" (vírgula decimal, símbolo à direita)

export function formatarEuros(n: number): string {
  return n.toFixed(2).replace('.', ',') + ' €';
}

/** Forma curta para rótulos de barra (ex. "1,4k"), usada no admin (Painel, Financeiro). */
export function formatarEurosCurto(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',')}k` : String(Math.round(n));
}
