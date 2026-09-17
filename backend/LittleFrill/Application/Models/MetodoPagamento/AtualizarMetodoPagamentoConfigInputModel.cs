namespace Application.Models.MetodoPagamento;

public class AtualizarMetodoPagamentoConfigInputModel
{
    public decimal TaxaPercent { get; set; }
    public decimal CustoFixo { get; set; }
    public string? Iban { get; set; }
    public string? NumeroMbway { get; set; }
    public string Nota { get; set; } = string.Empty;
}
