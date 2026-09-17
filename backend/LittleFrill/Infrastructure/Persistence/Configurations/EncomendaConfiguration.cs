using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class EncomendaConfiguration : IEntityTypeConfiguration<Encomenda>
{
    public void Configure(EntityTypeBuilder<Encomenda> builder)
    {
        builder.ToTable("encomendas");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.UtilizadorId).HasColumnName("utilizador_id");

        builder.Property(e => e.Referencia)
            .HasColumnName("referencia")
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(e => e.Referencia).IsUnique();

        builder.Property(e => e.Criada).HasColumnName("criada");

        builder.Property(e => e.MetodoEnvio)
            .HasColumnName("metodo_envio")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.MetodoPagamento)
            .HasColumnName("metodo_pagamento")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.Nif)
            .HasColumnName("nif")
            .HasMaxLength(9);

        builder.Property(e => e.Subtotal).HasColumnName("subtotal").HasColumnType("decimal(10,2)");
        builder.Property(e => e.Envio).HasColumnName("envio").HasColumnType("decimal(10,2)");
        builder.Property(e => e.Total).HasColumnName("total").HasColumnType("decimal(10,2)");

        builder.Property(e => e.Estado)
            .HasColumnName("estado")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.EstadoAnterior)
            .HasColumnName("estado_anterior")
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(e => e.Pago).HasColumnName("pago");
        builder.Property(e => e.Apagada).HasColumnName("apagada");

        builder.Property(e => e.DataEmProducao).HasColumnName("data_em_producao");
        builder.Property(e => e.DataEmbalada).HasColumnName("data_embalada");
        builder.Property(e => e.DataEnviada).HasColumnName("data_enviada");
        builder.Property(e => e.DataEntregue).HasColumnName("data_entregue");

        builder.Property(e => e.CodigoRastreio)
            .HasColumnName("codigo_rastreio")
            .HasMaxLength(30);

        // Relação unidirecional: Utilizador não expõe ICollection<Encomenda>
        // (decisão já tomada). Opcional: uma venda de balcão (ver
        // Encomenda.CriarBalcao) não tem conta de cliente associada.
        builder.HasOne(e => e.Utilizador)
            .WithMany()
            .HasForeignKey(e => e.UtilizadorId);

        // Objeto de valor 1:1 — colunas na própria tabela "encomendas".
        builder.OwnsOne(e => e.Entrega, entrega =>
        {
            entrega.Property(en => en.Nome).HasColumnName("entrega_nome").IsRequired().HasMaxLength(200);
            entrega.Property(en => en.Email).HasColumnName("entrega_email").IsRequired().HasMaxLength(200);
            entrega.Property(en => en.Telefone).HasColumnName("entrega_telefone").IsRequired().HasMaxLength(30);
            entrega.Property(en => en.Morada).HasColumnName("entrega_morada").IsRequired().HasMaxLength(300);
            entrega.Property(en => en.AndarPorta).HasColumnName("entrega_andar_porta").HasMaxLength(100);
            entrega.Property(en => en.CodigoPostal).HasColumnName("entrega_codigo_postal").IsRequired().HasMaxLength(8);
            entrega.Property(en => en.Localidade).HasColumnName("entrega_localidade").IsRequired().HasMaxLength(150);
            entrega.Property(en => en.Distrito).HasColumnName("entrega_distrito").IsRequired().HasMaxLength(50);
            entrega.Property(en => en.Pais).HasColumnName("entrega_pais").IsRequired().HasMaxLength(2);
            entrega.Property(en => en.Notas).HasColumnName("entrega_notas").HasMaxLength(500);
        });

        // Opcional: uma venda de balcão (Encomenda.CriarBalcao) é entregue
        // em mão, sem morada.

        // Tabela própria "encomenda_itens" com FK sombra "encomenda_id" e
        // chave surrogate "Id" (EncomendaItem não tem Id próprio).
        builder.OwnsMany(e => e.Itens, itens =>
        {
            itens.ToTable("encomenda_itens");

            itens.WithOwner().HasForeignKey("encomenda_id");

            itens.Property<int>("Id");
            itens.HasKey("Id");

            itens.Property(i => i.ProdutoId).HasColumnName("produto_id");
            itens.Property(i => i.NomeProduto).HasColumnName("nome_produto").IsRequired().HasMaxLength(200);
            itens.Property(i => i.PrecoUnitario).HasColumnName("preco_unitario").HasColumnType("decimal(10,2)");
            itens.Property(i => i.Quantidade).HasColumnName("quantidade");
        });

        // Itens é get-only, exposto sempre como _itens.AsReadOnly() — EF
        // materializa/acede à coleção pelo campo _itens, não pela
        // propriedade (coerente com a correção em Core.Entities.Encomenda).
        builder.Navigation(e => e.Itens).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
