using Core.Common;
using Microsoft.AspNetCore.Mvc;

namespace Api.Common;

public static class ResultExtensions
{
    public static IActionResult ToActionResult<T>(this Result<T> result, ControllerBase controller)
    {
        if (result.Sucesso)
        {
            return controller.Ok(result.Valor);
        }

        return ToErrorActionResult(result, controller);
    }

    // Variante sem valor de retorno (ex.: RemoverAsync) — sucesso devolve
    // 204, sem corpo.
    public static IActionResult ToActionResult(this Result result, ControllerBase controller)
    {
        if (result.Sucesso)
        {
            return controller.NoContent();
        }

        return ToErrorActionResult(result, controller);
    }

    private static IActionResult ToErrorActionResult(Result result, ControllerBase controller)
    {
        return result.TipoErro switch
        {
            ErrorType.Validacao => controller.BadRequest(new { error = result.Erro }),
            ErrorType.NaoEncontrado => controller.NotFound(new { error = result.Erro }),
            ErrorType.Conflito => controller.Conflict(new { error = result.Erro }),
            ErrorType.NaoAutorizado => controller.Unauthorized(new { error = result.Erro }),
            _ => controller.StatusCode(StatusCodes.Status500InternalServerError, new { error = result.Erro })
        };
    }
}
