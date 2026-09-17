using Application.Models.CustoVariavel;
using Core.Common;

namespace Application.Services;

public interface ICustoVariavelService
{
    Task<Result<IReadOnlyList<CustoVariavelViewModel>>> ListarAsync();

    Task<Result<CustoVariavelViewModel>> CriarAsync(CriarCustoVariavelInputModel input);

    Task<Result<CustoVariavelViewModel>> AtualizarAsync(int id, AtualizarCustoVariavelInputModel input);

    Task<Result> RemoverAsync(int id);
}
