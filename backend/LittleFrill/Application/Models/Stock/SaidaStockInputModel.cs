namespace Application.Models.Stock;

public class SaidaStockInputModel
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public string Motivo { get; set; } = string.Empty;
}
