using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Auth;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtOptions _options;

    public JwtTokenGenerator(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string Gerar(Utilizador utilizador)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, utilizador.Id.ToString()),
            new Claim(ClaimTypes.Email, utilizador.Email),
            new Claim(ClaimTypes.GivenName, utilizador.Nome),
            new Claim(ClaimTypes.Role, utilizador.Role == Role.Admin ? Roles.Admin : Roles.Cliente)
        };

        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpiraMinutos),
            signingCredentials: credenciais);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
