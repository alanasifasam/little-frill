using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ProdutoConfiguration : IEntityTypeConfiguration<Produto>
{
    public void Configure(EntityTypeBuilder<Produto> builder)
    {
        builder.ToTable("produtos");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.Nome)
            .HasColumnName("nome")
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Tipo)
            .HasColumnName("tipo")
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Seccao)
            .HasColumnName("seccao")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Preco)
            .HasColumnName("preco")
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.Custo)
            .HasColumnName("custo")
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.Padrao)
            .HasColumnName("padrao")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Cor)
            .HasColumnName("cor")
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Stock)
            .HasColumnName("stock");

        builder.Property(p => p.Medidas)
            .HasColumnName("medidas")
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Tecido)
            .HasColumnName("tecido")
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(p => p.Novo)
            .HasColumnName("novo");

        builder.Property(p => p.Ativo)
            .HasColumnName("ativo");

        builder.Property(p => p.Destaque)
            .HasColumnName("destaque");

        // Tabela própria "produto_imagens" com FK sombra "produto_id".
        // Ao contrário de EncomendaItem, ProdutoImagem tem um Id próprio
        // (chave real, não surrogate) porque as fotos são apagáveis
        // individualmente pela API do admin.
        builder.OwnsMany(p => p.Imagens, imagens =>
        {
            imagens.ToTable("produto_imagens");

            imagens.WithOwner().HasForeignKey("produto_id");

            imagens.HasKey(i => i.Id);

            imagens.Property(i => i.Url).HasColumnName("url").IsRequired().HasMaxLength(500);
            imagens.Property(i => i.Ordem).HasColumnName("ordem");

            // Foco não destrutivo (percentagem 0-100, default 50/50 =
            // centro) usado como object-position quando a imagem é exibida
            // com object-fit: cover, sem nunca tocar no ficheiro original.
            imagens.Property(i => i.FocoX).HasColumnName("foco_x").HasColumnType("numeric(5,2)");
            imagens.Property(i => i.FocoY).HasColumnName("foco_y").HasColumnType("numeric(5,2)");
        });

        // Imagens é get-only, exposto sempre como _imagens.AsReadOnly() — EF
        // materializa/acede à coleção pelo campo _imagens, não pela
        // propriedade (coerente com a correção em Core.Entities.Encomenda).
        builder.Navigation(p => p.Imagens).UsePropertyAccessMode(PropertyAccessMode.Field);

        // Coleção primitiva nativa do EF Core 8 — no Postgres mapeia para
        // `integer[]` (tipo array nativo, suportado pelo Npgsql), sem
        // conversores manuais.
        builder.Property(p => p.CombinaCom)
            .HasColumnName("combina_com");

        builder.HasData(ProdutoSeed.Produtos);
    }
}
