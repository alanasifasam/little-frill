namespace Application.Models.Clientes;

public class ApagarClienteResultado
{
    public ApagarClienteResultado(bool apagado, string nome)
    {
        Apagado = apagado;
        Nome = nome;
    }

    public bool Apagado { get; }
    public string Nome { get; }
}
