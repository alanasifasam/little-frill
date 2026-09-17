using Application.Models.Painel;
using Core.Common;

namespace Application.Services;

public interface IPainelService
{
    Task<Result<PainelViewModel>> ObterAsync();
}
