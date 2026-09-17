using Application.Models.Stock;
using Core.Common;

namespace Application.Services;

public interface IStockService
{
    Task<Result<StockAdminViewModel>> ObterAsync();

    Task<Result<MovimentoStockViewModel>> RegistarEntradaAsync(EntradaStockInputModel input);

    Task<Result<MovimentoStockViewModel>> RegistarSaidaAsync(SaidaStockInputModel input);

    Task<Result<string>> RegistarVendaAsync(VendaBalcaoInputModel input);
}
