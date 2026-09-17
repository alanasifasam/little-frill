using Application.Mapping;
using Application.Models.SiteInfo;
using Core.Common;
using Core.Interfaces;
using Infrastructure.Envio;

namespace Application.Services;

public class SiteInfoService : ISiteInfoService
{
    private readonly IConfiguracaoSiteRepository _configuracaoSiteRepository;
    private readonly IConfiguracaoNegocioRepository _configuracaoNegocioRepository;
    private readonly ISeccaoConfigRepository _seccaoConfigRepository;
    private readonly IEnvioPolicy _envioPolicy;

    public SiteInfoService(
        IConfiguracaoSiteRepository configuracaoSiteRepository,
        IConfiguracaoNegocioRepository configuracaoNegocioRepository,
        ISeccaoConfigRepository seccaoConfigRepository,
        IEnvioPolicy envioPolicy)
    {
        _configuracaoSiteRepository = configuracaoSiteRepository;
        _configuracaoNegocioRepository = configuracaoNegocioRepository;
        _seccaoConfigRepository = seccaoConfigRepository;
        _envioPolicy = envioPolicy;
    }

    public async Task<Result<SiteInfoViewModel>> ObterAsync()
    {
        var configSite = await _configuracaoSiteRepository.ObterAsync();
        var configNegocio = await _configuracaoNegocioRepository.ObterAsync();
        var seccoesConfig = await _seccaoConfigRepository.ListarAsync();

        var seccoesAtivas = seccoesConfig
            .Where(s => s.Ativa)
            .Select(s => SeccaoMapper.ToChave(s.Seccao))
            .ToList();

        var viewModel = new SiteInfoViewModel
        {
            Titulo = configSite.Titulo,
            Gancho = configSite.Gancho,
            EnvioCustoPadrao = _envioPolicy.CustoPadrao,
            EnvioLimiarGratis = configSite.EnvioLimiarGratis,
            FeriasLigadas = configNegocio.FeriasLigadas,
            SeccoesAtivas = seccoesAtivas,
            HeroEyebrow = configSite.HeroEyebrow,
            HeroCorpo = configSite.HeroCorpo,
            HeroCta1Label = configSite.HeroCta1Label,
            HeroCta2Label = configSite.HeroCta2Label,
            HeroImagemLegenda = configSite.HeroImagemLegenda,
            Confianca1Titulo = configSite.Confianca1Titulo,
            Confianca1Texto = configSite.Confianca1Texto,
            Confianca2Titulo = configSite.Confianca2Titulo,
            Confianca2Texto = configSite.Confianca2Texto,
            Confianca3Titulo = configSite.Confianca3Titulo,
            Confianca3TextoModelo = configSite.Confianca3TextoModelo,
            HeroImagemUrl = configSite.HeroImagemUrl
        };

        return Result<SiteInfoViewModel>.Ok(viewModel);
    }
}
