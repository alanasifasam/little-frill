namespace Core.Common;

public class Result
{
    protected Result(bool sucesso, string? erro, ErrorType tipoErro)
    {
        Sucesso = sucesso;
        Erro = erro;
        TipoErro = tipoErro;
    }

    public bool Sucesso { get; }
    public string? Erro { get; }
    public ErrorType TipoErro { get; }

    public static Result Ok()
    {
        return new Result(true, null, default);
    }

    public static Result Falha(string erro, ErrorType tipo)
    {
        return new Result(false, erro, tipo);
    }
}
