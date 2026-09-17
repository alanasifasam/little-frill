namespace Application.Models.CustoVariavel;

public class CustoVariavelViewModel
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime Data { get; set; }

    public static CustoVariavelViewModel FromEntity(Core.Entities.CustoVariavel custoVariavel)
    {
        return new CustoVariavelViewModel
        {
            Id = custoVariavel.Id,
            Label = custoVariavel.Label,
            Valor = custoVariavel.Valor,
            Data = custoVariavel.Data
        };
    }
}
