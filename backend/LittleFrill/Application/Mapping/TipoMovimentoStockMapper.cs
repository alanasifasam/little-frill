using Core.Enums;

namespace Application.Mapping;

public static class TipoMovimentoStockMapper
{
    public static string ToChave(TipoMovimentoStock tipo)
    {
        return tipo switch
        {
            TipoMovimentoStock.Entrada => "entrada",
            TipoMovimentoStock.Saida => "saida",
            _ => throw new ArgumentOutOfRangeException(nameof(tipo), tipo, "Tipo de movimento de stock desconhecido.")
        };
    }

    public static TipoMovimentoStock? ParseChave(string? chave)
    {
        return chave switch
        {
            "entrada" => TipoMovimentoStock.Entrada,
            "saida" => TipoMovimentoStock.Saida,
            _ => null
        };
    }
}
