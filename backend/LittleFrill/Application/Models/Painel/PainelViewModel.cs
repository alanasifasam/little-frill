namespace Application.Models.Painel;

public class PainelViewModel
{
    public MetricasPainelViewModel Metricas { get; set; } = new();
    public List<BarraDiaViewModel> Barras { get; set; } = new();
    public List<AlertaStockViewModel> Alertas { get; set; } = new();
    public List<MovimentoPainelViewModel> Movimentos { get; set; } = new();
    public int StockTotal { get; set; }
    public bool FeriasLigadas { get; set; }
}
