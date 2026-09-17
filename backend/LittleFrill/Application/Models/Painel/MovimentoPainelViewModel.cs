namespace Application.Models.Painel;

public class MovimentoPainelViewModel
{
    public string Tipo { get; set; } = string.Empty;
    public int Dia { get; set; }
    public string Peca { get; set; } = string.Empty;
    public int Qty { get; set; }
    public decimal Valor { get; set; }
    public string? Motivo { get; set; }
}
