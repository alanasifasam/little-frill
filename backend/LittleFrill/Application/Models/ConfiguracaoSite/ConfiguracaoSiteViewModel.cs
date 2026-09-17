namespace Application.Models.ConfiguracaoSite;

public class ConfiguracaoSiteViewModel
{
    public string Titulo { get; set; } = string.Empty;
    public string Gancho { get; set; } = string.Empty;
    public decimal EnvioLimiarGratis { get; set; }
    public string HeroEyebrow { get; set; } = string.Empty;
    public string HeroCorpo { get; set; } = string.Empty;
    public string HeroCta1Label { get; set; } = string.Empty;
    public string HeroCta2Label { get; set; } = string.Empty;
    public string HeroImagemLegenda { get; set; } = string.Empty;
    public string Confianca1Titulo { get; set; } = string.Empty;
    public string Confianca1Texto { get; set; } = string.Empty;
    public string Confianca2Titulo { get; set; } = string.Empty;
    public string Confianca2Texto { get; set; } = string.Empty;
    public string Confianca3Titulo { get; set; } = string.Empty;
    public string Confianca3TextoModelo { get; set; } = string.Empty;
    public string? HeroImagemUrl { get; set; }

    public static ConfiguracaoSiteViewModel FromEntity(Core.Entities.ConfiguracaoSite configuracao)
    {
        return new ConfiguracaoSiteViewModel
        {
            Titulo = configuracao.Titulo,
            Gancho = configuracao.Gancho,
            EnvioLimiarGratis = configuracao.EnvioLimiarGratis,
            HeroEyebrow = configuracao.HeroEyebrow,
            HeroCorpo = configuracao.HeroCorpo,
            HeroCta1Label = configuracao.HeroCta1Label,
            HeroCta2Label = configuracao.HeroCta2Label,
            HeroImagemLegenda = configuracao.HeroImagemLegenda,
            Confianca1Titulo = configuracao.Confianca1Titulo,
            Confianca1Texto = configuracao.Confianca1Texto,
            Confianca2Titulo = configuracao.Confianca2Titulo,
            Confianca2Texto = configuracao.Confianca2Texto,
            Confianca3Titulo = configuracao.Confianca3Titulo,
            Confianca3TextoModelo = configuracao.Confianca3TextoModelo,
            HeroImagemUrl = configuracao.HeroImagemUrl
        };
    }
}
