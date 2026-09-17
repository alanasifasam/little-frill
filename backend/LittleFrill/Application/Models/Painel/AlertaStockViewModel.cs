namespace Application.Models.Painel;

public class AlertaStockViewModel
{
    public int ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Padrao { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public int StockAtual { get; set; }
    public int Vendidas { get; set; }
    public bool Esgotada { get; set; }
    public string? ImagemUrl { get; set; }
    public decimal ImagemFocoX { get; set; }
    public decimal ImagemFocoY { get; set; }
}
