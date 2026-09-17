using Core.Entities;

namespace Core.Interfaces;

public interface IUtilizadorRepository
{
    Task<Utilizador?> ObterPorEmailAsync(string email);

    Task<Utilizador?> ObterPorIdAsync(int id);

    Task AdicionarAsync(Utilizador utilizador);

    Task<bool> ExisteEmailAsync(string email);

    // Overload usado nas edições do admin de Clientes: exclui o próprio
    // registo do cliente a editar, para não rejeitar o email atual dele
    // como "já existente". O overload de um argumento acima fica intocado
    // — AuthService.RegistoAsync continua a usá-lo sem id nenhum a excluir.
    Task<bool> ExisteEmailAsync(string email, int idExcluido);

    Task<bool> ExisteAdminAsync();

    // Só Role.Cliente, ordenado por Nome — alimenta a tabela admin de
    // Clientes. AsNoTracking(): é um caminho de leitura.
    Task<IReadOnlyList<Utilizador>> ListarClientesAsync();

    // Tracked de propósito, mesma razão de ProdutoRepository.ObterParaEdicaoAsync
    // — serve os fluxos de escrita do admin (PUT/DELETE), que mutam a
    // entidade e dependem do DbContext estar a trackeá-la para o
    // SaveChangesAsync() persistir a alteração.
    Task<Utilizador?> ObterParaEdicaoAsync(int id);

    Task RemoverAsync(Utilizador utilizador);
}
