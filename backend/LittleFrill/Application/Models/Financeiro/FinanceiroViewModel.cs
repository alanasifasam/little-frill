using Application.Models.CustoFixo;
using Application.Models.CustoVariavel;

namespace Application.Models.Financeiro;

public class FinanceiroViewModel
{
    public int Dia { get; set; }
    public int DiasNoMes { get; set; }
    public string MesNome { get; set; } = string.Empty;
    public decimal VendasPecas { get; set; }
    public int EnviosCtt { get; set; }
    public decimal EnviosCobrados { get; set; }
    public decimal CustoEnvios { get; set; }
    public decimal CustoMateriais { get; set; }
    public decimal FixosTotal { get; set; }
    public decimal CustoVariavelTotal { get; set; }
    public decimal Receita { get; set; }
    public decimal Lucro { get; set; }
    public decimal Margem { get; set; }
    public decimal RitmoNecessario { get; set; }
    public decimal ProjVendas { get; set; }
    public decimal ProjLucro { get; set; }
    public decimal PontoEquilibrio { get; set; }
    public decimal TalaoMedio { get; set; }
    public int NEncomendas { get; set; }
    public decimal CaixaHoje { get; set; }
    public int EncomendasHoje { get; set; }
    public decimal MetaMes { get; set; }
    public List<CustoFixoViewModel> Fixos { get; set; } = new();
    public List<CustoVariavelViewModel> CustosVariaveisDoMes { get; set; } = new();
    public List<HistoricoMesViewModel> Historico { get; set; } = new();
}
