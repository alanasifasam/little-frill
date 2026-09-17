using Core.Enums;

namespace Core.Entities;

// Uma linha por valor do enum MetodoPagamento (exceto Dinheiro, que é só
// usado na venda de balcão — ver StockService). As 4 linhas são semeadas por
// MetodoPagamentoConfigConfiguration; não há criação nem remoção em runtime,
// só edição (AtualizarTaxas/DefinirIban/DefinirNota) e toggle (DefinirAtivo).
public class MetodoPagamentoConfig
{
    protected MetodoPagamentoConfig()
    {
    }

    public MetodoPagamentoConfig(
        MetodoPagamento metodo,
        bool ativo,
        decimal taxaPercent,
        decimal custoFixo,
        string? iban,
        string? numeroMbway,
        string nota)
    {
        if (taxaPercent < 0)
            throw new ArgumentException("Taxa percentual não pode ser negativa.", nameof(taxaPercent));

        if (custoFixo < 0)
            throw new ArgumentException("Custo fixo não pode ser negativo.", nameof(custoFixo));

        Metodo = metodo;
        Ativo = ativo;
        TaxaPercent = taxaPercent;
        CustoFixo = custoFixo;
        Iban = iban;
        NumeroMbway = numeroMbway;
        Nota = nota;
    }

    public int Id { get; private set; }
    public MetodoPagamento Metodo { get; private set; }
    public bool Ativo { get; private set; }
    public decimal TaxaPercent { get; private set; }
    public decimal CustoFixo { get; private set; }
    public string? Iban { get; private set; }
    public string? NumeroMbway { get; private set; }
    public string Nota { get; private set; } = string.Empty;

    public void DefinirAtivo(bool ativo)
    {
        Ativo = ativo;
    }

    public void AtualizarTaxas(decimal taxaPercent, decimal custoFixo)
    {
        if (taxaPercent < 0)
            throw new ArgumentException("Taxa percentual não pode ser negativa.", nameof(taxaPercent));

        if (custoFixo < 0)
            throw new ArgumentException("Custo fixo não pode ser negativo.", nameof(custoFixo));

        TaxaPercent = taxaPercent;
        CustoFixo = custoFixo;
    }

    public void DefinirIban(string? iban)
    {
        Iban = iban;
    }

    public void DefinirNumeroMbway(string? numeroMbway)
    {
        NumeroMbway = numeroMbway;
    }

    public void DefinirNota(string nota)
    {
        Nota = nota;
    }
}
