using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ConfiguracaoNegocioRepository : IConfiguracaoNegocioRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public ConfiguracaoNegocioRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // A linha (Id = 1) é sempre semeada por ConfiguracaoNegocioConfiguration
    // — nunca é null. Tracked de propósito: quem chama pode mutar e
    // persistir via SaveChangesAsync() no mesmo DbContext.
    public async Task<ConfiguracaoNegocio> ObterAsync()
    {
        return await _dbContext.ConfiguracoesNegocio.SingleAsync();
    }
}
