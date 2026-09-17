using Application.Mapping;
using Application.Models.SeccaoConfig;
using Core.Common;
using Core.Interfaces;

namespace Application.Services;

public class SeccaoConfigService : ISeccaoConfigService
{
    private readonly ISeccaoConfigRepository _seccaoConfigRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SeccaoConfigService(
        ISeccaoConfigRepository seccaoConfigRepository,
        IUnitOfWork unitOfWork)
    {
        _seccaoConfigRepository = seccaoConfigRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<SeccaoConfigViewModel>>> ListarAsync()
    {
        var configs = await _seccaoConfigRepository.ListarAsync();

        var viewModels = configs
            .Select(SeccaoConfigViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<SeccaoConfigViewModel>>.Ok(viewModels);
    }

    public async Task<Result<SeccaoConfigViewModel>> AlternarAtivaAsync(string chave)
    {
        var seccao = SeccaoMapper.ParseChave(chave);
        if (seccao is null)
            return Result<SeccaoConfigViewModel>.Falha("Secção inválida.", ErrorType.Validacao);

        var config = await _seccaoConfigRepository.ObterPorSeccaoAsync(seccao.Value);
        if (config is null)
            return Result<SeccaoConfigViewModel>.Falha("Secção não encontrada.", ErrorType.NaoEncontrado);

        config.DefinirAtiva(!config.Ativa);
        await _unitOfWork.SaveChangesAsync();

        return Result<SeccaoConfigViewModel>.Ok(SeccaoConfigViewModel.FromEntity(config));
    }
}
