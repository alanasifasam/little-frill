using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UtilizadorRepository : IUtilizadorRepository
{
    private readonly LittleFrillDbContext _dbContext;

    public UtilizadorRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Utilizador?> ObterPorEmailAsync(string email)
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<Utilizador?> ObterPorIdAsync(int id)
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AdicionarAsync(Utilizador utilizador)
    {
        await _dbContext.Utilizadores.AddAsync(utilizador);
    }

    public async Task<bool> ExisteEmailAsync(string email)
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .AnyAsync(u => u.Email == email);
    }

    public async Task<bool> ExisteEmailAsync(string email, int idExcluido)
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .AnyAsync(u => u.Email == email && u.Id != idExcluido);
    }

    public async Task<bool> ExisteAdminAsync()
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .AnyAsync(u => u.Role == Role.Admin);
    }

    public async Task<IReadOnlyList<Utilizador>> ListarClientesAsync()
    {
        return await _dbContext.Utilizadores
            .AsNoTracking()
            .Where(u => u.Role == Role.Cliente)
            .OrderBy(u => u.Nome)
            .ToListAsync();
    }

    public async Task<Utilizador?> ObterParaEdicaoAsync(int id)
    {
        return await _dbContext.Utilizadores.FirstOrDefaultAsync(u => u.Id == id);
    }

    public Task RemoverAsync(Utilizador utilizador)
    {
        _dbContext.Utilizadores.Remove(utilizador);
        return Task.CompletedTask;
    }
}
