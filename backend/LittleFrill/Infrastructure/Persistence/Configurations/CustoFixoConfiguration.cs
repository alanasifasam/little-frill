using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class CustoFixoConfiguration : IEntityTypeConfiguration<CustoFixo>
{
    public void Configure(EntityTypeBuilder<CustoFixo> builder)
    {
        builder.ToTable("custos_fixos");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");

        builder.Property(c => c.Label)
            .HasColumnName("label")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Valor)
            .HasColumnName("valor")
            .HasColumnType("decimal(10,2)");

        builder.Property(c => c.Ativo)
            .HasColumnName("ativo");

        // 4 linhas iniciais que já existiam como mock fixo no frontend
        // (mocks/admin/custosFixos.mock.ts) — semeadas aqui para a página
        // "Custos e lucro" não nascer vazia; o admin gere-as livremente
        // depois via CustosFixosController.
        builder.HasData(
            new { Id = 1, Label = "Renda do ateliê", Valor = 180m, Ativo = true },
            new { Id = 2, Label = "Luz e água", Valor = 42m, Ativo = true },
            new { Id = 3, Label = "Embalagem e etiquetas", Valor = 38m, Ativo = true },
            new { Id = 4, Label = "Site e domínio", Valor = 14m, Ativo = true });
    }
}
