using Core.Entities;

namespace Application.Models.Clientes;

public class ClienteAdminViewModel
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public string? Cp { get; set; }
    public string? Localidade { get; set; }
    public int NEncomendas { get; set; }
    public decimal Gasto { get; set; }
    public bool Fiel { get; set; }

    // Fiel = pelo menos 3 encomendas — limiar decidido no handoff admin de
    // Clientes, sem configuração externa (ao contrário do custo/limiar de
    // envio, que são mesmo variáveis de negócio).
    private const int MinimoEncomendasFiel = 3;

    public static ClienteAdminViewModel FromEntity(Utilizador utilizador, int nEncomendas, decimal gasto)
    {
        return new ClienteAdminViewModel
        {
            Id = utilizador.Id,
            Nome = utilizador.Nome,
            Sobrenome = utilizador.Sobrenome,
            Email = utilizador.Email,
            Telefone = utilizador.Telefone,
            Cp = utilizador.CodigoPostal,
            Localidade = utilizador.Distrito,
            NEncomendas = nEncomendas,
            Gasto = gasto,
            Fiel = nEncomendas >= MinimoEncomendasFiel
        };
    }
}
