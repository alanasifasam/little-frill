using Core.Entities;
using Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class SeccaoConfigConfiguration : IEntityTypeConfiguration<SeccaoConfig>
{
    public void Configure(EntityTypeBuilder<SeccaoConfig> builder)
    {
        builder.ToTable("seccoes_config");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");

        builder.Property(s => s.Seccao)
            .HasColumnName("seccao")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(s => s.Ativa)
            .HasColumnName("ativa");

        builder.HasIndex(s => s.Seccao).IsUnique();

        // 7 linhas fixas — uma por valor de Seccao. Não há criação nem
        // remoção em runtime, só toggle via DefinirAtiva. Todas Ativa=true
        // para não esconder nenhuma secção do catálogo existente ao migrar.
        builder.HasData(
            new { Id = 1, Seccao = Seccao.Acessorios, Ativa = true },
            new { Id = 2, Seccao = Seccao.Bebe, Ativa = true },
            new { Id = 3, Seccao = Seccao.Mesa, Ativa = true },
            new { Id = 4, Seccao = Seccao.Banho, Ativa = true },
            new { Id = 5, Seccao = Seccao.Cama, Ativa = true },
            new { Id = 6, Seccao = Seccao.Cozinha, Ativa = true },
            new { Id = 7, Seccao = Seccao.Animais, Ativa = true });
    }
}
