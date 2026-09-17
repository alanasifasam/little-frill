using Application.Models.Clientes;
using Core.Common;

namespace Application.Services;

public interface IClienteAdminService
{
    Task<Result<IReadOnlyList<ClienteAdminViewModel>>> ListarAsync();

    Task<Result<ClienteAdminViewModel>> CriarAsync(ClienteAdminInputModel input);

    Task<Result<ClienteAdminViewModel>> EditarAsync(int id, ClienteAdminInputModel input);

    Task<Result<ApagarClienteResultado>> ApagarAsync(int id);
}
