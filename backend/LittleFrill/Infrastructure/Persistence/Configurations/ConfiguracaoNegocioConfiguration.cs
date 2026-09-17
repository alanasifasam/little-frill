using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ConfiguracaoNegocioConfiguration : IEntityTypeConfiguration<ConfiguracaoNegocio>
{
    public void Configure(EntityTypeBuilder<ConfiguracaoNegocio> builder)
    {
        builder.ToTable("configuracoes_negocio");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");

        builder.Property(c => c.MetaMes)
            .HasColumnName("meta_mes")
            .HasColumnType("decimal(10,2)");

        builder.Property(c => c.EnvioRealCtt)
            .HasColumnName("envio_real_ctt")
            .HasColumnType("decimal(10,2)");

        builder.Property(c => c.FeriasLigadas)
            .HasColumnName("ferias_ligadas");

        // Singleton: só existe sempre a linha Id = 1, semeada por HasData —
        // mesmo padrão de ProdutoConfiguration/ProdutoSeed.
        builder.HasData(new
        {
            Id = 1,
            MetaMes = 1500m,
            EnvioRealCtt = 4.1m,
            FeriasLigadas = false
        });
    }
}
