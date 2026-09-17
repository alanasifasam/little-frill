using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SeccaoConfigRepository : ISeccaoConfigRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public SeccaoConfigRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<SeccaoConfig>> ListarAsync()
    {
        return await _dbContext.SeccoesConfig
            .AsNoTracking()
            .ToListAsync();
    }

    // Sem AsNoTracking: quem chama pode mutar (DefinirAtiva) e persistir via
    // SaveChangesAsync() no mesmo DbContext.
    public async Task<SeccaoConfig?> ObterPorSeccaoAsync(Seccao seccao)
    {
        return await _dbContext.SeccoesConfig
            .FirstOrDefaultAsync(s => s.Seccao == seccao);
    }
}
