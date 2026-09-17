using Core.Entities;

namespace Core.Interfaces;

public interface IConfiguracaoNegocioRepository
{
    // Devolve sempre a linha única (Id = 1, semeada por HasData), tracked —
    // mesmo espírito de IProdutoRepository.ObterParaEdicaoAsync: permite
    // editar e persistir no mesmo pedido. Nunca é null.
    Task<ConfiguracaoNegocio> ObterAsync();
}
