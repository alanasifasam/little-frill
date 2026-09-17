using Api.Common;
using Application.Models.ConfiguracaoSite;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/configuracao-site")]
[Authorize(Roles = Roles.Admin)]
public class ConfiguracaoSiteController : ControllerBase
{
    private const long TamanhoMaximoImagemBytes = 5 * 1024 * 1024;

    private readonly IConfiguracaoSiteService _configuracaoSiteService;

    public ConfiguracaoSiteController(IConfiguracaoSiteService configuracaoSiteService)
    {
        _configuracaoSiteService = configuracaoSiteService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _configuracaoSiteService.ObterAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPut]
    public async Task<IActionResult> Atualizar([FromBody] AtualizarConfiguracaoSiteInputModel input)
    {
        var resultado = await _configuracaoSiteService.AtualizarAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPost("hero-imagem")]
    public async Task<IActionResult> DefinirImagemHero(IFormFile ficheiro)
    {
        if (ficheiro is null || ficheiro.Length == 0)
            return BadRequest(new { error = "Ficheiro de imagem é obrigatório." });

        if (!ficheiro.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { error = "O ficheiro tem de ser uma imagem." });

        if (ficheiro.Length > TamanhoMaximoImagemBytes)
            return BadRequest(new { error = "Imagem excede o tamanho máximo de 5 MB." });

        await using var conteudo = ficheiro.OpenReadStream();
        var resultado = await _configuracaoSiteService.DefinirImagemHeroAsync(conteudo, ficheiro.FileName, ficheiro.ContentType);

        if (!resultado.Sucesso)
            return resultado.ToActionResult(this);

        return Ok(new { imagemUrl = resultado.Valor });
    }
}
