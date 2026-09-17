using Application.Mapping;
using Core.Entities;

namespace Application.Models.Produtos;

public class ProdutoViewModel
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
    public bool Destaque { get; set; }
    public string? ImagemUrl { get; set; }
    public decimal ImagemFocoX { get; set; }
    public decimal ImagemFocoY { get; set; }
    public List<ProdutoImagemViewModel> Imagens { get; set; } = new();

    public static ProdutoViewModel FromEntity(Produto produto)
    {
        var imagensOrdenadas = produto.Imagens.OrderBy(i => i.Ordem).ToList();
        var capa = imagensOrdenadas.FirstOrDefault();

        return new ProdutoViewModel
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
            Destaque = produto.Destaque,
            ImagemUrl = capa?.Url,
            ImagemFocoX = capa?.FocoX ?? 50m,
            ImagemFocoY = capa?.FocoY ?? 50m,
            Imagens = imagensOrdenadas.Select(ProdutoImagemViewModel.FromEntity).ToList()
        };
    }
}
