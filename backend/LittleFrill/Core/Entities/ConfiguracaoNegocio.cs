namespace Core.Entities;

// Singleton persistido: só existe UMA linha (Id = 1, semeada em
// ConfiguracaoNegocioConfiguration). Guarda os parâmetros de negócio que o
// dashboard do Painel usa nos cálculos financeiros e que o admin pode ajustar
// mais tarde a partir da UI, em vez de ficarem fixos em código.
public class ConfiguracaoNegocio
{
    protected ConfiguracaoNegocio()
    {
    }

    public ConfiguracaoNegocio(decimal metaMes, decimal envioRealCtt, bool feriasLigadas)
    {
        if (metaMes < 0)
            throw new ArgumentException("Meta do mês não pode ser negativa.", nameof(metaMes));

        if (envioRealCtt < 0)
            throw new ArgumentException("Custo real do envio CTT não pode ser negativo.", nameof(envioRealCtt));

        MetaMes = metaMes;
        EnvioRealCtt = envioRealCtt;
        FeriasLigadas = feriasLigadas;
    }

    public int Id { get; private set; }
    public decimal MetaMes { get; private set; }
    public decimal EnvioRealCtt { get; private set; }
    public bool FeriasLigadas { get; private set; }

    public void AtualizarMeta(decimal metaMes)
    {
        if (metaMes < 0)
            throw new ArgumentException("Meta do mês não pode ser negativa.", nameof(metaMes));

        MetaMes = metaMes;
    }

    public void AtualizarEnvioReal(decimal envioRealCtt)
    {
        if (envioRealCtt < 0)
            throw new ArgumentException("Custo real do envio CTT não pode ser negativo.", nameof(envioRealCtt));

        EnvioRealCtt = envioRealCtt;
    }

    public void DefinirFerias(bool ligado)
    {
        FeriasLigadas = ligado;
    }
}
