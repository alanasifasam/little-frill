using Core.Entities;

namespace Infrastructure.Auth;

public interface IJwtTokenGenerator
{
    string Gerar(Utilizador utilizador);
}
