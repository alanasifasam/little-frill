using Application.Mapping;
using Core.Entities;

namespace Application.Models.Produtos;

public class ProdutoAdminViewModel
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string Sec { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string Padrao { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Medidas { get; set; } = string.Empty;
    public string Tecido { get; set; } = string.Empty;
    public List<int> Combina { get; set; } = new();
    public bool Nova { get; set; }
    public decimal Custo { get; set; }
    public bool Ativo { get; set; }
    public bool Destaque { get; set; }
    public string? ImagemUrl { get; set; }
    public decimal ImagemFocoX { get; set; }
    public decimal ImagemFocoY { get; set; }
    public List<ProdutoImagemViewModel> Imagens { get; set; } = new();
    public int Vendidas { get; set; }

    public static ProdutoAdminViewModel FromEntity(Produto produto, int vendidas)
    {
        var imagensOrdenadas = produto.Imagens.OrderBy(i => i.Ordem).ToList();
        var capa = imagensOrdenadas.FirstOrDefault();

        return new ProdutoAdminViewModel
        {
            Id = produto.Id,
            Nome = produto.Nome,
            Tipo = produto.Tipo,
            Sec = SeccaoMapper.ToChave(produto.Seccao),
            Preco = produto.Preco,
            Padrao = PadraoMapper.ToChave(produto.Padrao),
            Cor = CorMapper.ToChave(produto.Cor),
            Stock = produto.Stock,
            Medidas = produto.Medidas,
            Tecido = produto.Tecido,
            Combina = new List<int>(produto.CombinaCom),
            Nova = produto.Novo,
            Custo = produto.Custo,
            Ativo = produto.Ativo,
            Destaque = produto.Destaque,
            ImagemUrl = capa?.Url,
            ImagemFocoX = capa?.FocoX ?? 50m,
            ImagemFocoY = capa?.FocoY ?? 50m,
            Imagens = imagensOrdenadas.Select(ProdutoImagemViewModel.FromEntity).ToList(),
            Vendidas = vendidas
        };
    }
}
