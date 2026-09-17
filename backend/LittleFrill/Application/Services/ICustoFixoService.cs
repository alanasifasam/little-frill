using Application.Models.CustoFixo;
using Core.Common;

namespace Application.Services;

public interface ICustoFixoService
{
    Task<Result<IReadOnlyList<CustoFixoViewModel>>> ListarAsync();

    Task<Result<CustoFixoViewModel>> CriarAsync(CriarCustoFixoInputModel input);

    Task<Result<CustoFixoViewModel>> AtualizarAsync(int id, AtualizarCustoFixoInputModel input);

    Task<Result> RemoverAsync(int id);
}
