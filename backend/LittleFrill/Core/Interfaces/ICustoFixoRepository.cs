using Core.Entities;

namespace Core.Interfaces;

public interface ICustoFixoRepository
{
    Task<IReadOnlyList<CustoFixo>> ListarAsync();

    // Tracked de propósito: quem chama pode mutar (Atualizar/DefinirAtivo) e
    // persistir via SaveChangesAsync() no mesmo DbContext.
    Task<CustoFixo?> ObterPorIdAsync(int id);

    Task AdicionarAsync(CustoFixo custoFixo);

    Task RemoverAsync(CustoFixo custoFixo);
}
