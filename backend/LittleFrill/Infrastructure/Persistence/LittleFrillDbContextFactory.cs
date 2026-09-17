using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

/// <summary>
/// Usado só pelas ferramentas `dotnet ef` (ex.: `dotnet ef migrations add`),
/// correndo a partir do host — essas ferramentas não arrancam `Program.cs`
/// nem o `WebApplication`, por isso precisam deste factory para compor o
/// `DbContext` sozinho. `migrations add` não precisa de ligação viva (só
/// gera a diferença contra o modelo em C#), por isso o valor local de
/// reserva chega para isso. Para `migrations list`/`database update` a
/// sério contra o Neon a partir do host, define NEON_CONNECTION_STRING na
/// sessão da shell antes de correr — nunca fica escrito aqui (é um segredo).
/// </summary>
public class LittleFrillDbContextFactory : IDesignTimeDbContextFactory<LittleFrillDbContext>
{
    private const string ConnectionStringLocalDeReserva =
        "Host=localhost;Port=5432;Database=littlefrill;Username=postgres;Password=postgres";

    public LittleFrillDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("NEON_CONNECTION_STRING")
            ?? ConnectionStringLocalDeReserva;

        var optionsBuilder = new DbContextOptionsBuilder<LittleFrillDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new LittleFrillDbContext(optionsBuilder.Options);
    }
}
