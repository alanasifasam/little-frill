using Application.Models.Financeiro;
using Core.Common;

namespace Application.Services;

public interface IFinanceiroService
{
    Task<Result<FinanceiroViewModel>> ObterAsync();
}
