using Application.Mapping;
using Core.Entities;

namespace Application.Models.Encomendas;

public class EncomendaResumoViewModel
{
    public string Referencia { get; set; } = string.Empty;
    public DateTime Criada { get; set; }
    public decimal Total { get; set; }
    public string Estado { get; set; } = string.Empty;
    public int NumeroItens { get; set; }

    public static EncomendaResumoViewModel FromEntity(Encomenda encomenda)
    {
        return new EncomendaResumoViewModel
        {
            Referencia = encomenda.Referencia,
            Criada = encomenda.Criada,
            Total = encomenda.Total,
            Estado = EstadoEncomendaMapper.ToChave(encomenda.Estado),
            NumeroItens = encomenda.Itens.Count
        };
    }
}
