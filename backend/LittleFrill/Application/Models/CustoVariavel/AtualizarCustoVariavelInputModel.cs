namespace Application.Models.CustoVariavel;

public class AtualizarCustoVariavelInputModel
{
    public string Label { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
}
