namespace Application.Models.Encomendas;

public class EncomendaInputModel
{
    public List<EncomendaItemInputModel> Itens { get; set; } = new();
    public EnderecoInputModel Entrega { get; set; } = new();
    public string MetodoEnvio { get; set; } = string.Empty;
    public string MetodoPagamento { get; set; } = string.Empty;
    public string? Nif { get; set; }
    public CartaoInputModel? Cartao { get; set; }

    /// <summary>
    /// Aceite para compatibilidade com o payload do frontend, mas ignorado no
    /// cálculo: o servidor recalcula sempre o subtotal a partir dos preços em BD.
    /// </summary>
    public decimal Subtotal { get; set; }

    /// <summary>
    /// Aceite para compatibilidade com o payload do frontend, mas ignorado no
    /// cálculo: o servidor recalcula sempre o custo de envio.
    /// </summary>
    public decimal Envio { get; set; }

    /// <summary>
    /// Aceite para compatibilidade com o payload do frontend, mas ignorado no
    /// cálculo: o servidor recalcula sempre o total.
    /// </summary>
    public decimal Total { get; set; }
}
