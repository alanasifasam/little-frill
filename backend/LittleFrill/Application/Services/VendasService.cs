using System.Globalization;
using Application.Mapping;
using Application.Models.Vendas;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço da página "Vendas e caixa" do admin: mesmo espírito do
// PainelService (só leitura, sempre "mês em curso", sem parâmetros) — ver
// esse serviço para o padrão seguido aqui. Não precisa de
// IConfiguracaoNegocioRepository: nenhum campo desta página depende de
// MetaMes/EnvioRealCtt/CustosFixosMensais/FeriasLigadas.
public class VendasService : IVendasService
{
    private const int LimiteRanking = 5;

    private readonly IProdutoRepository _produtoRepository;
    private readonly IEncomendaRepository _encomendaRepository;

    public VendasService(IProdutoRepository produtoRepository, IEncomendaRepository encomendaRepository)
    {
        _produtoRepository = produtoRepository;
        _encomendaRepository = encomendaRepository;
    }

    public async Task<Result<VendasViewModel>> ObterAsync()
    {
        var produtos = await _produtoRepository.ListarParaAdminAsync();
        var produtosPorId = produtos.ToDictionary(p => p.Id);

        var encomendas = await _encomendaRepository.ListarParaAdminAsync();
        var (inicioMes, fimMes) = LimitesDoMesCorrente();
        var encomendasDoMes = encomendas
            .Where(e => e.Estado != EstadoEncomenda.Anulada && e.Criada >= inicioMes && e.Criada < fimMes)
            .ToList();

        var receita = encomendasDoMes.Sum(e => e.Total);
        var nEncomendas = encomendasDoMes.Count;
        var nPecas = encomendasDoMes.SelectMany(e => e.Itens).Sum(i => i.Quantidade);
        var talaoMedio = nEncomendas > 0 ? receita / nEncomendas : 0m;

        var caixaDias = CalcularCaixaDias(encomendasDoMes);
        var melhorDia = caixaDias
            .OrderByDescending(d => d.Total)
            .Select(d => new MelhorDiaViewModel { Dia = d.Dia, Total = d.Total })
            .FirstOrDefault();

        var ranking = await CalcularRankingAsync(produtosPorId, inicioMes, fimMes);

        var viewModel = new VendasViewModel
        {
            MesNome = ObterNomeDoMes(DateTime.UtcNow),
            Receita = receita,
            NEncomendas = nEncomendas,
            NPecas = nPecas,
            NDiasComVendas = caixaDias.Count,
            TalaoMedio = talaoMedio,
            MelhorDia = melhorDia,
            CaixaDias = caixaDias,
            Ranking = ranking
        };

        return Result<VendasViewModel>.Ok(viewModel);
    }

    private static List<CaixaDiaViewModel> CalcularCaixaDias(List<Encomenda> encomendasDoMes)
    {
        var dias = encomendasDoMes
            .GroupBy(e => e.Criada.Day)
            .OrderBy(g => g.Key)
            .Select(g => new CaixaDiaViewModel
            {
                Dia = g.Key,
                Refs = g.Select(e => e.Referencia).ToList(),
                Pecas = g.SelectMany(e => e.Itens).Sum(i => i.Quantidade),
                Total = g.Sum(e => e.Total)
            })
            .ToList();

        // Normaliza a barra visual de cada dia pelo maior valor diário do
        // mês — 1 como piso evita dividir por zero quando ainda não há
        // nenhum dia com vendas.
        var maxDiaTotal = dias.Count > 0 ? dias.Max(d => d.Total) : 1m;
        if (maxDiaTotal <= 0) maxDiaTotal = 1m;

        foreach (var dia in dias)
        {
            dia.BarraPct = (int)Math.Round(dia.Total / maxDiaTotal * 100, MidpointRounding.AwayFromZero);
        }

        return dias;
    }

    private async Task<List<RankingLinhaViewModel>> CalcularRankingAsync(
        Dictionary<int, Produto> produtosPorId,
        DateTime inicioMes,
        DateTime fimMes)
    {
        var vendidasPorProduto = await _encomendaRepository.ObterQuantidadesVendidasPorProdutoNoMesAsync(inicioMes, fimMes);

        var ranking = vendidasPorProduto
            .Where(kv => kv.Value > 0)
            .OrderByDescending(kv => kv.Value)
            .Take(LimiteRanking)
            .Select(kv =>
            {
                produtosPorId.TryGetValue(kv.Key, out var produto);
                var capa = produto?.Imagens.OrderBy(i => i.Ordem).FirstOrDefault();
                return new RankingLinhaViewModel
                {
                    ProdutoId = kv.Key,
                    Nome = produto?.Nome ?? "—",
                    Padrao = produto is not null ? PadraoMapper.ToChave(produto.Padrao) : string.Empty,
                    Cor = produto is not null ? CorMapper.ToChave(produto.Cor) : string.Empty,
                    Qty = kv.Value,
                    ImagemUrl = capa?.Url,
                    ImagemFocoX = capa?.FocoX ?? 50m,
                    ImagemFocoY = capa?.FocoY ?? 50m
                };
            })
            .ToList();

        var maxRankQty = ranking.Count > 0 ? ranking.Max(r => r.Qty) : 1;
        if (maxRankQty <= 0) maxRankQty = 1;

        foreach (var linha in ranking)
        {
            linha.BarraPct = (int)Math.Round(linha.Qty / (double)maxRankQty * 100, MidpointRounding.AwayFromZero);
        }

        return ranking;
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
