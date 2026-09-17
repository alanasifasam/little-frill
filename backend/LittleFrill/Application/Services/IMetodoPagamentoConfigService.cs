using Application.Models.MetodoPagamento;
using Core.Common;

namespace Application.Services;

public interface IMetodoPagamentoConfigService
{
    Task<Result<IReadOnlyList<MetodoPagamentoConfigViewModel>>> ListarAsync();

    Task<Result<MetodoPagamentoConfigViewModel>> AtualizarAsync(string metodoChave, AtualizarMetodoPagamentoConfigInputModel input);

    Task<Result<MetodoPagamentoConfigViewModel>> AlternarAtivoAsync(string metodoChave);

    Task<Result<IReadOnlyList<MetodoPagamentoDisponivelViewModel>>> ListarDisponiveisAsync();
}
