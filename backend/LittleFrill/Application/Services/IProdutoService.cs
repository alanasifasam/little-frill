using Application.Models.Produtos;
using Core.Common;

namespace Application.Services;

public interface IProdutoService
{
    Task<Result<IReadOnlyList<ProdutoViewModel>>> ListarAsync(ProdutoFiltroInputModel filtro);

    Task<Result<ProdutoViewModel>> ObterPorIdAsync(int id);
}
