using Application.Models.CustoFixo;
using Core.Common;
using Core.Entities;
using Core.Interfaces;

namespace Application.Services;

// Serviço admin de CRUD dos custos fixos mensais (renda, luz, ...) que
// alimentam FixosTotal no Painel/Financeiro — ver CustoFixo para a
// invariante (Label/Valor) e ProdutoAdminService para o padrão de CRUD
// seguido aqui.
public class CustoFixoService : ICustoFixoService
{
    private readonly ICustoFixoRepository _custoFixoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustoFixoService(ICustoFixoRepository custoFixoRepository, IUnitOfWork unitOfWork)
    {
        _custoFixoRepository = custoFixoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<CustoFixoViewModel>>> ListarAsync()
    {
        var custosFixos = await _custoFixoRepository.ListarAsync();

        var viewModels = custosFixos
            .Select(CustoFixoViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<CustoFixoViewModel>>.Ok(viewModels);
    }

    public async Task<Result<CustoFixoViewModel>> CriarAsync(CriarCustoFixoInputModel input)
    {
        CustoFixo custoFixo;
        try
        {
            custoFixo = new CustoFixo(input.Label, input.Valor);
        }
        catch (ArgumentException ex)
        {
            return Result<CustoFixoViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _custoFixoRepository.AdicionarAsync(custoFixo);
        await _unitOfWork.SaveChangesAsync();

        return Result<CustoFixoViewModel>.Ok(CustoFixoViewModel.FromEntity(custoFixo));
    }

    public async Task<Result<CustoFixoViewModel>> AtualizarAsync(int id, AtualizarCustoFixoInputModel input)
    {
        var custoFixo = await _custoFixoRepository.ObterPorIdAsync(id);
        if (custoFixo is null)
            return Result<CustoFixoViewModel>.Falha("Custo fixo não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            custoFixo.Atualizar(input.Label, input.Valor);
        }
        catch (ArgumentException ex)
        {
            return Result<CustoFixoViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        custoFixo.DefinirAtivo(input.Ativo);
        await _unitOfWork.SaveChangesAsync();

        return Result<CustoFixoViewModel>.Ok(CustoFixoViewModel.FromEntity(custoFixo));
    }

    public async Task<Result> RemoverAsync(int id)
    {
        var custoFixo = await _custoFixoRepository.ObterPorIdAsync(id);
        if (custoFixo is null)
            return Result.Falha("Custo fixo não encontrado.", ErrorType.NaoEncontrado);

        await _custoFixoRepository.RemoverAsync(custoFixo);
        await _unitOfWork.SaveChangesAsync();

        return Result.Ok();
    }
}
