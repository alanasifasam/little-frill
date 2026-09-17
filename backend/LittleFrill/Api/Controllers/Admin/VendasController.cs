using Api.Common;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/vendas")]
[Authorize(Roles = Roles.Admin)]
public class VendasController : ControllerBase
{
    private readonly IVendasService _vendasService;

    public VendasController(IVendasService vendasService)
    {
        _vendasService = vendasService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _vendasService.ObterAsync();
        return resultado.ToActionResult(this);
    }
}
