using Core.Entities;
using Core.Enums;

namespace Core.Interfaces;

public interface IProdutoRepository
{
    Task<Produto?> ObterPorIdAsync(int id);

    Task<IReadOnlyList<Produto>> ListarAsync(
        Seccao? seccao,
        Padrao? padrao,
        Cor? cor,
        decimal? precoMax,
        bool soStock,
        bool destaque,
        bool nova,
        IReadOnlyList<Seccao> seccoesAtivas);

    Task<IReadOnlyList<Produto>> ObterPorIdsAsync(IEnumerable<int> ids);

    // Tracked de propósito — ver o mesmo comentário em ObterPorIdsAsync:
    // o admin precisa de mutar a entidade (AtualizarDetalhes, DefinirStock,
    // AlternarAtivo, ...) e persistir via SaveChangesAsync() no mesmo
    // DbContext, o que só funciona se a entidade estiver a ser trackeada.
    Task<Produto?> ObterParaEdicaoAsync(int id);

    // Sem filtros de catálogo: a tabela admin tem de mostrar também os
    // produtos inativos, ao contrário de ListarAsync (que serve a loja).
    Task<IReadOnlyList<Produto>> ListarParaAdminAsync();

    Task AdicionarAsync(Produto produto);

    Task RemoverAsync(Produto produto);
}
