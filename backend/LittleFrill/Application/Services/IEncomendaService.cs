using Application.Models.Encomendas;
using Core.Common;

namespace Application.Services;

public interface IEncomendaService
{
    Task<Result<EncomendaConfirmadaViewModel>> CriarAsync(int utilizadorId, EncomendaInputModel input);

    Task<Result<IReadOnlyList<EncomendaResumoViewModel>>> ListarPorUtilizadorAsync(int utilizadorId);

    Task<Result<EncomendaDetalheViewModel>> ObterDetalheAsync(int utilizadorId, string referencia);
}
