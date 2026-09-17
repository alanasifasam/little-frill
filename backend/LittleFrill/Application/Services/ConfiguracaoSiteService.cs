using Application.Models.ConfiguracaoSite;
using Core.Common;
using Core.Interfaces;
using Infrastructure.Files;

namespace Application.Services;

public class ConfiguracaoSiteService : IConfiguracaoSiteService
{
    private readonly IConfiguracaoSiteRepository _configuracaoSiteRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IArmazenamentoImagens _armazenamentoImagens;

    public ConfiguracaoSiteService(
        IConfiguracaoSiteRepository configuracaoSiteRepository,
        IUnitOfWork unitOfWork,
        IArmazenamentoImagens armazenamentoImagens)
    {
        _configuracaoSiteRepository = configuracaoSiteRepository;
        _unitOfWork = unitOfWork;
        _armazenamentoImagens = armazenamentoImagens;
    }

    public async Task<Result<ConfiguracaoSiteViewModel>> ObterAsync()
    {
        var configuracao = await _configuracaoSiteRepository.ObterAsync();

        return Result<ConfiguracaoSiteViewModel>.Ok(ConfiguracaoSiteViewModel.FromEntity(configuracao));
    }

    public async Task<Result<ConfiguracaoSiteViewModel>> AtualizarAsync(AtualizarConfiguracaoSiteInputModel input)
    {
        var configuracao = await _configuracaoSiteRepository.ObterAsync();

        try
        {
            configuracao.DefinirTextos(input.Titulo, input.Gancho);
            configuracao.DefinirEnvioLimiarGratis(input.EnvioLimiarGratis);
            configuracao.DefinirConteudoHome(
                input.HeroEyebrow,
                input.HeroCorpo,
                input.HeroCta1Label,
                input.HeroCta2Label,
                input.HeroImagemLegenda,
                input.Confianca1Titulo,
                input.Confianca1Texto,
                input.Confianca2Titulo,
                input.Confianca2Texto,
                input.Confianca3Titulo,
                input.Confianca3TextoModelo);
        }
        catch (ArgumentException ex)
        {
            return Result<ConfiguracaoSiteViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<ConfiguracaoSiteViewModel>.Ok(ConfiguracaoSiteViewModel.FromEntity(configuracao));
    }

    public async Task<Result<string>> DefinirImagemHeroAsync(Stream conteudo, string nomeFicheiro, string contentType)
    {
        var configuracao = await _configuracaoSiteRepository.ObterAsync();

        var url = await _armazenamentoImagens.GuardarImagemSiteAsync(conteudo, nomeFicheiro);

        try
        {
            configuracao.DefinirImagemHero(url);
        }
        catch (ArgumentException ex)
        {
            return Result<string>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<string>.Ok(url);
    }
}
