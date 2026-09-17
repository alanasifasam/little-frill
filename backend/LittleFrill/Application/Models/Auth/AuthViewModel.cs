namespace Application.Models.Auth;

public class AuthViewModel
{
    public AuthViewModel(string token, string nome, string email, string role)
    {
        Token = token;
        Nome = nome;
        Email = email;
        Role = role;
    }

    public string Token { get; }
    public string Nome { get; }
    public string Email { get; }
    public string Role { get; }
}
