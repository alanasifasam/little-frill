namespace Application.Models.Encomendas;

public class CartaoInputModel
{
    public string Numero { get; set; } = string.Empty;
    public string Validade { get; set; } = string.Empty;
    public string Cvv { get; set; } = string.Empty;
}
