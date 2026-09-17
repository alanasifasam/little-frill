using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MetodoPagamentoConfigRepository : IMetodoPagamentoConfigRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public MetodoPagamentoConfigRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<MetodoPagamentoConfig>> ListarAsync()
    {
        return await _dbContext.MetodosPagamentoConfig
            .AsNoTracking()
            .ToListAsync();
    }

    // Sem AsNoTracking: quem chama pode mutar e persistir via
    // SaveChangesAsync() no mesmo DbContext (mesmo espírito de
    // ConfiguracaoNegocioRepository.ObterAsync).
    public async Task<MetodoPagamentoConfig?> ObterPorMetodoAsync(MetodoPagamento metodo)
    {
        return await _dbContext.MetodosPagamentoConfig
            .FirstOrDefaultAsync(m => m.Metodo == metodo);
    }
}
