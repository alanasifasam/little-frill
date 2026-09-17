using Api.Common;
using Application.Models.MetodoPagamento;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/metodos-pagamento")]
[Authorize(Roles = Roles.Admin)]
public class MetodosPagamentoController : ControllerBase
{
    private readonly IMetodoPagamentoConfigService _metodoPagamentoConfigService;

    public MetodosPagamentoController(IMetodoPagamentoConfigService metodoPagamentoConfigService)
    {
        _metodoPagamentoConfigService = metodoPagamentoConfigService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _metodoPagamentoConfigService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPut("{metodo}")]
    public async Task<IActionResult> Atualizar(string metodo, [FromBody] AtualizarMetodoPagamentoConfigInputModel input)
    {
        var resultado = await _metodoPagamentoConfigService.AtualizarAsync(metodo, input);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{metodo}/ativo")]
    public async Task<IActionResult> AlternarAtivo(string metodo)
    {
        var resultado = await _metodoPagamentoConfigService.AlternarAtivoAsync(metodo);
        return resultado.ToActionResult(this);
    }
}
