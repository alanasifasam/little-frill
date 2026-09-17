using System.Security.Claims;
using Api.Common;
using Application.Models.Encomendas;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Authorize]
[Route("api/encomendas")]
public class EncomendasController : ControllerBase
{
    private readonly IEncomendaService _encomendaService;

    public EncomendasController(IEncomendaService encomendaService)
    {
        _encomendaService = encomendaService;
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] EncomendaInputModel input)
    {
        var utilizadorId = ObterUtilizadorId();
        var resultado = await _encomendaService.CriarAsync(utilizadorId, input);
        return resultado.ToActionResult(this);
    }

    [HttpGet("minhas")]
    public async Task<IActionResult> ListarMinhas()
    {
        var utilizadorId = ObterUtilizadorId();
        var resultado = await _encomendaService.ListarPorUtilizadorAsync(utilizadorId);
        return resultado.ToActionResult(this);
    }

    [HttpGet("{referencia}")]
    public async Task<IActionResult> ObterDetalhe(string referencia)
    {
        var utilizadorId = ObterUtilizadorId();
        var resultado = await _encomendaService.ObterDetalheAsync(utilizadorId, referencia);
        return resultado.ToActionResult(this);
    }

    private int ObterUtilizadorId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
