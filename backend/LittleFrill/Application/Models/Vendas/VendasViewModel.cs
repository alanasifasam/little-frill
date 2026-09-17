namespace Application.Models.Vendas;

public class MelhorDiaViewModel
{
    public int Dia { get; set; }
    public decimal Total { get; set; }
}

public class CaixaDiaViewModel
{
    public int Dia { get; set; }
    public List<string> Refs { get; set; } = new();
    public int Pecas { get; set; }
    public decimal Total { get; set; }
    public int BarraPct { get; set; }
}

public class RankingLinhaViewModel
{
    public int ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Padrao { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public int Qty { get; set; }
    public int BarraPct { get; set; }
    public string? ImagemUrl { get; set; }
    public decimal ImagemFocoX { get; set; }
    public decimal ImagemFocoY { get; set; }
}

public class VendasViewModel
{
    public string MesNome { get; set; } = string.Empty;
    public decimal Receita { get; set; }
    public int NEncomendas { get; set; }
    public int NPecas { get; set; }
    public int NDiasComVendas { get; set; }
    public decimal TalaoMedio { get; set; }
    public MelhorDiaViewModel? MelhorDia { get; set; }
    public List<CaixaDiaViewModel> CaixaDias { get; set; } = new();
    public List<RankingLinhaViewModel> Ranking { get; set; } = new();
}
