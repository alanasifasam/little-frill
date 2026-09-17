using Api.Common;
using Application.Models.CustoFixo;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/custos-fixos")]
[Authorize(Roles = Roles.Admin)]
public class CustosFixosController : ControllerBase
{
    private readonly ICustoFixoService _custoFixoService;

    public CustosFixosController(ICustoFixoService custoFixoService)
    {
        _custoFixoService = custoFixoService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _custoFixoService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCustoFixoInputModel input)
    {
        var resultado = await _custoFixoService.CriarAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarCustoFixoInputModel input)
    {
        var resultado = await _custoFixoService.AtualizarAsync(id, input);
        return resultado.ToActionResult(this);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Remover(int id)
    {
        var resultado = await _custoFixoService.RemoverAsync(id);
        return resultado.ToActionResult(this);
    }
}
