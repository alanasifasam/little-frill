using Core.Entities;
using Core.Enums;

namespace Core.Interfaces;

public interface IMovimentoStockRepository
{
    Task AdicionarAsync(MovimentoStock movimento);

    Task<IReadOnlyList<MovimentoStock>> ListarDoMesAsync(DateTime inicio, DateTime fim);

    // Sem filtro de mês, ao contrário de ListarDoMesAsync — alimenta a
    // lista de "últimos movimentos" do Painel, que não pode ficar vazia
    // nos primeiros dias do mês.
    Task<IReadOnlyList<MovimentoStock>> ListarRecentesAsync(int limite);

    // Query agregada por produto (evita N+1 no inventário admin de Stock) —
    // mesmo padrão de IEncomendaRepository.ObterQuantidadesVendidasPorProdutoAsync.
    Task<Dictionary<int, int>> SomarQuantidadesPorProdutoNoMesAsync(TipoMovimentoStock tipo, DateTime inicio, DateTime fim);
}
