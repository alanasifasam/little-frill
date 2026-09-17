using Application.Constants;
using Application.Mapping;
using Application.Models.Encomendas;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Envio;

namespace Application.Services;

public class EncomendaService : IEncomendaService
{
    private readonly IProdutoRepository _produtoRepository;
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IUtilizadorRepository _utilizadorRepository;
    private readonly IMetodoPagamentoConfigRepository _metodoPagamentoConfigRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEnvioPolicy _envioPolicy;

    public EncomendaService(
        IProdutoRepository produtoRepository,
        IEncomendaRepository encomendaRepository,
        IUtilizadorRepository utilizadorRepository,
        IMetodoPagamentoConfigRepository metodoPagamentoConfigRepository,
        IUnitOfWork unitOfWork,
        IEnvioPolicy envioPolicy)
    {
        _produtoRepository = produtoRepository;
        _encomendaRepository = encomendaRepository;
        _utilizadorRepository = utilizadorRepository;
        _metodoPagamentoConfigRepository = metodoPagamentoConfigRepository;
        _unitOfWork = unitOfWork;
        _envioPolicy = envioPolicy;
    }

    public async Task<Result<EncomendaConfirmadaViewModel>> CriarAsync(int utilizadorId, EncomendaInputModel input)
    {
        var utilizador = await _utilizadorRepository.ObterPorIdAsync(utilizadorId);
        if (utilizador is null)
            return Result<EncomendaConfirmadaViewModel>.Falha("Utilizador não encontrado.", ErrorType.NaoAutorizado);

        if (input.Itens is null || input.Itens.Count == 0)
            return Result<EncomendaConfirmadaViewModel>.Falha("A encomenda tem de ter pelo menos um item.", ErrorType.Validacao);

        if (input.Itens.Any(i => i.Id <= 0 || i.Qty <= 0))
            return Result<EncomendaConfirmadaViewModel>.Falha("Item de encomenda inválido.", ErrorType.Validacao);

        var metodoEnvio = MetodoEnvioMapper.ParseChave(input.MetodoEnvio);
        if (metodoEnvio is null)
            return Result<EncomendaConfirmadaViewModel>.Falha("Método de envio inválido.", ErrorType.Validacao);

        var metodoPagamento = MetodoPagamentoMapper.ParseChave(input.MetodoPagamento);
        if (metodoPagamento is null)
            return Result<EncomendaConfirmadaViewModel>.Falha("Método de pagamento inválido.", ErrorType.Validacao);

        var configMetodo = await _metodoPagamentoConfigRepository.ObterPorMetodoAsync(metodoPagamento.Value);
        if (configMetodo is null || !configMetodo.Ativo)
            return Result<EncomendaConfirmadaViewModel>.Falha("Este método de pagamento não está disponível.", ErrorType.Validacao);

        if (!Distritos.Validos.Contains(input.Entrega.Distrito))
            return Result<EncomendaConfirmadaViewModel>.Falha("Distrito inválido.", ErrorType.Validacao);

        Endereco entrega;
        try
        {
            entrega = new Endereco(
                input.Entrega.Nome,
                input.Entrega.Email,
                input.Entrega.Telefone,
                input.Entrega.Morada,
                input.Entrega.CodigoPostal,
                input.Entrega.Localidade,
                input.Entrega.Distrito,
                input.Entrega.AndarPorta,
                input.Entrega.Notas);
        }
        catch (ArgumentException ex)
        {
            return Result<EncomendaConfirmadaViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        var idsPedidos = input.Itens.Select(i => i.Id).ToList();
        var produtos = await _produtoRepository.ObterPorIdsAsync(idsPedidos);
        var produtosPorId = produtos.ToDictionary(p => p.Id);

        var idFaltante = idsPedidos.FirstOrDefault(id => !produtosPorId.ContainsKey(id));
        if (idFaltante != default)
            return Result<EncomendaConfirmadaViewModel>.Falha($"Produto {idFaltante} não encontrado.", ErrorType.NaoEncontrado);

        foreach (var item in input.Itens)
        {
            var produto = produtosPorId[item.Id];
            if (!produto.TemStockPara(item.Qty))
                return Result<EncomendaConfirmadaViewModel>.Falha($"Stock insuficiente para '{produto.Nome}'.", ErrorType.Conflito);
        }

        foreach (var item in input.Itens)
        {
            produtosPorId[item.Id].DebitarStock(item.Qty);
        }

        var itensEncomenda = input.Itens
            .Select(item =>
            {
                var produto = produtosPorId[item.Id];
                return new EncomendaItem(produto.Id, produto.Nome, produto.Preco, item.Qty);
            })
            .ToList();

        var subtotal = itensEncomenda.Sum(i => i.Subtotal);

        var custoEnvio = await CalcularCustoEnvioAsync(metodoEnvio.Value, subtotal);

        var referencia = await _encomendaRepository.ProximaReferenciaAsync();

        var encomenda = new Encomenda(
            utilizadorId,
            referencia,
            itensEncomenda,
            entrega,
            metodoEnvio.Value,
            metodoPagamento.Value,
            subtotal,
            custoEnvio,
            subtotal + custoEnvio,
            input.Nif);

        await _encomendaRepository.AdicionarAsync(encomenda);
        await _unitOfWork.SaveChangesAsync();

        return Result<EncomendaConfirmadaViewModel>.Ok(EncomendaConfirmadaViewModel.FromEntity(encomenda));
    }

    public async Task<Result<IReadOnlyList<EncomendaResumoViewModel>>> ListarPorUtilizadorAsync(int utilizadorId)
    {
        var encomendas = await _encomendaRepository.ListarPorUtilizadorIdAsync(utilizadorId);

        var resumos = encomendas
            .Select(EncomendaResumoViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<EncomendaResumoViewModel>>.Ok(resumos);
    }

    public async Task<Result<EncomendaDetalheViewModel>> ObterDetalheAsync(int utilizadorId, string referencia)
    {
        var encomenda = await _encomendaRepository.ObterPorReferenciaEUtilizadorAsync(referencia, utilizadorId);
        if (encomenda is null)
            return Result<EncomendaDetalheViewModel>.Falha("Encomenda não encontrada.", ErrorType.NaoEncontrado);

        var produtosPorId = await ObterProdutosDosItensAsync(encomenda);

        return Result<EncomendaDetalheViewModel>.Ok(EncomendaDetalheViewModel.FromEntity(encomenda, produtosPorId));
    }

    private async Task<Dictionary<int, Produto>> ObterProdutosDosItensAsync(Encomenda encomenda)
    {
        var ids = encomenda.Itens.Select(i => i.ProdutoId).Distinct().ToList();
        var produtos = await _produtoRepository.ObterPorIdsAsync(ids);

        return produtos.ToDictionary(p => p.Id);
    }

    private async Task<decimal> CalcularCustoEnvioAsync(MetodoEnvio metodoEnvio, decimal subtotal)
    {
        if (metodoEnvio == MetodoEnvio.Atelie)
            return 0m;

        var limiarGratis = await _envioPolicy.ObterLimiarGratisAsync();
        return subtotal >= limiarGratis ? 0m : _envioPolicy.CustoPadrao;
    }
}
