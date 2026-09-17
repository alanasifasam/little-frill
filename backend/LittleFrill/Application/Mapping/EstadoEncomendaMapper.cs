using Core.Enums;

namespace Application.Mapping;

public static class EstadoEncomendaMapper
{
    public static string ToChave(EstadoEncomenda estado)
    {
        return estado switch
        {
            EstadoEncomenda.Novo => "novo",
            EstadoEncomenda.EmProducao => "em producao",
            EstadoEncomenda.Embalada => "embalada",
            EstadoEncomenda.Enviada => "enviada",
            EstadoEncomenda.Entregue => "entregue",
            EstadoEncomenda.Anulada => "anulada",
            _ => throw new ArgumentOutOfRangeException(nameof(estado), estado, "Estado de encomenda desconhecido.")
        };
    }

    public static EstadoEncomenda? ParseChave(string? chave)
    {
        return chave switch
        {
            "novo" => EstadoEncomenda.Novo,
            "em producao" => EstadoEncomenda.EmProducao,
            "embalada" => EstadoEncomenda.Embalada,
            "enviada" => EstadoEncomenda.Enviada,
            "entregue" => EstadoEncomenda.Entregue,
            "anulada" => EstadoEncomenda.Anulada,
            _ => null
        };
    }
}
