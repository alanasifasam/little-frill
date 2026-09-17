namespace Core.Entities;

// Singleton persistido: só existe UMA linha (Id = 1, semeada em
// ConfiguracaoSiteConfiguration). Guarda conteúdo/config do site público
// (textos do Hero, limiar de envio grátis mostrado ao cliente) — separado de
// ConfiguracaoNegocio, que são parâmetros financeiros internos do Painel.
public class ConfiguracaoSite
{
    protected ConfiguracaoSite()
    {
    }

    public ConfiguracaoSite(
        string titulo,
        string gancho,
        decimal envioLimiarGratis,
        string heroEyebrow,
        string heroCorpo,
        string heroCta1Label,
        string heroCta2Label,
        string heroImagemLegenda,
        string confianca1Titulo,
        string confianca1Texto,
        string confianca2Titulo,
        string confianca2Texto,
        string confianca3Titulo,
        string confianca3TextoModelo)
    {
        if (string.IsNullOrWhiteSpace(titulo))
            throw new ArgumentException("Título é obrigatório.", nameof(titulo));

        if (string.IsNullOrWhiteSpace(gancho))
            throw new ArgumentException("Gancho é obrigatório.", nameof(gancho));

        if (envioLimiarGratis < 0)
            throw new ArgumentException("Limiar de envio grátis não pode ser negativo.", nameof(envioLimiarGratis));

        if (string.IsNullOrWhiteSpace(heroEyebrow))
            throw new ArgumentException("Eyebrow do Hero é obrigatório.", nameof(heroEyebrow));

        if (string.IsNullOrWhiteSpace(heroCorpo))
            throw new ArgumentException("Corpo do Hero é obrigatório.", nameof(heroCorpo));

        if (string.IsNullOrWhiteSpace(heroCta1Label))
            throw new ArgumentException("Label do primeiro CTA do Hero é obrigatório.", nameof(heroCta1Label));

        if (string.IsNullOrWhiteSpace(heroCta2Label))
            throw new ArgumentException("Label do segundo CTA do Hero é obrigatório.", nameof(heroCta2Label));

        if (string.IsNullOrWhiteSpace(heroImagemLegenda))
            throw new ArgumentException("Legenda da imagem do Hero é obrigatória.", nameof(heroImagemLegenda));

        if (string.IsNullOrWhiteSpace(confianca1Titulo))
            throw new ArgumentException("Título da 1.ª coluna de confiança é obrigatório.", nameof(confianca1Titulo));

        if (string.IsNullOrWhiteSpace(confianca1Texto))
            throw new ArgumentException("Texto da 1.ª coluna de confiança é obrigatório.", nameof(confianca1Texto));

        if (string.IsNullOrWhiteSpace(confianca2Titulo))
            throw new ArgumentException("Título da 2.ª coluna de confiança é obrigatório.", nameof(confianca2Titulo));

        if (string.IsNullOrWhiteSpace(confianca2Texto))
            throw new ArgumentException("Texto da 2.ª coluna de confiança é obrigatório.", nameof(confianca2Texto));

        if (string.IsNullOrWhiteSpace(confianca3Titulo))
            throw new ArgumentException("Título da 3.ª coluna de confiança é obrigatório.", nameof(confianca3Titulo));

        if (string.IsNullOrWhiteSpace(confianca3TextoModelo))
            throw new ArgumentException("Modelo de texto da 3.ª coluna de confiança é obrigatório.", nameof(confianca3TextoModelo));

        Titulo = titulo;
        Gancho = gancho;
        EnvioLimiarGratis = envioLimiarGratis;
        HeroEyebrow = heroEyebrow;
        HeroCorpo = heroCorpo;
        HeroCta1Label = heroCta1Label;
        HeroCta2Label = heroCta2Label;
        HeroImagemLegenda = heroImagemLegenda;
        Confianca1Titulo = confianca1Titulo;
        Confianca1Texto = confianca1Texto;
        Confianca2Titulo = confianca2Titulo;
        Confianca2Texto = confianca2Texto;
        Confianca3Titulo = confianca3Titulo;
        Confianca3TextoModelo = confianca3TextoModelo;
    }

