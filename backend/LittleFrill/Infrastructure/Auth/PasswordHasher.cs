using System.Security.Cryptography;

namespace Infrastructure.Auth;

public class PasswordHasher : IPasswordHasher
{
    private const int Iteracoes = 100_000;
    private const int TamanhoSaltBytes = 16;
    private const int TamanhoHashBytes = 32;
    private static readonly HashAlgorithmName Algoritmo = HashAlgorithmName.SHA256;

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(TamanhoSaltBytes);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iteracoes, Algoritmo, TamanhoHashBytes);

        return $"{Iteracoes}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verificar(string hash, string password)
    {
        var partes = hash.Split('.', 3);
        if (partes.Length != 3)
            return false;

        if (!int.TryParse(partes[0], out var iteracoes))
            return false;

        byte[] salt;
        byte[] hashEsperado;
        try
        {
            salt = Convert.FromBase64String(partes[1]);
            hashEsperado = Convert.FromBase64String(partes[2]);
        }
        catch (FormatException)
        {
            return false;
        }

        var hashCalculado = Rfc2898DeriveBytes.Pbkdf2(password, salt, iteracoes, Algoritmo, hashEsperado.Length);

        return CryptographicOperations.FixedTimeEquals(hashCalculado, hashEsperado);
    }
}
