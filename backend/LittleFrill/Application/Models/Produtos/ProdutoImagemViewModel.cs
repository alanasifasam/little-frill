using Core.Entities;

namespace Application.Models.Produtos;

public class ProdutoImagemViewModel
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public int Ordem { get; set; }
    public decimal FocoX { get; set; }
    public decimal FocoY { get; set; }

    public static ProdutoImagemViewModel FromEntity(ProdutoImagem imagem)
    {
        return new ProdutoImagemViewModel
        {
            Id = imagem.Id,
            Url = imagem.Url,
            Ordem = imagem.Ordem,
            FocoX = imagem.FocoX,
            FocoY = imagem.FocoY
        };
    }
}
