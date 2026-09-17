using Application.Models.Pagamentos;
using Core.Common;

namespace Application.Services;

public interface IPagamentosService
{
    Task<Result<PagamentosViewModel>> ObterAsync();
}
