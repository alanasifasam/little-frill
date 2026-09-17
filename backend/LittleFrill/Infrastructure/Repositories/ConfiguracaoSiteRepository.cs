using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ConfiguracaoSiteRepository : IConfiguracaoSiteRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public ConfiguracaoSiteRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // A linha (Id = 1) é sempre semeada por ConfiguracaoSiteConfiguration —
    // nunca é null. Tracked de propósito: quem chama pode mutar e persistir
    // via SaveChangesAsync() no mesmo DbContext.
    public async Task<ConfiguracaoSite> ObterAsync()
    {
        return await _dbContext.ConfiguracoesSite.SingleAsync();
    }
}
