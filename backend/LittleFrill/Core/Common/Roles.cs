namespace Core.Common;

/// <summary>
/// Strings de papel usadas na claim JWT (<see cref="System.Security.Claims.ClaimTypes.Role"/>)
/// e em <c>[Authorize(Roles = ...)]</c>. Não é um duplicado do enum
/// <see cref="Core.Enums.Role"/> — existe só porque o middleware de
/// autorização do ASP.NET Core compara strings, não valores de enum.
/// </summary>
public static class Roles
{
    public const string Admin = "Admin";
    public const string Cliente = "Cliente";
}
