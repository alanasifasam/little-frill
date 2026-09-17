using Application.Mapping;
using Application.Models.MetodoPagamento;
using Core.Common;
using Core.Interfaces;

namespace Application.Services;

public class MetodoPagamentoConfigService : IMetodoPagamentoConfigService
{
    private readonly IMetodoPagamentoConfigRepository _metodoPagamentoConfigRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MetodoPagamentoConfigService(
        IMetodoPagamentoConfigRepository metodoPagamentoConfigRepository,
        IUnitOfWork unitOfWork)
    {
        _metodoPagamentoConfigRepository = metodoPagamentoConfigRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<MetodoPagamentoConfigViewModel>>> ListarAsync()
    {
        var configs = await _metodoPagamentoConfigRepository.ListarAsync();

        var viewModels = configs
            .Select(MetodoPagamentoConfigViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<MetodoPagamentoConfigViewModel>>.Ok(viewModels);
    }

    public async Task<Result<MetodoPagamentoConfigViewModel>> AtualizarAsync(string metodoChave, AtualizarMetodoPagamentoConfigInputModel input)
    {
        var metodo = MetodoPagamentoMapper.ParseChave(metodoChave);
        if (metodo is null)
            return Result<MetodoPagamentoConfigViewModel>.Falha("Método de pagamento inválido.", ErrorType.Validacao);

        var config = await _metodoPagamentoConfigRepository.ObterPorMetodoAsync(metodo.Value);
        if (config is null)
            return Result<MetodoPagamentoConfigViewModel>.Falha("Método de pagamento não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            config.AtualizarTaxas(input.TaxaPercent, input.CustoFixo);
            config.DefinirIban(input.Iban);
            config.DefinirNumeroMbway(input.NumeroMbway);
            config.DefinirNota(input.Nota);
        }
        catch (ArgumentException ex)
        {
            return Result<MetodoPagamentoConfigViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<MetodoPagamentoConfigViewModel>.Ok(MetodoPagamentoConfigViewModel.FromEntity(config));
    }

    public async Task<Result<MetodoPagamentoConfigViewModel>> AlternarAtivoAsync(string metodoChave)
    {
        var metodo = MetodoPagamentoMapper.ParseChave(metodoChave);
        if (metodo is null)
            return Result<MetodoPagamentoConfigViewModel>.Falha("Método de pagamento inválido.", ErrorType.Validacao);

        var config = await _metodoPagamentoConfigRepository.ObterPorMetodoAsync(metodo.Value);
        if (config is null)
            return Result<MetodoPagamentoConfigViewModel>.Falha("Método de pagamento não encontrado.", ErrorType.NaoEncontrado);

        config.DefinirAtivo(!config.Ativo);
        await _unitOfWork.SaveChangesAsync();

        return Result<MetodoPagamentoConfigViewModel>.Ok(MetodoPagamentoConfigViewModel.FromEntity(config));
    }

    // Usado pelo endpoint PÚBLICO — só os métodos ativos, com os dados de
    // pagamento que o cliente precisa de ver (Iban/NumeroMbway). Nunca
    // Taxa/CustoFixo, que continuam internos ao admin.
    public async Task<Result<IReadOnlyList<MetodoPagamentoDisponivelViewModel>>> ListarDisponiveisAsync()
    {
        var configs = await _metodoPagamentoConfigRepository.ListarAsync();

        var disponiveis = configs
            .Where(c => c.Ativo)
            .Select(MetodoPagamentoDisponivelViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<MetodoPagamentoDisponivelViewModel>>.Ok(disponiveis);
    }
}
