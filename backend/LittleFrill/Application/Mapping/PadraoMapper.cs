using Core.Enums;

namespace Application.Mapping;

public static class PadraoMapper
{
    public static string ToChave(Padrao padrao)
    {
        return padrao switch
        {
            Padrao.Xadrez => "xadrez",
            Padrao.Floral => "floral",
            Padrao.Listras => "listras",
            Padrao.Liso => "liso",
            _ => throw new ArgumentOutOfRangeException(nameof(padrao), padrao, "Padrão desconhecido.")
        };
    }

    public static Padrao? ParseChave(string? chave)
    {
        return chave switch
        {
            "xadrez" => Padrao.Xadrez,
            "floral" => Padrao.Floral,
            "listras" => Padrao.Listras,
            "liso" => Padrao.Liso,
            _ => null
        };
    }
}
