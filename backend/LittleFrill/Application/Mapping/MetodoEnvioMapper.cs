using Core.Enums;

namespace Application.Mapping;

public static class MetodoEnvioMapper
{
    public static string ToChave(MetodoEnvio metodoEnvio)
    {
        return metodoEnvio switch
        {
            MetodoEnvio.Ctt => "ctt",
            MetodoEnvio.Atelie => "atelie",
            _ => throw new ArgumentOutOfRangeException(nameof(metodoEnvio), metodoEnvio, "Método de envio desconhecido.")
        };
    }

    public static MetodoEnvio? ParseChave(string? chave)
    {
        return chave switch
        {
            "ctt" => MetodoEnvio.Ctt,
            "atelie" => MetodoEnvio.Atelie,
            _ => null
        };
    }
}
