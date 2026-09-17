using Core.Entities;
using Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class UtilizadorConfiguration : IEntityTypeConfiguration<Utilizador>
{
    public void Configure(EntityTypeBuilder<Utilizador> builder)
    {
        builder.ToTable("utilizadores");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasColumnName("id");

        builder.Property(u => u.Nome)
            .HasColumnName("nome")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Sobrenome)
            .HasColumnName("sobrenome")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(u => u.CodigoPostal)
            .HasColumnName("codigo_postal")
            .HasMaxLength(8);

        builder.Property(u => u.Distrito)
            .HasColumnName("distrito")
            .HasMaxLength(50);

        builder.Property(u => u.Telefone)
            .HasColumnName("telefone")
            .HasMaxLength(20);

        builder.Property(u => u.QuerCarta)
            .HasColumnName("quer_carta");

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue(Role.Cliente);

        builder.Property(u => u.CriadoEm)
            .HasColumnName("criado_em");

        // Reforça a nível de BD a verificação que AuthService.RegistoAsync
        // já faz em Application (defesa em profundidade contra registos
        // concorrentes com o mesmo email).
        builder.HasIndex(u => u.Email).IsUnique();
    }
}
