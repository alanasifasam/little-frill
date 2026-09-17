using Api.Common;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/painel")]
[Authorize(Roles = Roles.Admin)]
public class PainelController : ControllerBase
{
    private readonly IPainelService _painelService;

    public PainelController(IPainelService painelService)
    {
        _painelService = painelService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _painelService.ObterAsync();
        return resultado.ToActionResult(this);
    }
}
