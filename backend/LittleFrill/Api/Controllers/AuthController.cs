using Api.Common;
using Application.Models.Auth;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginInputModel input)
    {
        var resultado = await _authService.LoginAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPost("registo")]
    public async Task<IActionResult> Registo([FromBody] RegistoInputModel input)
    {
        var resultado = await _authService.RegistoAsync(input);
        return resultado.ToActionResult(this);
    }
}
