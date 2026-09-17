using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CustoVariavelRepository : ICustoVariavelRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public CustoVariavelRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CustoVariavel>> ListarAsync()
    {
        return await _dbContext.CustosVariaveis.AsNoTracking().ToListAsync();
    }

    public async Task<IReadOnlyList<CustoVariavel>> ListarEntreDatasAsync(DateTime inicio, DateTime fimExclusivo)
    {
        return await _dbContext.CustosVariaveis
            .AsNoTracking()
            .Where(c => c.Data >= inicio && c.Data < fimExclusivo)
            .ToListAsync();
    }

    public async Task<CustoVariavel?> ObterPorIdAsync(int id)
    {
        return await _dbContext.CustosVariaveis.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AdicionarAsync(CustoVariavel custoVariavel)
    {
        await _dbContext.CustosVariaveis.AddAsync(custoVariavel);
    }

    public Task RemoverAsync(CustoVariavel custoVariavel)
    {
        _dbContext.CustosVariaveis.Remove(custoVariavel);
        return Task.CompletedTask;
    }
}
