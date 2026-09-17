using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class LittleFrillDbContext : DbContext
{
    public LittleFrillDbContext(DbContextOptions<LittleFrillDbContext> options)
        : base(options)
    {
    }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Utilizador> Utilizadores => Set<Utilizador>();
    public DbSet<Encomenda> Encomendas => Set<Encomenda>();
    public DbSet<MovimentoStock> MovimentosStock => Set<MovimentoStock>();
    public DbSet<ConfiguracaoNegocio> ConfiguracoesNegocio => Set<ConfiguracaoNegocio>();
    public DbSet<MetodoPagamentoConfig> MetodosPagamentoConfig => Set<MetodoPagamentoConfig>();
    public DbSet<ConfiguracaoSite> ConfiguracoesSite => Set<ConfiguracaoSite>();
    public DbSet<SeccaoConfig> SeccoesConfig => Set<SeccaoConfig>();
    public DbSet<CustoFixo> CustosFixos => Set<CustoFixo>();
    public DbSet<CustoVariavel> CustosVariaveis => Set<CustoVariavel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Explícito por causa do Neon: o endpoint pooled (PgBouncer) rejeita
        // "search_path" nos parâmetros de arranque da ligação, e defaults de
        // search_path a nível de role não chegam a ligações reaproveitadas
        // pelo pooler — sem isto, SQL sem o schema explícito falha com
        // "relation does not exist" mesmo com as tabelas lá.
        modelBuilder.HasDefaultSchema("public");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LittleFrillDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
