using Core.Enums;

namespace Application.Mapping;

public static class MotivoSaidaStockMapper
{
    public static string ToChave(MotivoSaidaStock motivo)
    {
        return motivo switch
        {
            MotivoSaidaStock.Quebra => "quebra",
            MotivoSaidaStock.Amostra => "amostra",
            MotivoSaidaStock.Presente => "presente",
            _ => throw new ArgumentOutOfRangeException(nameof(motivo), motivo, "Motivo de saída desconhecido.")
        };
    }

    public static MotivoSaidaStock? ParseChave(string? chave)
    {
        return chave switch
        {
            "quebra" => MotivoSaidaStock.Quebra,
            "amostra" => MotivoSaidaStock.Amostra,
            "presente" => MotivoSaidaStock.Presente,
            _ => null
        };
    }
}
