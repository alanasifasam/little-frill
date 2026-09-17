namespace Application.Models.CustoFixo;

public class AtualizarCustoFixoInputModel
{
    public string Label { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public bool Ativo { get; set; }
}
