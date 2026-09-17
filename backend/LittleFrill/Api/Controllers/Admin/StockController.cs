using Api.Common;
using Application.Models.Stock;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/stock")]
[Authorize(Roles = Roles.Admin)]
public class StockController : ControllerBase
{
    private readonly IStockService _stockService;

    public StockController(IStockService stockService)
    {
        _stockService = stockService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _stockService.ObterAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPost("entrada")]
    public async Task<IActionResult> RegistarEntrada([FromBody] EntradaStockInputModel input)
    {
        var resultado = await _stockService.RegistarEntradaAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPost("saida")]
    public async Task<IActionResult> RegistarSaida([FromBody] SaidaStockInputModel input)
    {
        var resultado = await _stockService.RegistarSaidaAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPost("venda")]
    public async Task<IActionResult> RegistarVenda([FromBody] VendaBalcaoInputModel input)
    {
        var resultado = await _stockService.RegistarVendaAsync(input);
        if (!resultado.Sucesso)
            return resultado.ToActionResult(this);

        return Ok(new { referencia = resultado.Valor });
    }
}
