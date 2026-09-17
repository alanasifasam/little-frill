using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class EncomendaRepository : IEncomendaRepository
{
    // Implementação temporária enquanto corremos sobre InMemoryDatabase
    // (sem sequências nativas): contador estático em processo, protegido
    // por lock. NÃO é atómico entre processos — só serve para uma única
    // instância local da API. Fica substituído por uma sequência real do
    // Postgres (nextval) quando ligarmos a Postgres a sério; nesse momento
    // a migração também ganha a sequência.
    private static int _proximoNumero = 1200;
    private static readonly object _lock = new();

    private readonly LittleFrillDbContext _dbContext;

    public EncomendaRepository(LittleFrillDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AdicionarAsync(Encomenda encomenda)
    {
        await _dbContext.Encomendas.AddAsync(encomenda);
    }

    public Task<string> ProximaReferenciaAsync()
    {
        int numero;
        lock (_lock)
        {
            numero = _proximoNumero++;
        }

        return Task.FromResult($"CA-{numero}");
    }

    public async Task<IReadOnlyList<Encomenda>> ListarPorUtilizadorIdAsync(int utilizadorId)
    {
        // Entrega e Itens são tipos possuídos (owned types) — carregam
        // automaticamente com o dono, sem Include() explícito.
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.UtilizadorId == utilizadorId && !e.Apagada)
            .ToListAsync();
    }

    public async Task<Encomenda?> ObterPorReferenciaEUtilizadorAsync(string referencia, int utilizadorId)
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => !e.Apagada)
            .FirstOrDefaultAsync(e => e.Referencia == referencia && e.UtilizadorId == utilizadorId);
    }

    public async Task<IReadOnlyList<Encomenda>> ListarParaAdminAsync()
    {
        return await _dbContext.Encomendas
            .Include(e => e.Utilizador)
            .AsNoTracking()
            .Where(e => !e.Apagada)
            .OrderByDescending(e => e.Criada)
            .ToListAsync();
    }

    public async Task<Encomenda?> ObterPorReferenciaAsync(string referencia)
    {
        return await _dbContext.Encomendas
            .FirstOrDefaultAsync(e => e.Referencia == referencia);
    }

    // EncomendaItem é uma coleção possuída (OwnsMany, tabela própria
    // "encomenda_itens") — continua acessível via SelectMany a partir do
    // DbSet de Encomendas.
    public async Task<Dictionary<int, int>> ObterQuantidadesVendidasPorProdutoAsync()
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.Estado != EstadoEncomenda.Anulada)
            .SelectMany(e => e.Itens)
            .GroupBy(i => i.ProdutoId)
            .Select(g => new { ProdutoId = g.Key, Quantidade = g.Sum(i => i.Quantidade) })
            .ToDictionaryAsync(g => g.ProdutoId, g => g.Quantidade);
    }

    public async Task<Dictionary<int, int>> ObterQuantidadesVendidasPorProdutoNoMesAsync(DateTime inicio, DateTime fim)
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.Criada >= inicio && e.Criada < fim && e.Estado != EstadoEncomenda.Anulada)
            .SelectMany(e => e.Itens)
            .GroupBy(i => i.ProdutoId)
            .Select(g => new { ProdutoId = g.Key, Quantidade = g.Sum(i => i.Quantidade) })
            .ToDictionaryAsync(g => g.ProdutoId, g => g.Quantidade);
    }

    public async Task<bool> ExisteItemParaProdutoAsync(int produtoId)
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.Estado != EstadoEncomenda.Anulada)
            .SelectMany(e => e.Itens)
            .AnyAsync(i => i.ProdutoId == produtoId);
    }

    public async Task<Dictionary<int, (int NEncomendas, decimal Gasto)>> ObterContagemEGastoPorUtilizadorAsync()
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.UtilizadorId != null && e.Estado != EstadoEncomenda.Anulada)
            .GroupBy(e => e.UtilizadorId!.Value)
            .Select(g => new { UtilizadorId = g.Key, NEncomendas = g.Count(), Gasto = g.Sum(e => e.Total) })
            .ToDictionaryAsync(g => g.UtilizadorId, g => (g.NEncomendas, g.Gasto));
    }

    public async Task<IReadOnlyList<Encomenda>> ListarEntreDatasAsync(DateTime inicio, DateTime fimExclusivo)
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .Where(e => e.Criada >= inicio && e.Criada < fimExclusivo)
            .ToListAsync();
    }

    public async Task<bool> ExisteEncomendaParaUtilizadorAsync(int utilizadorId)
    {
        return await _dbContext.Encomendas
            .AsNoTracking()
            .AnyAsync(e => e.UtilizadorId == utilizadorId);
    }
}
