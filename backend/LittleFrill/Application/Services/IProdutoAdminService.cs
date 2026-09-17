using Application.Models.Produtos;
using Core.Common;

namespace Application.Services;

public interface IProdutoAdminService
{
    Task<Result<IReadOnlyList<ProdutoAdminViewModel>>> ListarAsync();

    Task<Result<ProdutoAdminViewModel>> CriarAsync(ProdutoAdminInputModel input);

    Task<Result<ProdutoAdminViewModel>> EditarAsync(int id, ProdutoAdminInputModel input);

    Task<Result<ApagarProdutoResultado>> ApagarAsync(int id);

    Task<Result<bool>> AlternarAtivoAsync(int id);

    Task<Result<bool>> AlternarDestaqueAsync(int id);

    Task<Result<bool>> AlternarNovoAsync(int id);

    Task<Result<IReadOnlyList<ProdutoImagemViewModel>>> AdicionarImagensAsync(int id, IReadOnlyList<(Stream Conteudo, string NomeFicheiro)> ficheiros);

    Task<Result> RemoverImagemAsync(int produtoId, int imagemId);

    Task<Result<IReadOnlyList<ProdutoImagemViewModel>>> DefinirCapaAsync(int produtoId, int imagemId);

    Task<Result<ProdutoImagemViewModel>> DefinirFocoAsync(int produtoId, int imagemId, decimal focoX, decimal focoY);
}
