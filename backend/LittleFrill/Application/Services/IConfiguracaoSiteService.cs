using Application.Models.ConfiguracaoSite;
using Core.Common;

namespace Application.Services;

public interface IConfiguracaoSiteService
{
    Task<Result<ConfiguracaoSiteViewModel>> ObterAsync();

    Task<Result<ConfiguracaoSiteViewModel>> AtualizarAsync(AtualizarConfiguracaoSiteInputModel input);

    Task<Result<string>> DefinirImagemHeroAsync(Stream conteudo, string nomeFicheiro, string contentType);
}
