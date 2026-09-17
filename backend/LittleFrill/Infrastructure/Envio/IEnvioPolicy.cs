namespace Infrastructure.Envio;

public interface IEnvioPolicy
{
    decimal CustoPadrao { get; }

    Task<decimal> ObterLimiarGratisAsync();
}
