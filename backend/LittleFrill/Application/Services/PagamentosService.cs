using Application.Mapping;
using Application.Models.Pagamentos;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

// Serviço da página "Pagamentos" do admin: mesmo espírito do
// PainelService/VendasService (só leitura, agregação em memória sobre
// IEncomendaRepository.ListarParaAdminAsync()) — ver esses serviços para o
// padrão seguido aqui. Reaproveita IMetodoPagamentoConfigRepository (Parte A)
// para as 4 linhas de configuração de método de pagamento.
public class PagamentosService : IPagamentosService
{
    private readonly IMetodoPagamentoConfigRepository _metodoPagamentoConfigRepository;
    private readonly IEncomendaRepository _encomendaRepository;

    public PagamentosService(
        IMetodoPagamentoConfigRepository metodoPagamentoConfigRepository,
        IEncomendaRepository encomendaRepository)
    {
        _metodoPagamentoConfigRepository = metodoPagamentoConfigRepository;
        _encomendaRepository = encomendaRepository;
    }

    public async Task<Result<PagamentosViewModel>> ObterAsync()
    {
        var configs = await _metodoPagamentoConfigRepository.ListarAsync();
        var encomendas = await _encomendaRepository.ListarParaAdminAsync();
        var vivas = encomendas.Where(e => e.Estado != EstadoEncomenda.Anulada).ToList();

        var metodos = CalcularMetodos(configs, vivas);
        var transacoes = CalcularTransacoes(encomendas);

        var porPagarEncomendas = vivas.Where(e => !e.Pago).ToList();
        var porPagar = porPagarEncomendas.Sum(e => e.Total);
        var nPorPagar = porPagarEncomendas.Count;

        var viewModel = new PagamentosViewModel
        {
            Metodos = metodos,
            Transacoes = transacoes,
            PorPagar = porPagar,
            NPorPagar = nPorPagar
        };

        return Result<PagamentosViewModel>.Ok(viewModel);
    }

    private static List<MetodoLinhaViewModel> CalcularMetodos(
        IReadOnlyList<MetodoPagamentoConfig> configs,
        List<Encomenda> vivas)
    {
        var totalVivas = Math.Max(1, vivas.Count);

        return configs
            .Select(config =>
            {
                var usosList = vivas.Where(e => e.MetodoPagamento == config.Metodo).ToList();

                return new MetodoLinhaViewModel
                {
                    Metodo = MetodoPagamentoMapper.ToChave(config.Metodo),
                    Ativo = config.Ativo,
                    TaxaPercent = config.TaxaPercent,
                    CustoFixo = config.CustoFixo,
                    Iban = config.Iban,
                    NumeroMbway = config.NumeroMbway,
                    Nota = config.Nota,
                    Usos = usosList.Count,
                    Valor = usosList.Sum(e => e.Total),
                    // Peso do método sobre o TOTAL de encomendas vivas — as 4
                    // barras somam ~100% (diferente do ranking do
                    // VendasService, que normaliza pelo maior valor).
                    BarraPct = (int)Math.Round(usosList.Count / (double)totalVivas * 100, MidpointRounding.AwayFromZero)
                };
            })
            .ToList();
    }

    private static List<TransacaoLinhaViewModel> CalcularTransacoes(IReadOnlyList<Encomenda> encomendas)
    {
        return encomendas
            .OrderByDescending(e => e.Criada)
            .Select(e => new TransacaoLinhaViewModel
            {
                Ref = e.Referencia,
                Dia = e.Criada.Day,
                ClienteNome = e.Utilizador is not null
                    ? $"{e.Utilizador.Nome} {e.Utilizador.Sobrenome}"
                    : "Sem conta",
                Metodo = MetodoPagamentoMapper.ToChave(e.MetodoPagamento),
                Total = e.Total,
                Anulada = e.Estado == EstadoEncomenda.Anulada,
                Pago = e.Pago
            })
            .ToList();
    }
}
