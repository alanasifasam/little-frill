using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class MovimentoStockConfiguration : IEntityTypeConfiguration<MovimentoStock>
{
    public void Configure(EntityTypeBuilder<MovimentoStock> builder)
    {
        builder.ToTable("movimentos_stock");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");

        // Referência solta ao produto, sem FK explícita — mesmo padrão de
        // encomenda_itens.produto_id (ver EncomendaConfiguration): o
        // histórico de movimentos não deve ficar preso a um produto que
        // venha a ser apagado.
        builder.Property(m => m.ProdutoId).HasColumnName("produto_id");

        builder.Property(m => m.Tipo)
            .HasColumnName("tipo")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(m => m.Quantidade).HasColumnName("quantidade");

        builder.Property(m => m.Motivo)
            .HasColumnName("motivo")
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(m => m.Data).HasColumnName("data");
    }
}
