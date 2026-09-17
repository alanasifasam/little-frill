using Application.Models.SiteInfo;
using Core.Common;

namespace Application.Services;

public interface ISiteInfoService
{
    Task<Result<SiteInfoViewModel>> ObterAsync();
}
