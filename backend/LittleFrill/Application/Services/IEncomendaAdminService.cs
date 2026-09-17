using Application.Models.Encomendas;
using Core.Common;

namespace Application.Services;

public interface IEncomendaAdminService
{
    Task<Result<IReadOnlyList<EncomendaAdminViewModel>>> ListarAsync();

    Task<Result<EncomendaDetalheViewModel>> ObterDetalheAsync(string referencia);

    Task<Result<EncomendaAdminViewModel>> DefinirRastreioAsync(string referencia, string? codigoRastreio);

    Task<Result<EncomendaAdminViewModel>> DefinirEstadoAsync(string referencia, string estadoChave);

    Task<Result<EncomendaAdminViewModel>> AlternarPagoAsync(string referencia);

    Task<Result<EncomendaAdminViewModel>> AnularAsync(string referencia);

    Task<Result<EncomendaAdminViewModel>> ReabrirAsync(string referencia);

    Task<Result<EncomendaAdminViewModel>> ApagarAsync(string referencia);
}
