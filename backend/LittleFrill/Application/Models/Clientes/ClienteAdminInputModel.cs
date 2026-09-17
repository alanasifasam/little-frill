namespace Application.Models.Clientes;

// Sem NEncomendas/Gasto/Fiel de propósito: são derivados do histórico de
// encomendas (ObterContagemEGastoPorUtilizadorAsync), nunca aceites do
// corpo de criar/editar.
public class ClienteAdminInputModel
{
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Cp { get; set; }
    public string? Localidade { get; set; }
}
