namespace Application.Models.CustoFixo;

public class CustoFixoViewModel
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public bool Ativo { get; set; }

    public static CustoFixoViewModel FromEntity(Core.Entities.CustoFixo custoFixo)
    {
        return new CustoFixoViewModel
        {
            Id = custoFixo.Id,
            Label = custoFixo.Label,
            Valor = custoFixo.Valor,
            Ativo = custoFixo.Ativo
        };
    }
}
