using Core.Entities;

namespace Core.Interfaces;

public interface ICustoVariavelRepository
{
    Task<IReadOnlyList<CustoVariavel>> ListarAsync();

    // Linhas cuja Data cai em [inicio, fimExclusivo) — mesmo espírito de
    // IEncomendaRepository.ListarEntreDatasAsync.
    Task<IReadOnlyList<CustoVariavel>> ListarEntreDatasAsync(DateTime inicio, DateTime fimExclusivo);

    // Tracked de propósito: quem chama pode mutar (Atualizar) e persistir
    // via SaveChangesAsync() no mesmo DbContext.
    Task<CustoVariavel?> ObterPorIdAsync(int id);

    Task AdicionarAsync(CustoVariavel custoVariavel);

    Task RemoverAsync(CustoVariavel custoVariavel);
}
