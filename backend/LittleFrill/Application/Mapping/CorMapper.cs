using Core.Enums;

namespace Application.Mapping;

public static class CorMapper
{
    public static string ToChave(Cor cor)
    {
        return cor switch
        {
            Cor.Rosa => "rosa",
            Cor.Azul => "azul",
            Cor.Lilas => "lilas",
            Cor.Amarelo => "amarelo",
            Cor.Verde => "verde",
            _ => throw new ArgumentOutOfRangeException(nameof(cor), cor, "Cor desconhecida.")
        };
    }

    public static Cor? ParseChave(string? chave)
    {
        return chave switch
        {
            "rosa" => Cor.Rosa,
            "azul" => Cor.Azul,
            "lilas" => Cor.Lilas,
            "amarelo" => Cor.Amarelo,
            "verde" => Cor.Verde,
            _ => null
        };
    }
}
