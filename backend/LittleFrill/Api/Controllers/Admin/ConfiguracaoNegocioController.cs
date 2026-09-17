using Api.Common;
using Application.Models.ConfiguracaoNegocio;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/configuracao-negocio")]
[Authorize(Roles = Roles.Admin)]
public class ConfiguracaoNegocioController : ControllerBase
{
    private readonly IConfiguracaoNegocioService _configuracaoNegocioService;

    public ConfiguracaoNegocioController(IConfiguracaoNegocioService configuracaoNegocioService)
    {
        _configuracaoNegocioService = configuracaoNegocioService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _configuracaoNegocioService.ObterAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPut]
    public async Task<IActionResult> Atualizar([FromBody] AtualizarConfiguracaoNegocioInputModel input)
    {
        var resultado = await _configuracaoNegocioService.AtualizarAsync(input);
        return resultado.ToActionResult(this);
    }
}
