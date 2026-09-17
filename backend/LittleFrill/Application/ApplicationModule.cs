using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class ApplicationModule
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProdutoService, ProdutoService>();
        services.AddScoped<IProdutoAdminService, ProdutoAdminService>();
        services.AddScoped<IEncomendaService, EncomendaService>();
        services.AddScoped<IEncomendaAdminService, EncomendaAdminService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IStockService, StockService>();
        services.AddScoped<IClienteAdminService, ClienteAdminService>();
        services.AddScoped<IConfiguracaoNegocioService, ConfiguracaoNegocioService>();
        services.AddScoped<IPainelService, PainelService>();
        services.AddScoped<IVendasService, VendasService>();
        services.AddScoped<IMetodoPagamentoConfigService, MetodoPagamentoConfigService>();
        services.AddScoped<IPagamentosService, PagamentosService>();
        services.AddScoped<IConfiguracaoSiteService, ConfiguracaoSiteService>();
        services.AddScoped<ISeccaoConfigService, SeccaoConfigService>();
        services.AddScoped<ISiteInfoService, SiteInfoService>();
        services.AddScoped<ICustoFixoService, CustoFixoService>();
        services.AddScoped<ICustoVariavelService, CustoVariavelService>();
        services.AddScoped<IFinanceiroService, FinanceiroService>();

        return services;
    }
}
