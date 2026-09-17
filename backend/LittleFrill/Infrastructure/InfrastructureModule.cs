using Core.Interfaces;
using Infrastructure.Auth;
using Infrastructure.Envio;
using Infrastructure.Files;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class InfrastructureModule
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        string wwwRootPath)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.Configure<EnvioOptions>(configuration.GetSection("Envio"));

        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        // Scoped (não Singleton): agora depende de IConfiguracaoSiteRepository,
        // que por sua vez usa o LittleFrillDbContext (scoped). Um singleton a
        // consumir um serviço scoped seria uma "captive dependency" — o
        // DbContext ficaria preso à vida do container, partilhado entre
        // pedidos concorrentes, o que não é thread-safe.
        services.AddScoped<IEnvioPolicy, EnvioPolicy>();
        services.AddSingleton<IArmazenamentoImagens>(_ => new ArmazenamentoImagensLocal(wwwRootPath));

        services.AddDbContext<LittleFrillDbContext>(o => o.UseNpgsql(configuration.GetConnectionString("Default")));

        // Scoped: partilham o mesmo DbContext dentro do mesmo pedido,
        // essencial para o UnitOfWork persistir o que os repositórios
        // trackearam.
        services.AddScoped<IProdutoRepository, ProdutoRepository>();
        services.AddScoped<IEncomendaRepository, EncomendaRepository>();
        services.AddScoped<IUtilizadorRepository, UtilizadorRepository>();
        services.AddScoped<IMovimentoStockRepository, MovimentoStockRepository>();
        services.AddScoped<IConfiguracaoNegocioRepository, ConfiguracaoNegocioRepository>();
        services.AddScoped<IMetodoPagamentoConfigRepository, MetodoPagamentoConfigRepository>();
        services.AddScoped<IConfiguracaoSiteRepository, ConfiguracaoSiteRepository>();
        services.AddScoped<ISeccaoConfigRepository, SeccaoConfigRepository>();
        services.AddScoped<ICustoFixoRepository, CustoFixoRepository>();
        services.AddScoped<ICustoVariavelRepository, CustoVariavelRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
