namespace Application.Models.Auth;

public class RegistoInputModel
{
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PalavraPasse { get; set; } = string.Empty;
    public string? CodigoPostal { get; set; }
    public string? Distrito { get; set; }
    public bool? QuerCarta { get; set; }
}
