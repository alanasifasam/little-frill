namespace Application.Models.ConfiguracaoSite;

public class AtualizarConfiguracaoSiteInputModel
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
}
