namespace Application.Models.ConfiguracaoNegocio;

public class ConfiguracaoNegocioViewModel
{
    public decimal MetaMes { get; set; }
    public decimal EnvioRealCtt { get; set; }
    public bool FeriasLigadas { get; set; }

    public static ConfiguracaoNegocioViewModel FromEntity(Core.Entities.ConfiguracaoNegocio configuracao)
    {
        return new ConfiguracaoNegocioViewModel
        {
            MetaMes = configuracao.MetaMes,
            EnvioRealCtt = configuracao.EnvioRealCtt,
            FeriasLigadas = configuracao.FeriasLigadas
        };
    }
}
