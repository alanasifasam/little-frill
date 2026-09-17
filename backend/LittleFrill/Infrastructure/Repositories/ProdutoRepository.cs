using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProdutoRepository : IProdutoRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public ProdutoRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Produto?> ObterPorIdAsync(int id)
    {
        return await _dbContext.Produtos
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.Ativo);
    }

    public async Task<IReadOnlyList<Produto>> ListarAsync(
        Seccao? seccao,
        Padrao? padrao,
        Cor? cor,
        decimal? precoMax,
        bool soStock,
        bool destaque,
        bool nova,
        IReadOnlyList<Seccao> seccoesAtivas)
    {
        var query = _dbContext.Produtos.AsNoTracking().Where(p => p.Ativo);

        query = query.Where(p => seccoesAtivas.Contains(p.Seccao));

        if (seccao is not null)
            query = query.Where(p => p.Seccao == seccao);

        if (padrao is not null)
            query = query.Where(p => p.Padrao == padrao);

        if (cor is not null)
            query = query.Where(p => p.Cor == cor);

        if (precoMax is not null)
            query = query.Where(p => p.Preco <= precoMax);

        if (soStock)
            query = query.Where(p => p.Stock > 0);

        if (destaque)
            query = query.Where(p => p.Destaque);

        if (nova)
            query = query.Where(p => p.Novo);

        return await query.ToListAsync();
    }

    // Sem AsNoTracking() de propósito: é usado por EncomendaService.CriarAsync
    // para debitar stock (Produto.DebitarStock), e essa mutação só é
    // persistida por SaveChangesAsync() se a entidade estiver a ser
    // trackeada pelo mesmo DbContext. Assimetria face à regra geral de
    // AsNoTracking() em leituras, necessária aqui porque este método
    // alimenta um fluxo de escrita.
    // Sem filtro de Ativo, de propósito: valida/debita um carrinho já
    // composto no checkout — desativar uma peça no admin não pode invalidar
    // uma compra já em curso.
    public async Task<IReadOnlyList<Produto>> ObterPorIdsAsync(IEnumerable<int> ids)
    {
        var idsList = ids.ToList();

        return await _dbContext.Produtos
            .Where(p => idsList.Contains(p.Id))
            .ToListAsync();
    }

    // Tracked de propósito, mesma razão de ObterPorIdsAsync — serve os
    // fluxos de escrita do admin (PUT/PATCH/DELETE), que mutam a entidade e
    // dependem do DbContext estar a trackeá-la para o SaveChangesAsync()
    // persistir a alteração. Sem filtro de Ativo: o admin também tem de
    // conseguir editar/reativar um produto já desativado.
    public async Task<Produto?> ObterParaEdicaoAsync(int id)
    {
        return await _dbContext.Produtos.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IReadOnlyList<Produto>> ListarParaAdminAsync()
    {
        return await _dbContext.Produtos.AsNoTracking().ToListAsync();
    }

    public async Task AdicionarAsync(Produto produto)
    {
        await _dbContext.Produtos.AddAsync(produto);
    }

    public Task RemoverAsync(Produto produto)
    {
        _dbContext.Produtos.Remove(produto);
        return Task.CompletedTask;
    }
}
