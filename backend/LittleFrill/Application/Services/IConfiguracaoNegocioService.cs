using Application.Models.ConfiguracaoNegocio;
using Core.Common;

namespace Application.Services;

public interface IConfiguracaoNegocioService
{
    Task<Result<ConfiguracaoNegocioViewModel>> ObterAsync();

    Task<Result<ConfiguracaoNegocioViewModel>> AtualizarAsync(AtualizarConfiguracaoNegocioInputModel input);
}
