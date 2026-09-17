namespace Application.Models.Produtos;

public class ProdutoFiltroInputModel
{
    public string? Sec { get; set; }
    public string? Padrao { get; set; }
    public string? Cor { get; set; }
    public decimal? PrecoMax { get; set; }
    public bool SoStock { get; set; }
    public bool Destaque { get; set; }
    public bool Nova { get; set; }
    public string? Ordenar { get; set; }
}
