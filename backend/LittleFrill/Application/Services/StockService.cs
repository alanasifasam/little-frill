using Application.Mapping;
using Application.Models.Stock;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço próprio da página admin de Stock: entrada/saída mexem em
// Produto.Stock e ficam registadas em MovimentoStock (auditoria/histórico
// do mês); venda ao balcão mexe no mesmo contador mas gera uma Encomenda a
// sério (regra 1 do AdminEspec), não um MovimentoStock — ver IStockService.
public class StockService : IStockService
{
    private readonly IProdutoRepository _produtoRepository;
    private readonly IMovimentoStockRepository _movimentoStockRepository;
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StockService(
        IProdutoRepository produtoRepository,
        IMovimentoStockRepository movimentoStockRepository,
        IEncomendaRepository encomendaRepository,
        IUnitOfWork unitOfWork)
    {
        _produtoRepository = produtoRepository;
        _movimentoStockRepository = movimentoStockRepository;
        _encomendaRepository = encomendaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<StockAdminViewModel>> ObterAsync()
    {
        var (inicio, fim) = LimitesDoMesCorrente();

        var produtos = await _produtoRepository.ListarParaAdminAsync();
        var entradasPorProduto = await _movimentoStockRepository.SomarQuantidadesPorProdutoNoMesAsync(TipoMovimentoStock.Entrada, inicio, fim);
        var saidasPorProduto = await _movimentoStockRepository.SomarQuantidadesPorProdutoNoMesAsync(TipoMovimentoStock.Saida, inicio, fim);
        var vendidasPorProduto = await _encomendaRepository.ObterQuantidadesVendidasPorProdutoNoMesAsync(inicio, fim);
        var movimentos = await _movimentoStockRepository.ListarDoMesAsync(inicio, fim);

        var produtosPorId = produtos.ToDictionary(p => p.Id);

        var inventario = produtos
            .Select(p => new InventarioLinhaViewModel
            {
                ProdutoId = p.Id,
                Nome = p.Nome,
                Tecido = p.Tecido,
                Custo = p.Custo,
                Preco = p.Preco,
                Entradas = entradasPorProduto.GetValueOrDefault(p.Id),
                Saidas = saidasPorProduto.GetValueOrDefault(p.Id),
                Vendidas = vendidasPorProduto.GetValueOrDefault(p.Id),
                Stock = p.Stock
            })
            .ToList();

        var movimentosViewModel = movimentos
            .Select(m => MovimentoStockViewModel.FromEntity(
                m,
                produtosPorId.TryGetValue(m.ProdutoId, out var produto) ? produto.Nome : "—"))
            .ToList();

        var valorStock = produtos.Sum(p => Math.Max(0, p.Stock) * p.Custo);

        var viewModel = new StockAdminViewModel
        {
            Inventario = inventario,
            Movimentos = movimentosViewModel,
            ValorStock = valorStock
        };

        return Result<StockAdminViewModel>.Ok(viewModel);
    }

    public async Task<Result<MovimentoStockViewModel>> RegistarEntradaAsync(EntradaStockInputModel input)
    {
        if (input.Quantidade <= 0)
            return Result<MovimentoStockViewModel>.Falha("Quantidade tem de ser superior a zero.", ErrorType.Validacao);

        var produto = await _produtoRepository.ObterParaEdicaoAsync(input.ProdutoId);
        if (produto is null)
            return Result<MovimentoStockViewModel>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        produto.AdicionarStock(input.Quantidade);
        var movimento = new MovimentoStock(produto.Id, TipoMovimentoStock.Entrada, input.Quantidade, null);

        await _movimentoStockRepository.AdicionarAsync(movimento);
        await _unitOfWork.SaveChangesAsync();

        return Result<MovimentoStockViewModel>.Ok(MovimentoStockViewModel.FromEntity(movimento, produto.Nome));
    }

    public async Task<Result<MovimentoStockViewModel>> RegistarSaidaAsync(SaidaStockInputModel input)
    {
        if (input.Quantidade <= 0)
            return Result<MovimentoStockViewModel>.Falha("Quantidade tem de ser superior a zero.", ErrorType.Validacao);

        var motivo = MotivoSaidaStockMapper.ParseChave(input.Motivo);
        if (motivo is null)
            return Result<MovimentoStockViewModel>.Falha("Motivo de saída inválido.", ErrorType.Validacao);

        var produto = await _produtoRepository.ObterParaEdicaoAsync(input.ProdutoId);
        if (produto is null)
            return Result<MovimentoStockViewModel>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        if (!produto.TemStockPara(input.Quantidade))
            return Result<MovimentoStockViewModel>.Falha(
                $"Só há {produto.Stock} de {produto.Nome} — a fornada tem de entrar primeiro.", ErrorType.Conflito);

        produto.DebitarStock(input.Quantidade);
        var movimento = new MovimentoStock(produto.Id, TipoMovimentoStock.Saida, input.Quantidade, motivo.Value);

        await _movimentoStockRepository.AdicionarAsync(movimento);
        await _unitOfWork.SaveChangesAsync();

        return Result<MovimentoStockViewModel>.Ok(MovimentoStockViewModel.FromEntity(movimento, produto.Nome));
    }

    public async Task<Result<string>> RegistarVendaAsync(VendaBalcaoInputModel input)
    {
        if (input.Quantidade <= 0)
            return Result<string>.Falha("Quantidade tem de ser superior a zero.", ErrorType.Validacao);

        var produto = await _produtoRepository.ObterParaEdicaoAsync(input.ProdutoId);
        if (produto is null)
            return Result<string>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        if (!produto.TemStockPara(input.Quantidade))
            return Result<string>.Falha(
                $"Só há {produto.Stock} de {produto.Nome} — a fornada tem de entrar primeiro.", ErrorType.Conflito);

        produto.DebitarStock(input.Quantidade);

        var item = new EncomendaItem(produto.Id, produto.Nome, produto.Preco, input.Quantidade);
        var subtotal = item.Subtotal;

        var referencia = await _encomendaRepository.ProximaReferenciaAsync();
        var encomenda = Encomenda.CriarBalcao(referencia, new List<EncomendaItem> { item }, subtotal, MetodoPagamento.Dinheiro);

        await _encomendaRepository.AdicionarAsync(encomenda);
        await _unitOfWork.SaveChangesAsync();

        return Result<string>.Ok(referencia);
    }

    private static (DateTime Inicio, DateTime Fim) LimitesDoMesCorrente()
    {
        var agora = DateTime.UtcNow;
        var inicio = new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = inicio.AddMonths(1);
        return (inicio, fim);
    }
}
