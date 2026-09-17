namespace Core.Common;

public class Result<T> : Result
{
    private Result(bool sucesso, T? valor, string? erro, ErrorType tipoErro)
        : base(sucesso, erro, tipoErro)
    {
        Valor = valor;
    }

    public T? Valor { get; }

    public static Result<T> Ok(T valor)
    {
        return new Result<T>(true, valor, null, default);
    }

    public static new Result<T> Falha(string erro, ErrorType tipo)
    {
        return new Result<T>(false, default, erro, tipo);
    }
}
