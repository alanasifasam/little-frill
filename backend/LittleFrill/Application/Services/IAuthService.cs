using Application.Models.Auth;
using Core.Common;

namespace Application.Services;

public interface IAuthService
{
    Task<Result<AuthViewModel>> LoginAsync(LoginInputModel input);

    Task<Result<AuthViewModel>> RegistoAsync(RegistoInputModel input);
}
