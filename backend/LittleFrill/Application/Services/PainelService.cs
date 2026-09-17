using System.Globalization;
using Application.Mapping;
using Application.Models.Painel;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço do dashboard "O mês em curso" do Painel admin: só lê (nenhum
// método muta nada), reaproveitando os mesmos repositórios já usados por
// StockService/EncomendaAdminService/ProdutoAdminService — ver esses
// serviços para o padrão de leitura e mapeamento seguido aqui.
public class PainelService : IPainelService
{
    private const int LimiteMovimentosRecentes = 60;
    private const int TotalDiasNasBarras = 10;
    private const int LimiteMovimentosPainel = 9;
    private const decimal ProporcaoVariavelPadrao = 0.35m;

    private readonly IProdutoRepository _produtoRepository;
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IMovimentoStockRepository _movimentoStockRepository;
    private readonly IConfiguracaoNegocioRepository _configuracaoNegocioRepository;
    private readonly ICustoFixoRepository _custoFixoRepository;
    private readonly ICustoVariavelRepository _custoVariavelRepository;

    public PainelService(
        IProdutoRepository produtoRepository,
        IEncomendaRepository encomendaRepository,
        IMovimentoStockRepository movimentoStockRepository,
        IConfiguracaoNegocioRepository configuracaoNegocioRepository,
        ICustoFixoRepository custoFixoRepository,
        ICustoVariavelRepository custoVariavelRepository)
    {
        _produtoRepository = produtoRepository;
        _encomendaRepository = encomendaRepository;
        _movimentoStockRepository = movimentoStockRepository;
        _configuracaoNegocioRepository = configuracaoNegocioRepository;
        _custoFixoRepository = custoFixoRepository;
        _custoVariavelRepository = custoVariavelRepository;
    }

    public async Task<Result<PainelViewModel>> ObterAsync()
    {
        var config = await _configuracaoNegocioRepository.ObterAsync();

        var produtos = await _produtoRepository.ListarParaAdminAsync();
        var produtosPorId = produtos.ToDictionary(p => p.Id);

        var encomendas = await _encomendaRepository.ListarParaAdminAsync();
        var encomendasVivas = encomendas.Where(e => e.Estado != EstadoEncomenda.Anulada).ToList();

        var (inicioMes, fimMes) = LimitesDoMesCorrente();
        var encomendasDoMes = encomendasVivas
            .Where(e => e.Criada >= inicioMes && e.Criada < fimMes)
            .ToList();

        var custosFixosAtivos = await _custoFixoRepository.ListarAsync();
        var fixosTotal = custosFixosAtivos.Where(c => c.Ativo).Sum(c => c.Valor);

        var custosVariaveisDoMes = await _custoVariavelRepository.ListarEntreDatasAsync(inicioMes, fimMes);
        var custoVariavelTotal = custosVariaveisDoMes.Sum(c => c.Valor);

        var metricas = CalcularMetricas(config, encomendasDoMes, produtosPorId, fixosTotal, custoVariavelTotal);
        var barras = CalcularBarras(encomendasVivas);
        var alertas = await CalcularAlertasAsync(produtos, inicioMes, fimMes);
        var movimentos = await CalcularMovimentosAsync(encomendasDoMes, produtosPorId);
        var stockTotal = produtos.Sum(p => Math.Max(0, p.Stock));

        var viewModel = new PainelViewModel
        {
            Metricas = metricas,
            Barras = barras,
            Alertas = alertas,
            Movimentos = movimentos,
            StockTotal = stockTotal,
            FeriasLigadas = config.FeriasLigadas
        };

        return Result<PainelViewModel>.Ok(viewModel);
    }

    private static MetricasPainelViewModel CalcularMetricas(
        ConfiguracaoNegocio config,
        List<Encomenda> encomendasDoMes,
        Dictionary<int, Produto> produtosPorId,
        decimal fixosTotal,
        decimal custoVariavelTotal)
    {
        var agora = DateTime.UtcNow;
        var dia = agora.Day;
        var diasNoMes = DateTime.DaysInMonth(agora.Year, agora.Month);

        var itensDoMes = encomendasDoMes.SelectMany(e => e.Itens).ToList();

        var vendasPecas = itensDoMes.Sum(i => i.PrecoUnitario * i.Quantidade);
        var enviosCtt = encomendasDoMes.Count(e => e.MetodoEnvio == MetodoEnvio.Ctt);
        var enviosCobrados = encomendasDoMes
            .Where(e => e.MetodoEnvio == MetodoEnvio.Ctt)
            .Sum(e => e.Envio);
        var custoEnvios = enviosCtt * config.EnvioRealCtt;
        var custoMateriais = itensDoMes.Sum(i => i.Quantidade * ObterCustoProduto(produtosPorId, i.ProdutoId));
        var receita = vendasPecas + enviosCobrados;
        var lucro = receita - custoMateriais - custoEnvios - fixosTotal - custoVariavelTotal;
        var margem = receita > 0 ? lucro / receita : 0m;

        var ritmoNecessario = config.MetaMes * dia / diasNoMes;
        var projVendas = dia > 0 ? receita * diasNoMes / dia : receita;
        var fatorProjecao = dia > 0 ? (decimal)diasNoMes / dia : 1m;
        var projLucro = projVendas - (custoMateriais + custoEnvios) * fatorProjecao - fixosTotal;

        // Proporção de custos variáveis sobre a receita do mês; sem vendas
        // ainda, usa uma estimativa razoável (35%) em vez de indeterminar o
        // ponto de equilíbrio.
        var proporcaoVariavel = receita > 0
            ? (custoMateriais + custoEnvios + custoVariavelTotal) / receita
            : ProporcaoVariavelPadrao;
        // Guarda contra divisão por zero se a proporção variável atingir
        // 100% da receita: nesse caso não há margem nenhuma para cobrir
        // fixos, então o ponto de equilíbrio fica só nos custos fixos.
        var pontoEquilibrio = proporcaoVariavel < 1m ? fixosTotal / (1m - proporcaoVariavel) : fixosTotal;

        var nEncomendas = encomendasDoMes.Count;
        var talaoMedio = nEncomendas > 0 ? receita / nEncomendas : 0m;

        var hoje = agora.Date;
        var encomendasDeHoje = encomendasDoMes.Where(e => e.Criada.Date == hoje).ToList();
        var caixaHoje = encomendasDeHoje.Sum(e => e.Total);
        var encomendasHoje = encomendasDeHoje.Count;

        return new MetricasPainelViewModel
        {
            Dia = dia,
            DiasNoMes = diasNoMes,
            MesNome = ObterNomeDoMes(agora),
            VendasPecas = vendasPecas,
            EnviosCtt = enviosCtt,
            EnviosCobrados = enviosCobrados,
            CustoEnvios = custoEnvios,
            CustoMateriais = custoMateriais,
            FixosTotal = fixosTotal,
            CustoVariavelTotal = custoVariavelTotal,
            Receita = receita,
            Lucro = lucro,
            Margem = margem,
            RitmoNecessario = ritmoNecessario,
            ProjVendas = projVendas,
            ProjLucro = projLucro,
            PontoEquilibrio = pontoEquilibrio,
            TalaoMedio = talaoMedio,
            NEncomendas = nEncomendas,
            CaixaHoje = caixaHoje,
            EncomendasHoje = encomendasHoje,
            MetaMes = config.MetaMes
        };
    }

    // Últimos 10 dias corridos (pode atravessar o limite do mês), dia mais
    // antigo primeiro — por isso soma sobre TODAS as encomendas vivas, não
    // só as do mês corrente.
    private static List<BarraDiaViewModel> CalcularBarras(List<Encomenda> encomendasVivas)
    {
        var hoje = DateTime.UtcNow.Date;
        var barras = new List<BarraDiaViewModel>();

        for (var i = TotalDiasNasBarras - 1; i >= 0; i--)
        {
            var data = hoje.AddDays(-i);
            var total = encomendasVivas
                .Where(e => e.Criada.Date == data)
                .Sum(e => e.Total);

            barras.Add(new BarraDiaViewModel { Dia = data.Day, Total = total });
        }

        return barras;
    }

    private async Task<List<AlertaStockViewModel>> CalcularAlertasAsync(
        IReadOnlyList<Produto> produtos,
        DateTime inicioMes,
        DateTime fimMes)
    {
        var vendidasPorProduto = await _encomendaRepository.ObterQuantidadesVendidasPorProdutoNoMesAsync(inicioMes, fimMes);

        return produtos
            .Where(p => p.Ativo && p.Stock <= 3)
            .Select(p =>
            {
                var capa = p.Imagens.OrderBy(i => i.Ordem).FirstOrDefault();
                return new AlertaStockViewModel
                {
                    ProdutoId = p.Id,
                    Nome = p.Nome,
                    Padrao = PadraoMapper.ToChave(p.Padrao),
                    Cor = CorMapper.ToChave(p.Cor),
                    StockAtual = p.Stock,
                    Vendidas = vendidasPorProduto.GetValueOrDefault(p.Id),
                    Esgotada = p.Stock <= 0,
                    ImagemUrl = capa?.Url,
                    ImagemFocoX = capa?.FocoX ?? 50m,
                    ImagemFocoY = capa?.FocoY ?? 50m
                };
            })
            .ToList();
    }

    private async Task<List<MovimentoPainelViewModel>> CalcularMovimentosAsync(
        List<Encomenda> encomendasDoMes,
        Dictionary<int, Produto> produtosPorId)
    {
        var vendas = encomendasDoMes.Select(e => new MovimentoPainelViewModel
        {
            Tipo = "venda",
            Dia = e.Criada.Day,
            Peca = string.Join(" + ", e.Itens.Select(i => i.NomeProduto)),
            Qty = e.Itens.Sum(i => i.Quantidade),
            Valor = e.Total,
            Motivo = null
        });

        var movimentosStock = await _movimentoStockRepository.ListarRecentesAsync(LimiteMovimentosRecentes);
        var entradasESaidas = movimentosStock.Select(m => new MovimentoPainelViewModel
        {
            Tipo = TipoMovimentoStockMapper.ToChave(m.Tipo),
            Dia = m.Data.Day,
            Peca = produtosPorId.TryGetValue(m.ProdutoId, out var produto) ? produto.Nome : "—",
            Qty = m.Quantidade,
            Valor = -ObterCustoProduto(produtosPorId, m.ProdutoId) * m.Quantidade,
            Motivo = m.Tipo == TipoMovimentoStock.Saida && m.Motivo is not null
                ? MotivoSaidaStockMapper.ToChave(m.Motivo.Value)
                : null
        });

        return vendas
            .Concat(entradasESaidas)
            .OrderByDescending(m => m.Dia)
            .Take(LimiteMovimentosPainel)
            .ToList();
    }

    private static decimal ObterCustoProduto(Dictionary<int, Produto> produtosPorId, int produtoId)
    {
        return produtosPorId.TryGetValue(produtoId, out var produto) ? produto.Custo : 0m;
    }

    private static string ObterNomeDoMes(DateTime data)
    {
        var cultura = new CultureInfo("pt-PT");
        var nome = data.ToString("MMMM", cultura);

        return char.ToUpper(nome[0], cultura) + nome[1..];
    }

    private static (DateTime Inicio, DateTime Fim) LimitesDoMesCorrente()
    {
        var agora = DateTime.UtcNow;
        var inicio = new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = inicio.AddMonths(1);
        return (inicio, fim);
    }
}
