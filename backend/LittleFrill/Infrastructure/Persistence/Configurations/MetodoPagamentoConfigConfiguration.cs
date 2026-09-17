using Core.Entities;
using Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class MetodoPagamentoConfigConfiguration : IEntityTypeConfiguration<MetodoPagamentoConfig>
{
    public void Configure(EntityTypeBuilder<MetodoPagamentoConfig> builder)
    {
        builder.ToTable("metodos_pagamento_config");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");

        builder.Property(m => m.Metodo)
            .HasColumnName("metodo")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(m => m.Ativo)
            .HasColumnName("ativo");

        builder.Property(m => m.TaxaPercent)
            .HasColumnName("taxa_percent")
            .HasColumnType("decimal(10,2)");

        builder.Property(m => m.CustoFixo)
            .HasColumnName("custo_fixo")
            .HasColumnType("decimal(10,2)");

        builder.Property(m => m.Iban)
            .HasColumnName("iban");

        builder.Property(m => m.NumeroMbway)
            .HasColumnName("numero_mbway");

        builder.Property(m => m.Nota)
            .HasColumnName("nota");

        builder.HasIndex(m => m.Metodo).IsUnique();

        // 4 linhas fixas — uma por valor de MetodoPagamento usado no
        // checkout (Dinheiro fica de fora, é só venda de balcão). Todas
        // Ativo=true para não quebrar o checkout existente ao migrar.
        // Iban/NumeroMbway ficam null até o admin os preencher em
        // /admin/pagamentos — são os dados de pagamento do próprio ateliê,
        // não algo que o cliente introduz.
        builder.HasData(
            new
            {
                Id = 1,
                Metodo = MetodoPagamento.MbWay,
                Ativo = true,
                TaxaPercent = 0m,
                CustoFixo = 0m,
                Iban = (string?)null,
                NumeroMbway = (string?)null,
                Nota = "Cliente transfere para o nosso número de MB WAY; confirmamos o pagamento em até 3 dias"
            },
            new
            {
                Id = 2,
                Metodo = MetodoPagamento.Multibanco,
                Ativo = true,
                TaxaPercent = 0m,
                CustoFixo = 0m,
                Iban = (string?)null,
                NumeroMbway = (string?)null,
                Nota = "Damos entidade e referência, válidas 3 dias"
            },
            new
            {
                Id = 3,
                Metodo = MetodoPagamento.Cartao,
                Ativo = true,
                TaxaPercent = 1.4m,
                CustoFixo = 0.25m,
                Iban = (string?)null,
                NumeroMbway = (string?)null,
                Nota = "Visa ou Mastercard"
            },
            new
            {
                Id = 4,
                Metodo = MetodoPagamento.Transferencia,
                Ativo = true,
                TaxaPercent = 0m,
                CustoFixo = 0m,
                Iban = (string?)null,
                NumeroMbway = (string?)null,
                Nota = "Cliente transfere para o nosso IBAN; confirmamos o pagamento em até 3 dias"
            });
    }
}
