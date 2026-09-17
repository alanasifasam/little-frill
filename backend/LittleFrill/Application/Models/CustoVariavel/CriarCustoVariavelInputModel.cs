namespace Application.Models.CustoVariavel;

public class CriarCustoVariavelInputModel
{
    public string Label { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }
}
