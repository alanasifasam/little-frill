using Core.Interfaces;
using Microsoft.Extensions.Options;

namespace Infrastructure.Envio;

public class EnvioPolicy : IEnvioPolicy
{
    private readonly EnvioOptions _options;
    private readonly IConfiguracaoSiteRepository _configuracaoSiteRepository;

    public EnvioPolicy(IOptions<EnvioOptions> options, IConfiguracaoSiteRepository configuracaoSiteRepository)
    {
        _options = options.Value;
        _configuracaoSiteRepository = configuracaoSiteRepository;
    }

    public decimal CustoPadrao => _options.CustoPadrao;

    // LimiarGratis passou de appsettings.json para ConfiguracaoSite (base de
    // dados), editável no admin — CustoPadrao mantém-se em configuração.
    public async Task<decimal> ObterLimiarGratisAsync()
    {
        var config = await _configuracaoSiteRepository.ObterAsync();
        return config.EnvioLimiarGratis;
    }
}
