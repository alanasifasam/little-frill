namespace Application.Models.Financeiro;

public class HistoricoMesViewModel
{
    public string Mes { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public bool Atual { get; set; }
}
