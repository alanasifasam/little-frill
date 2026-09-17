using Api.Common;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/pagamentos")]
[Authorize(Roles = Roles.Admin)]
public class PagamentosController : ControllerBase
{
    private readonly IPagamentosService _pagamentosService;

    public PagamentosController(IPagamentosService pagamentosService)
    {
        _pagamentosService = pagamentosService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _pagamentosService.ObterAsync();
        return resultado.ToActionResult(this);
    }
}
