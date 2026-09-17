using Application.Mapping;
using Core.Entities;

namespace Application.Models.MetodoPagamento;

public class MetodoPagamentoConfigViewModel
{
    public string Metodo { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public decimal TaxaPercent { get; set; }
    public decimal CustoFixo { get; set; }
    public string? Iban { get; set; }
    public string? NumeroMbway { get; set; }
    public string Nota { get; set; } = string.Empty;

    public static MetodoPagamentoConfigViewModel FromEntity(MetodoPagamentoConfig config)
    {
        return new MetodoPagamentoConfigViewModel
        {
            Metodo = MetodoPagamentoMapper.ToChave(config.Metodo),
            Ativo = config.Ativo,
            TaxaPercent = config.TaxaPercent,
            CustoFixo = config.CustoFixo,
            Iban = config.Iban,
            NumeroMbway = config.NumeroMbway,
            Nota = config.Nota
        };
    }
}

public class MetodoPagamentoDisponivelViewModel
{
    public string Metodo { get; set; } = string.Empty;
    public string? Iban { get; set; }
    public string? NumeroMbway { get; set; }

    public static MetodoPagamentoDisponivelViewModel FromEntity(MetodoPagamentoConfig config)
    {
        return new MetodoPagamentoDisponivelViewModel
        {
            Metodo = MetodoPagamentoMapper.ToChave(config.Metodo),
            Iban = config.Iban,
            NumeroMbway = config.NumeroMbway
        };
    }
}
