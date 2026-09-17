using Application.Mapping;
using Core.Entities;

namespace Application.Models.Encomendas;

public class EncomendaConfirmadaViewModel
{
    public string Referencia { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int Itens { get; set; }
    public string MetodoEnvio { get; set; } = string.Empty;
    public bool Pago { get; set; }

    public static EncomendaConfirmadaViewModel FromEntity(Encomenda encomenda)
    {
        return new EncomendaConfirmadaViewModel
        {
            Referencia = encomenda.Referencia,
            Total = encomenda.Total,
            Itens = encomenda.Itens.Count,
            MetodoEnvio = MetodoEnvioMapper.ToChave(encomenda.MetodoEnvio),
            Pago = encomenda.Pago
        };
    }
}
