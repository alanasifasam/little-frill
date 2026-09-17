using Api.Common;
using Application.Models.Clientes;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/clientes")]
[Authorize(Roles = Roles.Admin)]
public class ClientesController : ControllerBase
{
    private readonly IClienteAdminService _clienteAdminService;

    public ClientesController(IClienteAdminService clienteAdminService)
    {
        _clienteAdminService = clienteAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _clienteAdminService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ClienteAdminInputModel input)
    {
        var resultado = await _clienteAdminService.CriarAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Editar(int id, [FromBody] ClienteAdminInputModel input)
    {
        var resultado = await _clienteAdminService.EditarAsync(id, input);
        return resultado.ToActionResult(this);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Apagar(int id)
    {
        var resultado = await _clienteAdminService.ApagarAsync(id);
        return resultado.ToActionResult(this);
    }
}
