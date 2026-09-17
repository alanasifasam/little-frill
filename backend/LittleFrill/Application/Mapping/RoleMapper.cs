using Core.Enums;

namespace Application.Mapping;

public static class RoleMapper
{
    public static string ToChave(Role role)
    {
        return role switch
        {
            Role.Cliente => "cliente",
            Role.Admin => "admin",
            _ => throw new ArgumentOutOfRangeException(nameof(role), role, "Role desconhecido.")
        };
    }

    public static Role? ParseChave(string? chave)
    {
        return chave switch
        {
            "cliente" => Role.Cliente,
            "admin" => Role.Admin,
            _ => null
        };
    }
}
