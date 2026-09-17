using Core.Enums;

namespace Application.Mapping;

public static class MetodoPagamentoMapper
{
    public static string ToChave(MetodoPagamento metodoPagamento)
    {
        return metodoPagamento switch
        {
            MetodoPagamento.MbWay => "mbway",
            MetodoPagamento.Multibanco => "multibanco",
            MetodoPagamento.Cartao => "cartao",
            MetodoPagamento.Transferencia => "transferencia",
            MetodoPagamento.Dinheiro => "dinheiro",
            _ => throw new ArgumentOutOfRangeException(nameof(metodoPagamento), metodoPagamento, "Método de pagamento desconhecido.")
        };
    }

    public static MetodoPagamento? ParseChave(string? chave)
    {
        return chave switch
        {
            "mbway" => MetodoPagamento.MbWay,
            "multibanco" => MetodoPagamento.Multibanco,
            "cartao" => MetodoPagamento.Cartao,
            "transferencia" => MetodoPagamento.Transferencia,
            "dinheiro" => MetodoPagamento.Dinheiro,
            _ => null
        };
    }
}
