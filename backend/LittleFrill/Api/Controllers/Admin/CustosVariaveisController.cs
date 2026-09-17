using Api.Common;
using Application.Models.CustoVariavel;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/custos-variaveis")]
[Authorize(Roles = Roles.Admin)]
public class CustosVariaveisController : ControllerBase
{
    private readonly ICustoVariavelService _custoVariavelService;

    public CustosVariaveisController(ICustoVariavelService custoVariavelService)
    {
        _custoVariavelService = custoVariavelService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _custoVariavelService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCustoVariavelInputModel input)
    {
        var resultado = await _custoVariavelService.CriarAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarCustoVariavelInputModel input)
    {
        var resultado = await _custoVariavelService.AtualizarAsync(id, input);
        return resultado.ToActionResult(this);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Remover(int id)
    {
        var resultado = await _custoVariavelService.RemoverAsync(id);
        return resultado.ToActionResult(this);
    }
}
