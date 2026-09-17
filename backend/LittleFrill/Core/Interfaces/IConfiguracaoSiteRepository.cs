using Core.Entities;

namespace Core.Interfaces;

public interface IConfiguracaoSiteRepository
{
    // Devolve sempre a linha única (Id = 1, semeada por HasData), tracked —
    // mesmo espírito de IConfiguracaoNegocioRepository.ObterAsync: permite
    // editar e persistir no mesmo pedido. Nunca é null.
    Task<ConfiguracaoSite> ObterAsync();
}
