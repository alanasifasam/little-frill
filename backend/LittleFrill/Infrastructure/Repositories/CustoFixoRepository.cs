using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CustoFixoRepository : ICustoFixoRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public CustoFixoRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CustoFixo>> ListarAsync()
    {
        return await _dbContext.CustosFixos.AsNoTracking().ToListAsync();
    }

    public async Task<CustoFixo?> ObterPorIdAsync(int id)
    {
        return await _dbContext.CustosFixos.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AdicionarAsync(CustoFixo custoFixo)
    {
        await _dbContext.CustosFixos.AddAsync(custoFixo);
    }

    public Task RemoverAsync(CustoFixo custoFixo)
    {
        _dbContext.CustosFixos.Remove(custoFixo);
        return Task.CompletedTask;
    }
}
