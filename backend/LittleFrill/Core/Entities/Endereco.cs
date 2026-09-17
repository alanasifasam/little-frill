namespace Core.Entities;

public class Endereco
{
    protected Endereco()
    {
        Nome = string.Empty;
        Email = string.Empty;
        Telefone = string.Empty;
        Morada = string.Empty;
        CodigoPostal = string.Empty;
        Localidade = string.Empty;
        Distrito = string.Empty;
        Pais = "PT";
    }

    public Endereco(
        string nome,
        string email,
        string telefone,
        string morada,
        string codigoPostal,
        string localidade,
        string distrito,
        string? andarPorta = null,
        string? notas = null)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.", nameof(email));

        if (string.IsNullOrWhiteSpace(telefone))
            throw new ArgumentException("Telefone é obrigatório.", nameof(telefone));

        if (string.IsNullOrWhiteSpace(morada))
            throw new ArgumentException("Morada é obrigatória.", nameof(morada));

        if (!TemFormatoDeCodigoPostalValido(codigoPostal))
            throw new ArgumentException("Código postal tem de ter o formato 0000-000.", nameof(codigoPostal));

        if (string.IsNullOrWhiteSpace(localidade))
            throw new ArgumentException("Localidade é obrigatória.", nameof(localidade));

        if (string.IsNullOrWhiteSpace(distrito))
            throw new ArgumentException("Distrito é obrigatório.", nameof(distrito));

        Nome = nome;
        Email = email;
        Telefone = telefone;
        Morada = morada;
        AndarPorta = andarPorta;
        CodigoPostal = codigoPostal;
        Localidade = localidade;
        Distrito = distrito;
        Pais = "PT";
        Notas = notas;
    }

    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string Telefone { get; private set; }
    public string Morada { get; private set; }
    public string? AndarPorta { get; private set; }
    public string CodigoPostal { get; private set; }
    public string Localidade { get; private set; }
    public string Distrito { get; private set; }
    public string Pais { get; private set; }
    public string? Notas { get; private set; }

    private static bool TemFormatoDeCodigoPostalValido(string? codigoPostal)
    {
        if (string.IsNullOrWhiteSpace(codigoPostal) || codigoPostal.Length != 8)
            return false;

        for (var i = 0; i < 4; i++)
            if (!char.IsDigit(codigoPostal[i]))
                return false;

        if (codigoPostal[4] != '-')
            return false;

        for (var i = 5; i < 8; i++)
            if (!char.IsDigit(codigoPostal[i]))
                return false;

        return true;
    }
}
