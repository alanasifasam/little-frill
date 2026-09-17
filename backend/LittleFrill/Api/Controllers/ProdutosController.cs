using Api.Common;
using Application.Models.Produtos;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/produtos")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _produtoService;

    public ProdutosController(IProdutoService produtoService)
    {
        _produtoService = produtoService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] ProdutoFiltroInputModel filtro)
    {
        var resultado = await _produtoService.ListarAsync(filtro);
        return resultado.ToActionResult(this);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var resultado = await _produtoService.ObterPorIdAsync(id);
        return resultado.ToActionResult(this);
    }
}
