using Application.Mapping;
using Core.Entities;

namespace Application.Models.Encomendas;

public class EncomendaAdminViewModel
{
    public string Referencia { get; set; } = string.Empty;
    public DateTime Criada { get; set; }
    public int? ClienteId { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public string Localidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Metodo { get; set; } = string.Empty;
    public bool Pago { get; set; }
    public string Rastreio { get; set; } = string.Empty;
    public string MetodoEnvio { get; set; } = string.Empty;
    public int NumeroItens { get; set; }
    public decimal Total { get; set; }

    public static EncomendaAdminViewModel FromEntity(Encomenda encomenda)
    {
        return new EncomendaAdminViewModel
        {
            Referencia = encomenda.Referencia,
            Criada = encomenda.Criada,
            ClienteId = encomenda.UtilizadorId,
            ClienteNome = encomenda.Utilizador is not null
                ? $"{encomenda.Utilizador.Nome} {encomenda.Utilizador.Sobrenome}"
                : "Sem conta",
            Localidade = encomenda.Entrega?.Localidade ?? "—",
            Estado = EstadoEncomendaMapper.ToChave(encomenda.Estado),
            Metodo = MetodoPagamentoMapper.ToChave(encomenda.MetodoPagamento),
            Pago = encomenda.Pago,
            Rastreio = encomenda.CodigoRastreio ?? "—",
            MetodoEnvio = MetodoEnvioMapper.ToChave(encomenda.MetodoEnvio),
            NumeroItens = encomenda.Itens.Count,
            Total = encomenda.Total
        };
    }
}
