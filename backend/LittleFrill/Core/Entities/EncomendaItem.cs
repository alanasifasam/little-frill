namespace Core.Entities;

public class EncomendaItem
{
    protected EncomendaItem()
    {
        NomeProduto = string.Empty;
    }

    public EncomendaItem(int produtoId, string nomeProduto, decimal precoUnitario, int quantidade)
    {
        if (produtoId <= 0)
            throw new ArgumentException("Produto inválido.", nameof(produtoId));

        if (string.IsNullOrWhiteSpace(nomeProduto))
            throw new ArgumentException("Nome do produto é obrigatório.", nameof(nomeProduto));

        if (precoUnitario <= 0)
            throw new ArgumentException("Preço unitário tem de ser superior a zero.", nameof(precoUnitario));

        if (quantidade <= 0)
            throw new ArgumentException("Quantidade tem de ser superior a zero.", nameof(quantidade));

        ProdutoId = produtoId;
        NomeProduto = nomeProduto;
        PrecoUnitario = precoUnitario;
        Quantidade = quantidade;
    }

    public int ProdutoId { get; private set; }
    public string NomeProduto { get; private set; }
    public decimal PrecoUnitario { get; private set; }
    public int Quantidade { get; private set; }

    public decimal Subtotal => PrecoUnitario * Quantidade;
}
