using Core.Entities;
using Core.Enums;

namespace Core.Interfaces;

public interface ISeccaoConfigRepository
{
    Task<IReadOnlyList<SeccaoConfig>> ListarAsync();

    Task<SeccaoConfig?> ObterPorSeccaoAsync(Seccao seccao);
}
