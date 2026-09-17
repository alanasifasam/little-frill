using Application.Mapping;
using Application.Models.Encomendas;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço próprio do admin: liga-se à MESMA Encomenda que o checkout da loja
// e "Os meus pedidos" (EncomendaService) leem/escrevem — não há sincronismo
// nenhum para construir, a máquina de estados de Encomenda é a fonte única
// de verdade dos dois lados.
public class EncomendaAdminService : IEncomendaAdminService
{
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IProdutoRepository _produtoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EncomendaAdminService(
        IEncomendaRepository encomendaRepository,
        IProdutoRepository produtoRepository,
        IUnitOfWork unitOfWork)
    {
        _encomendaRepository = encomendaRepository;
        _produtoRepository = produtoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IReadOnlyList<EncomendaAdminViewModel>>> ListarAsync()
    {
        var encomendas = await _encomendaRepository.ListarParaAdminAsync();

        var viewModels = encomendas
            .Select(EncomendaAdminViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<EncomendaAdminViewModel>>.Ok(viewModels);
    }

    public async Task<Result<EncomendaDetalheViewModel>> ObterDetalheAsync(string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaDetalheViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        var produtosPorId = await ObterProdutosDosItensAsync(encomenda);

        return Result<EncomendaDetalheViewModel>.Ok(EncomendaDetalheViewModel.FromEntity(encomenda, produtosPorId));
    }

    public async Task<Result<EncomendaAdminViewModel>> DefinirRastreioAsync(string referencia, string? codigoRastreio)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        encomenda.DefinirRastreio(codigoRastreio);
        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    public async Task<Result<EncomendaAdminViewModel>> DefinirEstadoAsync(string referencia, string estadoChave)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        var estado = EstadoEncomendaMapper.ParseChave(estadoChave);
        if (estado is null)
            return Result<EncomendaAdminViewModel>.Falha("Estado inválido.", ErrorType.Validacao);

        try
        {
            encomenda.DefinirEstado(estado.Value);
        }
        catch (InvalidOperationException ex)
        {
            return Result<EncomendaAdminViewModel>.Falha(ex.Message, ErrorType.Conflito);
        }
        catch (ArgumentException ex)
        {
            return Result<EncomendaAdminViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    public async Task<Result<EncomendaAdminViewModel>> AlternarPagoAsync(string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        encomenda.AlternarPago();
        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    public async Task<Result<EncomendaAdminViewModel>> AnularAsync(string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        var produtosPorId = await ObterProdutosDosItensAsync(encomenda);

        // Anular devolve o stock ao inventário (regra 4 do AdminEspec) —
        // mexe em Produto, um agregado diferente de Encomenda, por isso é
        // o serviço de aplicação (não a entidade) quem orquestra as duas
        // mutações na mesma transação.
        foreach (var item in encomenda.Itens)
        {
            produtosPorId[item.ProdutoId].AdicionarStock(item.Quantidade);
        }

        try
        {
            encomenda.Anular();
        }
        catch (InvalidOperationException ex)
        {
            return Result<EncomendaAdminViewModel>.Falha(ex.Message, ErrorType.Conflito);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    public async Task<Result<EncomendaAdminViewModel>> ReabrirAsync(string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        var produtosPorId = await ObterProdutosDosItensAsync(encomenda);

        // Guarda defensiva antes de mexer em qualquer coisa: pode ter sido
        // vendido o resto do stock noutro sítio enquanto esta encomenda
        // esteve anulada — sem reabertura parcial, mesmo espírito de
        // StockService.RegistarSaidaAsync.
        foreach (var item in encomenda.Itens)
        {
            var produto = produtosPorId[item.ProdutoId];
            if (!produto.TemStockPara(item.Quantidade))
                return Result<EncomendaAdminViewModel>.Falha(
                    $"Só há {produto.Stock} de {produto.Nome} em stock — não é possível reabrir.", ErrorType.Conflito);
        }

        foreach (var item in encomenda.Itens)
        {
            produtosPorId[item.ProdutoId].DebitarStock(item.Quantidade);
        }

        encomenda.Reabrir();
        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    public async Task<Result<EncomendaAdminViewModel>> ApagarAsync(string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaAsync(referencia);
        if (encomenda is null)
            return Result<EncomendaAdminViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        if (encomenda.Estado != EstadoEncomenda.Anulada)
            return Result<EncomendaAdminViewModel>.Falha("Só é possível apagar uma encomenda já anulada.", ErrorType.Validacao);

        encomenda.Apagar();
        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaAdminViewModel>.Ok(EncomendaAdminViewModel.FromEntity(encomenda));
    }

    private async Task<Dictionary<int, Produto>> ObterProdutosDosItensAsync(Encomenda encomenda)
    {
        var ids = encomenda.Itens.Select(i => i.ProdutoId).Distinct().ToList();
        var produtos = await _produtoRepository.ObterPorIdsAsync(ids);

        return produtos.ToDictionary(p => p.Id);
    }
}
