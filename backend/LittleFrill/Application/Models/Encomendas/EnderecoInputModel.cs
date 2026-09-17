namespace Application.Models.Encomendas;

public class EnderecoInputModel
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Morada { get; set; } = string.Empty;
    public string? AndarPorta { get; set; }
    public string CodigoPostal { get; set; } = string.Empty;
    public string Localidade { get; set; } = string.Empty;
    public string Distrito { get; set; } = string.Empty;
    public string? Notas { get; set; }
}
