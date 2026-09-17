using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ConfiguracaoSiteConfiguration : IEntityTypeConfiguration<ConfiguracaoSite>
{
    public void Configure(EntityTypeBuilder<ConfiguracaoSite> builder)
    {
        builder.ToTable("configuracoes_site");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");

        builder.Property(c => c.Titulo)
            .HasColumnName("titulo")
            .IsRequired();

        builder.Property(c => c.Gancho)
            .HasColumnName("gancho")
            .IsRequired();

        builder.Property(c => c.EnvioLimiarGratis)
            .HasColumnName("envio_limiar_gratis")
            .HasColumnType("decimal(10,2)");

        builder.Property(c => c.HeroEyebrow)
            .HasColumnName("hero_eyebrow")
            .IsRequired();

        builder.Property(c => c.HeroCorpo)
            .HasColumnName("hero_corpo")
            .IsRequired();

        builder.Property(c => c.HeroCta1Label)
            .HasColumnName("hero_cta1_label")
            .IsRequired();

        builder.Property(c => c.HeroCta2Label)
            .HasColumnName("hero_cta2_label")
            .IsRequired();

        builder.Property(c => c.HeroImagemLegenda)
            .HasColumnName("hero_imagem_legenda")
            .IsRequired();

        builder.Property(c => c.Confianca1Titulo)
            .HasColumnName("confianca1_titulo")
            .IsRequired();

        builder.Property(c => c.Confianca1Texto)
            .HasColumnName("confianca1_texto")
            .IsRequired();

        builder.Property(c => c.Confianca2Titulo)
            .HasColumnName("confianca2_titulo")
            .IsRequired();

        builder.Property(c => c.Confianca2Texto)
            .HasColumnName("confianca2_texto")
            .IsRequired();

        builder.Property(c => c.Confianca3Titulo)
            .HasColumnName("confianca3_titulo")
            .IsRequired();

        builder.Property(c => c.Confianca3TextoModelo)
            .HasColumnName("confianca3_texto_modelo")
            .IsRequired();

        builder.Property(c => c.HeroImagemUrl)
            .HasColumnName("hero_imagem_url")
            .IsRequired(false);

        // Singleton: só existe sempre a linha Id = 1, semeada por HasData —
        // mesmo padrão de ConfiguracaoNegocioConfiguration. Textos e limiar
        // são os atualmente hardcoded no Hero/ConfiancaColunas do frontend e
        // em appsettings.json Envio:LimiarGratis, respetivamente.
        // Confianca3TextoModelo guarda o placeholder literal "{valor}" onde
        // o frontend interpola o limiar de envio grátis formatado em euros.
        builder.HasData(new
        {
            Id = 1,
            Titulo = "Presentes que não existem em mais nenhuma casa.",
            Gancho = "Cada peça tem par: leve o conjunto e poupe no envio.",
            EnvioLimiarGratis = 50m,
            HeroEyebrow = "Ateliê · Lisboa, Portugal",
            HeroCorpo = "Bolsas, necessaires, capas de portátil e de Kindle, porta-moedas — e o enxoval todo para o bebé, a mesa, o banho, a cama, a cozinha e os pets da casa.",
            HeroCta1Label = "Ver todas as peças",
            HeroCta2Label = "Acessórios",
            HeroImagemLegenda = "Algodão xadrez rosa, o padrão da casa desde 2019.",
            Confianca1Titulo = "Uma pessoa, uma máquina",
            Confianca1Texto = "Tudo é cortado, cosido e passado a ferro no ateliê. Se pedir dois iguais, saem dois iguais — nunca idênticos.",
            Confianca2Titulo = "Tecidos que aguentam",
            Confianca2Texto = "Algodão e linho pré-lavados, forro de sarja e fita de viés feita do mesmo pano. Máquina a 30°, sem drama.",
            Confianca3Titulo = "Envio de Portugal",
            Confianca3TextoModelo = "Expedimos em 2 a 4 dias úteis por CTT, ou pode vir buscar ao ateliê. Grátis acima de {valor}."
        });
    }
}
