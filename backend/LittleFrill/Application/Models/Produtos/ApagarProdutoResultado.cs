namespace Application.Models.Produtos;

public class ApagarProdutoResultado
{
    public ApagarProdutoResultado(bool desativada, string nome)
    {
        Desativada = desativada;
        Nome = nome;
    }

    public bool Desativada { get; }
    public string Nome { get; }
}
