using Api.Common;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/financeiro")]
[Authorize(Roles = Roles.Admin)]
public class FinanceiroController : ControllerBase
{
    private readonly IFinanceiroService _financeiroService;

    public FinanceiroController(IFinanceiroService financeiroService)
    {
        _financeiroService = financeiroService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _financeiroService.ObterAsync();
        return resultado.ToActionResult(this);
    }
}
