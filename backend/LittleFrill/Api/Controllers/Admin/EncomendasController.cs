using Api.Common;
using Application.Models.Encomendas;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/encomendas")]
[Authorize(Roles = Roles.Admin)]
public class EncomendasController : ControllerBase
{
    private readonly IEncomendaAdminService _encomendaAdminService;

    public EncomendasController(IEncomendaAdminService encomendaAdminService)
    {
        _encomendaAdminService = encomendaAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _encomendaAdminService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpGet("{referencia}")]
    public async Task<IActionResult> ObterDetalhe(string referencia)
    {
        var resultado = await _encomendaAdminService.ObterDetalheAsync(referencia);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{referencia}/rastreio")]
    public async Task<IActionResult> DefinirRastreio(string referencia, [FromBody] DefinirRastreioInputModel input)
    {
        var resultado = await _encomendaAdminService.DefinirRastreioAsync(referencia, input.CodigoRastreio);
        return resultado.ToActionResult(this);
    }

    [HttpPut("{referencia}/estado")]
    public async Task<IActionResult> DefinirEstado(string referencia, [FromBody] DefinirEstadoInputModel input)
    {
        var resultado = await _encomendaAdminService.DefinirEstadoAsync(referencia, input.Estado);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{referencia}/pago")]
    public async Task<IActionResult> AlternarPago(string referencia)
    {
        var resultado = await _encomendaAdminService.AlternarPagoAsync(referencia);
        return resultado.ToActionResult(this);
    }

    [HttpPost("{referencia}/anular")]
    public async Task<IActionResult> Anular(string referencia)
    {
        var resultado = await _encomendaAdminService.AnularAsync(referencia);
        return resultado.ToActionResult(this);
    }

    [HttpPost("{referencia}/reabrir")]
    public async Task<IActionResult> Reabrir(string referencia)
    {
        var resultado = await _encomendaAdminService.ReabrirAsync(referencia);
        return resultado.ToActionResult(this);
    }

    [HttpDelete("{referencia}")]
    public async Task<IActionResult> Apagar(string referencia)
    {
        var resultado = await _encomendaAdminService.ApagarAsync(referencia);
        return resultado.ToActionResult(this);
    }
}
