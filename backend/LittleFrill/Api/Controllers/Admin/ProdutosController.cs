using Api.Common;
using Application.Models.Produtos;
using Application.Services;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Admin;

[ApiController]
[Route("api/admin/produtos")]
[Authorize(Roles = Roles.Admin)]
public class ProdutosController : ControllerBase
{
    private const long TamanhoMaximoImagemBytes = 5 * 1024 * 1024;

    private readonly IProdutoAdminService _produtoAdminService;

    public ProdutosController(IProdutoAdminService produtoAdminService)
    {
        _produtoAdminService = produtoAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var resultado = await _produtoAdminService.ListarAsync();
        return resultado.ToActionResult(this);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] ProdutoAdminInputModel input)
    {
        var resultado = await _produtoAdminService.CriarAsync(input);
        return resultado.ToActionResult(this);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Editar(int id, [FromBody] ProdutoAdminInputModel input)
    {
        var resultado = await _produtoAdminService.EditarAsync(id, input);
        return resultado.ToActionResult(this);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Apagar(int id)
    {
        var resultado = await _produtoAdminService.ApagarAsync(id);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{id:int}/ativo")]
    public async Task<IActionResult> AlternarAtivo(int id)
    {
        var resultado = await _produtoAdminService.AlternarAtivoAsync(id);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{id:int}/destaque")]
    public async Task<IActionResult> AlternarDestaque(int id)
    {
        var resultado = await _produtoAdminService.AlternarDestaqueAsync(id);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{id:int}/novo")]
    public async Task<IActionResult> AlternarNovo(int id)
    {
        var resultado = await _produtoAdminService.AlternarNovoAsync(id);
        return resultado.ToActionResult(this);
    }

    [HttpPost("{id:int}/imagens")]
    public async Task<IActionResult> AdicionarImagens(int id, IFormFileCollection ficheiros)
    {
        if (ficheiros is null || ficheiros.Count == 0)
            return BadRequest(new { error = "Pelo menos um ficheiro de imagem é obrigatório." });

        foreach (var ficheiro in ficheiros)
        {
            if (ficheiro is null || ficheiro.Length == 0)
                return BadRequest(new { error = "Ficheiro de imagem é obrigatório." });

            if (!ficheiro.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "O ficheiro tem de ser uma imagem." });

            if (ficheiro.Length > TamanhoMaximoImagemBytes)
                return BadRequest(new { error = "Imagem excede o tamanho máximo de 5 MB." });
        }

        var lista = ficheiros
            .Select(f => (Conteudo: (Stream)f.OpenReadStream(), NomeFicheiro: f.FileName))
            .ToList();

        try
        {
            var resultado = await _produtoAdminService.AdicionarImagensAsync(id, lista);

            if (!resultado.Sucesso)
                return resultado.ToActionResult(this);

            return Ok(new { imagens = resultado.Valor });
        }
        finally
        {
            foreach (var item in lista)
                await item.Conteudo.DisposeAsync();
        }
    }

    [HttpDelete("{id:int}/imagens/{imagemId:int}")]
    public async Task<IActionResult> RemoverImagem(int id, int imagemId)
    {
        var resultado = await _produtoAdminService.RemoverImagemAsync(id, imagemId);
        return resultado.ToActionResult(this);
    }

    [HttpPatch("{id:int}/imagens/{imagemId:int}/capa")]
    public async Task<IActionResult> DefinirCapa(int id, int imagemId)
    {
        var resultado = await _produtoAdminService.DefinirCapaAsync(id, imagemId);

        if (!resultado.Sucesso)
            return resultado.ToActionResult(this);

        return Ok(new { imagens = resultado.Valor });
    }

    [HttpPatch("{id:int}/imagens/{imagemId:int}/foco")]
    public async Task<IActionResult> DefinirFoco(int id, int imagemId, [FromBody] AtualizarFocoInputModel input)
    {
        var resultado = await _produtoAdminService.DefinirFocoAsync(id, imagemId, input.FocoX, input.FocoY);

        if (!resultado.Sucesso)
            return resultado.ToActionResult(this);

        return Ok(resultado.Valor);
    }
}
