namespace Application.Models.Stock;

public class StockAdminViewModel
{
    public List<InventarioLinhaViewModel> Inventario { get; set; } = new();
    public List<MovimentoStockViewModel> Movimentos { get; set; } = new();
    public decimal ValorStock { get; set; }
}
