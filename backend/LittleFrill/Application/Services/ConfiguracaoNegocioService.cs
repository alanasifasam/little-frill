using Application.Models.ConfiguracaoNegocio;
using Core.Common;
using Core.Interfaces;

namespace Application.Services;

public class ConfiguracaoNegocioService : IConfiguracaoNegocioService
{
    private readonly IConfiguracaoNegocioRepository _configuracaoNegocioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ConfiguracaoNegocioService(
        IConfiguracaoNegocioRepository configuracaoNegocioRepository,
        IUnitOfWork unitOfWork)
    {
        _configuracaoNegocioRepository = configuracaoNegocioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ConfiguracaoNegocioViewModel>> ObterAsync()
    {
        var configuracao = await _configuracaoNegocioRepository.ObterAsync();

        return Result<ConfiguracaoNegocioViewModel>.Ok(ConfiguracaoNegocioViewModel.FromEntity(configuracao));
    }

    public async Task<Result<ConfiguracaoNegocioViewModel>> AtualizarAsync(AtualizarConfiguracaoNegocioInputModel input)
    {
        var configuracao = await _configuracaoNegocioRepository.ObterAsync();

        try
        {
            configuracao.AtualizarMeta(input.MetaMes);
            configuracao.AtualizarEnvioReal(input.EnvioRealCtt);
            configuracao.DefinirFerias(input.FeriasLigadas);
        }
        catch (ArgumentException ex)
        {
            return Result<ConfiguracaoNegocioViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<ConfiguracaoNegocioViewModel>.Ok(ConfiguracaoNegocioViewModel.FromEntity(configuracao));
    }
}
