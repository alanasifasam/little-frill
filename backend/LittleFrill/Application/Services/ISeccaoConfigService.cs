using Application.Models.SeccaoConfig;
using Core.Common;

namespace Application.Services;

public interface ISeccaoConfigService
{
    Task<Result<IReadOnlyList<SeccaoConfigViewModel>>> ListarAsync();

    Task<Result<SeccaoConfigViewModel>> AlternarAtivaAsync(string chave);
}
