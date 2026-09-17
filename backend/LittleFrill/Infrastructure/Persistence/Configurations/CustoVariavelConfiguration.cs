using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class CustoVariavelConfiguration : IEntityTypeConfiguration<CustoVariavel>
{
    public void Configure(EntityTypeBuilder<CustoVariavel> builder)
    {
        builder.ToTable("custos_variaveis");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");

        builder.Property(c => c.Label)
            .HasColumnName("label")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Valor)
            .HasColumnName("valor")
            .HasColumnType("decimal(10,2)");

        builder.Property(c => c.Data)
            .HasColumnName("data");
    }
}
