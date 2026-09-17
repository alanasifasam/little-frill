using Core.Enums;

namespace Core.Entities;

public class Utilizador
{
    protected Utilizador()
    {
        Nome = string.Empty;
        Sobrenome = string.Empty;
        Email = string.Empty;
        PasswordHash = string.Empty;
    }

    public Utilizador(
        string nome,
        string sobrenome,
        string email,
        string passwordHash,
        string? codigoPostal = null,
        string? distrito = null,
        bool querCarta = false,
        string? telefone = null)
        : this(nome, sobrenome, email, passwordHash, Role.Cliente, codigoPostal, distrito, querCarta, telefone)
    {
    }

    private Utilizador(
        string nome,
        string sobrenome,
        string email,
        string passwordHash,
        Role role,
        string? codigoPostal,
        string? distrito,
        bool querCarta,
        string? telefone = null)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        if (string.IsNullOrWhiteSpace(sobrenome))
            throw new ArgumentException("Sobrenome é obrigatório.", nameof(sobrenome));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.", nameof(email));

        if (!email.Contains('@'))
            throw new ArgumentException("Email inválido.", nameof(email));

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("PasswordHash é obrigatório.", nameof(passwordHash));

        Nome = nome;
        Sobrenome = sobrenome;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        CodigoPostal = codigoPostal;
        Distrito = distrito;
        QuerCarta = querCarta;
        Telefone = telefone;
        CriadoEm = DateTime.UtcNow;
    }

    /// <summary>
    /// Único caminho que produz um utilizador com <see cref="Role.Admin"/>.
    /// Usado apenas pelo seed em <c>Api/Program.cs</c> — o construtor
    /// público (usado por <c>AuthService.RegistoAsync</c>) nunca aceita
    /// um papel como parâmetro, para que o auto-registo nunca possa criar
    /// uma conta administradora.
    /// </summary>
    public static Utilizador CriarAdmin(
        string nome,
        string sobrenome,
        string email,
        string passwordHash)
    {
        return new Utilizador(nome, sobrenome, email, passwordHash, Role.Admin, null, null, false);
    }

    public int Id { get; private set; }
    public string Nome { get; private set; }
    public string Sobrenome { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string? CodigoPostal { get; private set; }
    public string? Distrito { get; private set; }
    public bool QuerCarta { get; private set; }
    public string? Telefone { get; private set; }
    public Role Role { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public void AtualizarDetalhes(
        string nome,
        string sobrenome,
        string email,
        string? telefone,
        string? codigoPostal,
        string? distrito)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.", nameof(nome));

        if (string.IsNullOrWhiteSpace(sobrenome))
            throw new ArgumentException("Sobrenome é obrigatório.", nameof(sobrenome));

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.", nameof(email));

        if (!email.Contains('@'))
            throw new ArgumentException("Email inválido.", nameof(email));

        Nome = nome;
        Sobrenome = sobrenome;
        Email = email;
        Telefone = telefone;
        CodigoPostal = codigoPostal;
        Distrito = distrito;
    }
}
