namespace Application.Models.Stock;

// Entradas/Saidas/Vendidas são sempre do mês corrente (diferente da coluna
// "Vendidas" da página Produtos, que é histórico total). Margem e a etiqueta
// Repor/Esgotada ficam por conta do cliente, calculadas a partir de
// Custo/Preco/Stock (ver AdminEspec §6 e StockPage.tsx linhas 147-156).
public class InventarioLinhaViewModel
{
    public int ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tecido { get; set; } = string.Empty;
    public decimal Custo { get; set; }
    public decimal Preco { get; set; }
    public int Entradas { get; set; }
    public int Saidas { get; set; }
    public int Vendidas { get; set; }
    public int Stock { get; set; }
}
