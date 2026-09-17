using Core.Enums;

namespace Core.Entities;

public class Produto
{
    private readonly List<ProdutoImagem> _imagens = new();

    protected Produto()
    {
        Nome = string.Empty;
        Tipo = string.Empty;
        Medidas = string.Empty;
        Tecido = string.Empty;
        CombinaCom = new List<int>();
    }

    public Produto(
        string nome,
        string tipo,
        Seccao seccao,
        decimal preco,
        decimal custo,
        Padrao padrao,
        Cor cor,
        int stock,
        string medidas,
        string tecido,
        bool novo = false,
        List<int>? combinaCom = null)
    {
        ValidarDetalhes(nome, tipo, preco, custo, stock);

        Nome = nome;
        Tipo = tipo;
        Seccao = seccao;
        Preco = preco;
        Custo = custo;
        Padrao = padrao;
        Cor = cor;
        Stock = stock;
        Medidas = medidas;
        Tecido = tecido;
        Novo = novo;
        CombinaCom = combinaCom ?? new List<int>();
        Ativo = true;
        Destaque = false;
    }

    public int Id { get; private set; }
    public string Nome { get; private set; }
    public string Tipo { get; private set; }
    public Seccao Seccao { get; private set; }
    public decimal Preco { get; private set; }
    public decimal Custo { get; private set; }
    public Padrao Padrao { get; private set; }
    public Cor Cor { get; private set; }
    public int Stock { get; private set; }
    public string Medidas { get; private set; }
    public string Tecido { get; private set; }
    public bool Novo { get; private set; }
    public List<int> CombinaCom { get; private set; }
    public bool Ativo { get; private set; }
    public bool Destaque { get; private set; }
    public IReadOnlyList<ProdutoImagem> Imagens => _imagens.AsReadOnly();

    public void DebitarStock(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Quantidade tem de ser superior a zero.", nameof(quantidade));

        if (Stock < quantidade)
            throw new InvalidOperationException($"Stock insuficiente para o produto '{Nome}'.");

        Stock -= quantidade;
    }

    public bool TemStockPara(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Quantidade tem de ser superior a zero.", nameof(quantidade));

        return Stock >= quantidade;
    }

    public void AdicionarStock(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Quantidade tem de ser superior a zero.", nameof(quantidade));

        Stock += quantidade;
    }

    public void AtualizarDetalhes(
        string nome,
        string tipo,
        Seccao seccao,
        decimal preco,
        decimal custo,
        Padrao padrao,
        Cor cor,
        string medidas,
        string tecido,
        List<int>? combinaCom)
    {
        ValidarDetalhes(nome, tipo, preco, custo, Stock);

        Nome = nome;
        Tipo = tipo;
        Seccao = seccao;
        Preco = preco;
        Custo = custo;
        Padrao = padrao;
        Cor = cor;
        Medidas = medidas;
        Tecido = tecido;
        CombinaCom = combinaCom ?? new List<int>();
    }

    public void DefinirStock(int quantidade)
    {
        if (quantidade < 0)
            throw new ArgumentException("Stock não pode ser negativo.", nameof(quantidade));

        Stock = quantidade;
    }

    public void AlternarAtivo()
    {
        Ativo = !Ativo;
    }

    public void AlternarDestaque()
    {
        Destaque = !Destaque;
    }

    public void AlternarNovo()
    {
        Novo = !Novo;
    }

    public void AdicionarImagem(string url)
    {
        var ordem = _imagens.Count == 0 ? 0 : _imagens.Max(i => i.Ordem) + 1;
        _imagens.Add(new ProdutoImagem(url, ordem));
    }

    public void RemoverImagem(int imagemId)
    {
        var imagem = _imagens.FirstOrDefault(i => i.Id == imagemId);
        if (imagem is null)
            throw new ArgumentException("Imagem não encontrada.", nameof(imagemId));

        _imagens.Remove(imagem);
    }

    public void DefinirCapa(int imagemId)
    {
        var imagem = _imagens.FirstOrDefault(i => i.Id == imagemId);
        if (imagem is null)
            throw new ArgumentException("Imagem não encontrada.", nameof(imagemId));

        _imagens.Remove(imagem);
        _imagens.Insert(0, imagem);

        for (var i = 0; i < _imagens.Count; i++)
            _imagens[i].DefinirOrdem(i);
    }

    public void DefinirFocoImagem(int imagemId, decimal focoX, decimal focoY)
    {
        var imagem = _imagens.FirstOrDefault(i => i.Id == imagemId);
        if (imagem is null)
            throw new ArgumentException("Imagem não encontrada.", nameof(imagemId));

        imagem.DefinirFoco(focoX, focoY);
    }

    private static void ValidarDetalhes(string nome, string tipo, decimal preco, decimal custo, int stock)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome do produto é obrigatório.", nameof(nome));

        if (string.IsNullOrWhiteSpace(tipo))
            throw new ArgumentException("Tipo do produto é obrigatório.", nameof(tipo));

        if (preco <= 0)
            throw new ArgumentException("Preço tem de ser superior a zero.", nameof(preco));

        if (custo < 0)
            throw new ArgumentException("Custo não pode ser negativo.", nameof(custo));

        if (stock < 0)
            throw new ArgumentException("Stock não pode ser negativo.", nameof(stock));
    }
}
