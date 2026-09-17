using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MovimentoStockRepository : IMovimentoStockRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public MovimentoStockRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AdicionarAsync(MovimentoStock movimento)
    {
        await _dbContext.MovimentosStock.AddAsync(movimento);
    }

    public async Task<IReadOnlyList<MovimentoStock>> ListarDoMesAsync(DateTime inicio, DateTime fim)
    {
        return await _dbContext.MovimentosStock
            .AsNoTracking()
            .Where(m => m.Data >= inicio && m.Data < fim)
            .OrderByDescending(m => m.Data)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<MovimentoStock>> ListarRecentesAsync(int limite)
    {
        return await _dbContext.MovimentosStock
            .AsNoTracking()
            .OrderByDescending(m => m.Data)
            .Take(limite)
            .ToListAsync();
    }

    public async Task<Dictionary<int, int>> SomarQuantidadesPorProdutoNoMesAsync(TipoMovimentoStock tipo, DateTime inicio, DateTime fim)
    {
        return await _dbContext.MovimentosStock
            .AsNoTracking()
            .Where(m => m.Tipo == tipo && m.Data >= inicio && m.Data < fim)
            .GroupBy(m => m.ProdutoId)
            .Select(g => new { ProdutoId = g.Key, Quantidade = g.Sum(m => m.Quantidade) })
            .ToDictionaryAsync(g => g.ProdutoId, g => g.Quantidade);
    }
}
