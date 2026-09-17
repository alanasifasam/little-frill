namespace Infrastructure.Files;

public interface IArmazenamentoImagens
{
    /// <summary>
    /// Guarda o ficheiro de imagem de um produto e devolve o URL relativo
    /// para o aceder (servido por app.UseStaticFiles() a partir de
    /// Api/wwwroot).
    /// </summary>
    Task<string> GuardarAsync(int produtoId, Stream conteudo, string nomeFicheiro);

    /// <summary>
    /// Guarda o ficheiro de imagem do Hero da homepage e devolve o URL
    /// relativo para o aceder (servido por app.UseStaticFiles() a partir de
    /// Api/wwwroot).
    /// </summary>
    Task<string> GuardarImagemSiteAsync(Stream conteudo, string nomeFicheiro);
}
