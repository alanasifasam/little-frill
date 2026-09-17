using Application.Models.Vendas;
using Core.Common;

namespace Application.Services;

public interface IVendasService
{
    Task<Result<VendasViewModel>> ObterAsync();
}
