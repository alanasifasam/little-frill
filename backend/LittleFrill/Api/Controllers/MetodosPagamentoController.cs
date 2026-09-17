using Api.Common;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/metodos-pagamento")]
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
        var resultado = await _metodoPagamentoConfigService.ListarDisponiveisAsync();
        return resultado.ToActionResult(this);
    }
}