    public int Id { get; private set; }
    public string Titulo { get; private set; } = string.Empty;
    public string Gancho { get; private set; } = string.Empty;
    public decimal EnvioLimiarGratis { get; private set; }
    public string HeroEyebrow { get; private set; } = string.Empty;
    public string HeroCorpo { get; private set; } = string.Empty;
    public string HeroCta1Label { get; private set; } = string.Empty;
    public string HeroCta2Label { get; private set; } = string.Empty;
    public string HeroImagemLegenda { get; private set; } = string.Empty;
    public string Confianca1Titulo { get; private set; } = string.Empty;
    public string Confianca1Texto { get; private set; } = string.Empty;
    public string Confianca2Titulo { get; private set; } = string.Empty;
    public string Confianca2Texto { get; private set; } = string.Empty;
    public string Confianca3Titulo { get; private set; } = string.Empty;
    public string Confianca3TextoModelo { get; private set; } = string.Empty;
    public string? HeroImagemUrl { get; private set; }

    public void DefinirTextos(string titulo, string gancho)
    {
        if (string.IsNullOrWhiteSpace(titulo))
            throw new ArgumentException("Título é obrigatório.", nameof(titulo));

        if (string.IsNullOrWhiteSpace(gancho))
            throw new ArgumentException("Gancho é obrigatório.", nameof(gancho));

        Titulo = titulo;
        Gancho = gancho;
    }

    public void DefinirEnvioLimiarGratis(decimal limiar)
    {
        if (limiar < 0)
            throw new ArgumentException("Limiar de envio grátis não pode ser negativo.", nameof(limiar));

        EnvioLimiarGratis = limiar;
    }

    public void DefinirConteudoHome(
        string heroEyebrow,
        string heroCorpo,
        string heroCta1Label,
        string heroCta2Label,
        string heroImagemLegenda,
        string confianca1Titulo,
        string confianca1Texto,
        string confianca2Titulo,
        string confianca2Texto,
        string confianca3Titulo,
        string confianca3TextoModelo)
    {
        if (string.IsNullOrWhiteSpace(heroEyebrow))
            throw new ArgumentException("Eyebrow do Hero é obrigatório.", nameof(heroEyebrow));

        if (string.IsNullOrWhiteSpace(heroCorpo))
            throw new ArgumentException("Corpo do Hero é obrigatório.", nameof(heroCorpo));

        if (string.IsNullOrWhiteSpace(heroCta1Label))
            throw new ArgumentException("Label do primeiro CTA do Hero é obrigatório.", nameof(heroCta1Label));

        if (string.IsNullOrWhiteSpace(heroCta2Label))
            throw new ArgumentException("Label do segundo CTA do Hero é obrigatório.", nameof(heroCta2Label));

        if (string.IsNullOrWhiteSpace(heroImagemLegenda))
            throw new ArgumentException("Legenda da imagem do Hero é obrigatória.", nameof(heroImagemLegenda));

        if (string.IsNullOrWhiteSpace(confianca1Titulo))
            throw new ArgumentException("Título da 1.ª coluna de confiança é obrigatório.", nameof(confianca1Titulo));

        if (string.IsNullOrWhiteSpace(confianca1Texto))
            throw new ArgumentException("Texto da 1.ª coluna de confiança é obrigatório.", nameof(confianca1Texto));

        if (string.IsNullOrWhiteSpace(confianca2Titulo))
            throw new ArgumentException("Título da 2.ª coluna de confiança é obrigatório.", nameof(confianca2Titulo));

        if (string.IsNullOrWhiteSpace(confianca2Texto))
            throw new ArgumentException("Texto da 2.ª coluna de confiança é obrigatório.", nameof(confianca2Texto));

        if (string.IsNullOrWhiteSpace(confianca3Titulo))
            throw new ArgumentException("Título da 3.ª coluna de confiança é obrigatório.", nameof(confianca3Titulo));

        if (string.IsNullOrWhiteSpace(confianca3TextoModelo))
            throw new ArgumentException("Modelo de texto da 3.ª coluna de confiança é obrigatório.", nameof(confianca3TextoModelo));

        HeroEyebrow = heroEyebrow;
        HeroCorpo = heroCorpo;
        HeroCta1Label = heroCta1Label;
        HeroCta2Label = heroCta2Label;
        HeroImagemLegenda = heroImagemLegenda;
        Confianca1Titulo = confianca1Titulo;
        Confianca1Texto = confianca1Texto;
        Confianca2Titulo = confianca2Titulo;
        Confianca2Texto = confianca2Texto;
        Confianca3Titulo = confianca3Titulo;
        Confianca3TextoModelo = confianca3TextoModelo;
    }

    public void DefinirImagemHero(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("URL da imagem é obrigatório.", nameof(url));

        HeroImagemUrl = url;
    }
}
