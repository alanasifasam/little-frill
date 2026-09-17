using Application.Models.CustoVariavel;
using Core.Common;
using Core.Entities;
using Core.Interfaces;

namespace Application.Services;

// Serviço admin de CRUD dos custos variáveis (despesas avulsas, com data)
// que alimentam CustoVariavelTotal no Painel/Financeiro — ver CustoVariavel
// para a invariante (Label/Valor) e CustoFixoService para o padrão de CRUD
// seguido aqui.
public class CustoVariavelService : ICustoVariavelService
{
    private readonly ICustoVariavelRepository _custoVariavelRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustoVariavelService(ICustoVariavelRepository custoVariavelRepository, IUnitOfWork unitOfWork)
    {
        _custoVariavelRepository = custoVariavelRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<CustoVariavelViewModel>>> ListarAsync()
    {
        var custosVariaveis = await _custoVariavelRepository.ListarAsync();

        var viewModels = custosVariaveis
            .Select(CustoVariavelViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<CustoVariavelViewModel>>.Ok(viewModels);
    }

    public async Task<Result<CustoVariavelViewModel>> CriarAsync(CriarCustoVariavelInputModel input)
    {
        CustoVariavel custoVariavel;
        try
        {
            custoVariavel = new CustoVariavel(input.Label, input.Valor, input.Data);
        }
        catch (ArgumentException ex)
        {
            return Result<CustoVariavelViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _custoVariavelRepository.AdicionarAsync(custoVariavel);
        await _unitOfWork.SaveChangesAsync();

        return Result<CustoVariavelViewModel>.Ok(CustoVariavelViewModel.FromEntity(custoVariavel));
    }

    public async Task<Result<CustoVariavelViewModel>> AtualizarAsync(int id, AtualizarCustoVariavelInputModel input)
    {
        var custoVariavel = await _custoVariavelRepository.ObterPorIdAsync(id);
        if (custoVariavel is null)
            return Result<CustoVariavelViewModel>.Falha("Custo variável não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            custoVariavel.Atualizar(input.Label, input.Valor, input.Data);
        }
        catch (ArgumentException ex)
        {
            return Result<CustoVariavelViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<CustoVariavelViewModel>.Ok(CustoVariavelViewModel.FromEntity(custoVariavel));
    }

    public async Task<Result> RemoverAsync(int id)
    {
        var custoVariavel = await _custoVariavelRepository.ObterPorIdAsync(id);
        if (custoVariavel is null)
            return Result.Falha("Custo variável não encontrado.", ErrorType.NaoEncontrado);

        await _custoVariavelRepository.RemoverAsync(custoVariavel);
        await _unitOfWork.SaveChangesAsync();

        return Result.Ok();
    }
}
