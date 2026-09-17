using System.Globalization;
using Application.Models.CustoFixo;
using Application.Models.CustoVariavel;
using Application.Models.Financeiro;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço da página "Custos e lucro" do admin: mesmas contas do mês em curso
// que PainelService.CalcularMetricas — este serviço duplica-as de propósito
// (mesmo espírito de VendasService, ver esse ficheiro) em vez de as
// partilhar por uma base comum. Acrescenta só o que é próprio desta página:
// a lista de custos fixos geríveis (Fixos) e o histórico de receita dos
// últimos 6 meses (Historico).
public class FinanceiroService : IFinanceiroService
{
    private const int MesesDeHistorico = 6;
    private const decimal ProporcaoVariavelPadrao = 0.35m;

    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IProdutoRepository _produtoRepository;
    private readonly IConfiguracaoNegocioRepository _configuracaoNegocioRepository;
    private readonly ICustoFixoRepository _custoFixoRepository;
    private readonly ICustoVariavelRepository _custoVariavelRepository;

    public FinanceiroService(
        IEncomendaRepository encomendaRepository,
        IProdutoRepository produtoRepository,
        IConfiguracaoNegocioRepository configuracaoNegocioRepository,
        ICustoFixoRepository custoFixoRepository,
        ICustoVariavelRepository custoVariavelRepository)
    {
        _encomendaRepository = encomendaRepository;
        _produtoRepository = produtoRepository;
        _configuracaoNegocioRepository = configuracaoNegocioRepository;
        _custoFixoRepository = custoFixoRepository;
        _custoVariavelRepository = custoVariavelRepository;
    }

    public async Task<Result<FinanceiroViewModel>> ObterAsync()
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

        var custosFixos = await _custoFixoRepository.ListarAsync();
        var fixosTotal = custosFixos.Where(c => c.Ativo).Sum(c => c.Valor);

        var custosVariaveisDoMes = await _custoVariavelRepository.ListarEntreDatasAsync(inicioMes, fimMes);
        var custoVariavelTotal = custosVariaveisDoMes.Sum(c => c.Valor);

        var viewModel = CalcularMetricas(config, encomendasDoMes, produtosPorId, fixosTotal, custoVariavelTotal);
        viewModel.Fixos = custosFixos.Select(CustoFixoViewModel.FromEntity).ToList();
        viewModel.CustosVariaveisDoMes = custosVariaveisDoMes.Select(CustoVariavelViewModel.FromEntity).ToList();
        viewModel.Historico = await CalcularHistoricoAsync(inicioMes, fimMes, viewModel.Receita);

        return Result<FinanceiroViewModel>.Ok(viewModel);
    }

    private static FinanceiroViewModel CalcularMetricas(
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

        // Mesma nota de PainelService.CalcularMetricas sobre a estimativa de
        // 35% quando ainda não há receita e sobre o guarda de divisão por
        // zero quando a proporção variável atinge 100% da receita.
        var proporcaoVariavel = receita > 0
            ? (custoMateriais + custoEnvios + custoVariavelTotal) / receita
            : ProporcaoVariavelPadrao;
        var pontoEquilibrio = proporcaoVariavel < 1m ? fixosTotal / (1m - proporcaoVariavel) : fixosTotal;

        var nEncomendas = encomendasDoMes.Count;
        var talaoMedio = nEncomendas > 0 ? receita / nEncomendas : 0m;

        var hoje = agora.Date;
        var encomendasDeHoje = encomendasDoMes.Where(e => e.Criada.Date == hoje).ToList();
        var caixaHoje = encomendasDeHoje.Sum(e => e.Total);
        var encomendasHoje = encomendasDeHoje.Count;

        return new FinanceiroViewModel
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

    // Últimos 6 meses (5 anteriores + o mês em curso), mais antigo primeiro.
    // Uma só query para os 5 meses anteriores — o mês em curso reaproveita a
    // Receita já calculada acima, para os dois lados da página (conta do mês
    // e barra "atual" do histórico) nunca poderem divergir.
    private async Task<List<HistoricoMesViewModel>> CalcularHistoricoAsync(
        DateTime inicioMesAtual,
        DateTime fimMesAtual,
        decimal receitaMesAtual)
    {
        var inicioJanela = inicioMesAtual.AddMonths(-(MesesDeHistorico - 1));

        // Uma só chamada ao repositório cobre a janela toda (5 meses
        // anteriores + mês em curso) — o grupo do mês em curso devolvido
        // aqui é descartado a seguir a favor de receitaMesAtual, mas isso
        // evita uma segunda query só para os 5 meses anteriores.
        var encomendasJanela = await _encomendaRepository.ListarEntreDatasAsync(inicioJanela, fimMesAtual);
        var encomendasVivasJanela = encomendasJanela.Where(e => e.Estado != EstadoEncomenda.Anulada).ToList();

        var receitaPorMes = encomendasVivasJanela
            .GroupBy(e => new { e.Criada.Year, e.Criada.Month })
            .ToDictionary(g => (g.Key.Year, g.Key.Month), g => g.Sum(e => e.Total));

        var historico = new List<HistoricoMesViewModel>();
        for (var i = MesesDeHistorico - 1; i >= 1; i--)
        {
            var mes = inicioMesAtual.AddMonths(-i);
            var valor = receitaPorMes.GetValueOrDefault((mes.Year, mes.Month), 0m);

            historico.Add(new HistoricoMesViewModel
            {
                Mes = ObterAbreviaturaMes(mes),
                Valor = valor,
                Atual = false
            });
        }

        historico.Add(new HistoricoMesViewModel
        {
            Mes = ObterAbreviaturaMes(inicioMesAtual),
            Valor = receitaMesAtual,
            Atual = true
        });

        return historico;
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

    private static string ObterAbreviaturaMes(DateTime data)
    {
        var cultura = new CultureInfo("pt-PT");
        var nome = data.ToString("MMMM", cultura);
        var abreviatura = nome.Length >= 3 ? nome[..3] : nome;

        return char.ToUpper(abreviatura[0], cultura) + abreviatura[1..];
    }

    private static (DateTime Inicio, DateTime Fim) LimitesDoMesCorrente()
    {
        var agora = DateTime.UtcNow;
        var inicio = new DateTime(agora.Year, agora.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var fim = inicio.AddMonths(1);
        return (inicio, fim);
    }
}
