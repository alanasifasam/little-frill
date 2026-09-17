using Core.Entities;
using Core.Enums;

namespace Core.Interfaces;

public interface IMetodoPagamentoConfigRepository
{
    Task<IReadOnlyList<MetodoPagamentoConfig>> ListarAsync();

    Task<MetodoPagamentoConfig?> ObterPorMetodoAsync(MetodoPagamento metodo);
}
