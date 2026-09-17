namespace Infrastructure.Files;

/// <summary>
/// Guarda as imagens de produto em disco local, dentro de Api/wwwroot.
/// Escala do projeto não justifica um provider de blob storage agora — só
/// esta classe conhece o disco, por isso fica fácil de trocar depois.
/// </summary>
public class ArmazenamentoImagensLocal : IArmazenamentoImagens
{
    private const string PastaRelativa = "uploads/produtos";
    private const string PastaRelativaSite = "uploads/site";

    private readonly string _wwwrootPath;

    public ArmazenamentoImagensLocal(string wwwrootPath)
    {
        _wwwrootPath = wwwrootPath;
    }

    public async Task<string> GuardarAsync(int produtoId, Stream conteudo, string nomeFicheiro)
    {
        var extensao = Path.GetExtension(nomeFicheiro);
        var nomeGuardado = $"{produtoId}-{Guid.NewGuid():N}{extensao}";

        var pastaDestino = Path.Combine(_wwwrootPath, PastaRelativa.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(pastaDestino);

        var caminhoCompleto = Path.Combine(pastaDestino, nomeGuardado);

        await using (var ficheiroDestino = File.Create(caminhoCompleto))
        {
            await conteudo.CopyToAsync(ficheiroDestino);
        }

        return $"/{PastaRelativa}/{nomeGuardado}";
    }

    public async Task<string> GuardarImagemSiteAsync(Stream conteudo, string nomeFicheiro)
    {
        var extensao = Path.GetExtension(nomeFicheiro);
        var nomeGuardado = $"hero-{Guid.NewGuid():N}{extensao}";

        var pastaDestino = Path.Combine(_wwwrootPath, PastaRelativaSite.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(pastaDestino);

        var caminhoCompleto = Path.Combine(pastaDestino, nomeGuardado);

        await using (var ficheiroDestino = File.Create(caminhoCompleto))
        {
            await conteudo.CopyToAsync(ficheiroDestino);
        }

        return $"/{PastaRelativaSite}/{nomeGuardado}";
    }
}
