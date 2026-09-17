namespace Core.Entities;

public class ProdutoImagem
{
    protected ProdutoImagem()
    {
        Url = string.Empty;
    }

    public ProdutoImagem(string url, int ordem)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("URL da imagem é obrigatório.", nameof(url));

        Url = url;
        Ordem = ordem;
        FocoX = 50m;
        FocoY = 50m;
    }

    public int Id { get; private set; }
    public string Url { get; private set; }
    public int Ordem { get; private set; }
    public decimal FocoX { get; private set; }
    public decimal FocoY { get; private set; }

    public void DefinirFoco(decimal focoX, decimal focoY)
    {
        if (focoX < 0 || focoX > 100)
            throw new ArgumentException("Foco X tem de estar entre 0 e 100.", nameof(focoX));

        if (focoY < 0 || focoY > 100)
            throw new ArgumentException("Foco Y tem de estar entre 0 e 100.", nameof(focoY));

        FocoX = focoX;
        FocoY = focoY;
    }

    public void DefinirOrdem(int ordem)
    {
        Ordem = ordem;
    }
}
