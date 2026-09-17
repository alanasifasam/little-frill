namespace Application.Models.Produtos;

// Sem Ativo/Destaque/ImagemUrl de propósito: esses só mudam pelos seus
// próprios endpoints (PATCH ativo/destaque, POST imagem), nunca pelo corpo
// de criar/editar.
public class ProdutoAdminInputModel
{
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Sec { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public decimal Custo { get; set; }
    public string Padrao { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string? Medidas { get; set; }
    public string? Tecido { get; set; }
    public List<int>? Combina { get; set; }
}
