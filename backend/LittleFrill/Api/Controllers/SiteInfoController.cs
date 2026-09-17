using Api.Common;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/site-info")]
public class SiteInfoController : ControllerBase
{
    private readonly ISiteInfoService _siteInfoService;

    public SiteInfoController(ISiteInfoService siteInfoService)
    {
        _siteInfoService = siteInfoService;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var resultado = await _siteInfoService.ObterAsync();
        return resultado.ToActionResult(this);
    }
}
