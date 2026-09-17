using Api.Common;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/seccoes")]
[Authorize(Roles = Roles.Admin)]
public class SeccoesController : ControllerBase
{
    private readonly ISeccaoConfigService _seccaoConfigService;

    public SeccoesController(ISeccaoConfigService seccaoConfigService)
    {
        _seccaoConfigService = seccaoConfigService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _seccaoConfigService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{chave}/ativa")]
    public async Task<IActionResult> AlternarAtiva(string chave)
    {
        var resultado = await _seccaoConfigService.AlternarAtivaAsync(chave);
        return resultado.ToActionResult(this);
    }
}
