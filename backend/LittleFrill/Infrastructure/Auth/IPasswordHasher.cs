namespace Infrastructure.Auth;

public interface IPasswordHasher
{
    string Hash(string password);

    bool Verificar(string hash, string password);
}
