using Application.Models.Clientes;
using Core.Common;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Auth;

namespace Application.Services;

// Serviço próprio do admin de Clientes: não existe uma entidade "Cliente"
// separada — um cliente é sempre um Utilizador com Role.Cliente. Este
// serviço orquestra o mesmo IUtilizadorRepository que o AuthService usa
// para login/registo da loja, mas nunca gera tokens nem verifica
// palavras-passe — é um CRUD administrativo, não um fluxo de autenticação.
public class ClienteAdminService : IClienteAdminService
{
    private readonly IUtilizadorRepository _utilizadorRepository;
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public ClienteAdminService(
        IUtilizadorRepository utilizadorRepository,
        IEncomendaRepository encomendaRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher)
    {
        _utilizadorRepository = utilizadorRepository;
        _encomendaRepository = encomendaRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result<IReadOnlyList<ClienteAdminViewModel>>> ListarAsync()
    {
        var clientes = await _utilizadorRepository.ListarClientesAsync();
        var contagemEGastoPorUtilizador = await _encomendaRepository.ObterContagemEGastoPorUtilizadorAsync();

        var viewModels = clientes
            .Select(c =>
            {
                var (nEncomendas, gasto) = contagemEGastoPorUtilizador.GetValueOrDefault(c.Id);
                return ClienteAdminViewModel.FromEntity(c, nEncomendas, gasto);
            })
            .ToList();

        return Result<IReadOnlyList<ClienteAdminViewModel>>.Ok(viewModels);
    }

    public async Task<Result<ClienteAdminViewModel>> CriarAsync(ClienteAdminInputModel input)
    {
        if (await _utilizadorRepository.ExisteEmailAsync(input.Email))
            return Result<ClienteAdminViewModel>.Falha("Já existe uma conta com este email.", ErrorType.Conflito);

        // Cliente criado pelo admin, sem intenção de login na loja: gera-se
        // uma password aleatória cujo hash fica guardado mas que ninguém
        // conhece (mesmo espírito do comentário em Utilizador.CriarAdmin) —
        // se um dia o cliente quiser entrar na conta, usa "recuperar
        // password", nunca esta.
        var passwordHash = _passwordHasher.Hash(Guid.NewGuid().ToString("N"));

        Utilizador utilizador;
        try
        {
            utilizador = new Utilizador(
                input.Nome,
                input.Sobrenome,
                input.Email,
                passwordHash,
                input.Cp,
                input.Localidade,
                querCarta: false,
                telefone: input.Telefone);
        }
        catch (ArgumentException ex)
        {
            return Result<ClienteAdminViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _utilizadorRepository.AdicionarAsync(utilizador);
        await _unitOfWork.SaveChangesAsync();

        return Result<ClienteAdminViewModel>.Ok(ClienteAdminViewModel.FromEntity(utilizador, 0, 0m));
    }

    public async Task<Result<ClienteAdminViewModel>> EditarAsync(int id, ClienteAdminInputModel input)
    {
        var utilizador = await _utilizadorRepository.ObterParaEdicaoAsync(id);
        if (utilizador is null)
            return Result<ClienteAdminViewModel>.Falha("Cliente não encontrado.", ErrorType.NaoEncontrado);

        if (await _utilizadorRepository.ExisteEmailAsync(input.Email, id))
            return Result<ClienteAdminViewModel>.Falha("Já existe uma conta com este email.", ErrorType.Conflito);

        try
        {
            utilizador.AtualizarDetalhes(
                input.Nome,
                input.Sobrenome,
                input.Email,
                input.Telefone,
                input.Cp,
                input.Localidade);
        }
        catch (ArgumentException ex)
        {
            return Result<ClienteAdminViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        var contagemEGastoPorUtilizador = await _encomendaRepository.ObterContagemEGastoPorUtilizadorAsync();
        var (nEncomendas, gasto) = contagemEGastoPorUtilizador.GetValueOrDefault(utilizador.Id);

        return Result<ClienteAdminViewModel>.Ok(ClienteAdminViewModel.FromEntity(utilizador, nEncomendas, gasto));
    }

    public async Task<Result<ApagarClienteResultado>> ApagarAsync(int id)
    {
        var utilizador = await _utilizadorRepository.ObterParaEdicaoAsync(id);
        if (utilizador is null)
            return Result<ApagarClienteResultado>.Falha("Cliente não encontrado.", ErrorType.NaoEncontrado);

        var temEncomendas = await _encomendaRepository.ExisteEncomendaParaUtilizadorAsync(id);
        if (temEncomendas)
            return Result<ApagarClienteResultado>.Ok(new ApagarClienteResultado(false, utilizador.Nome));

        await _utilizadorRepository.RemoverAsync(utilizador);
        await _unitOfWork.SaveChangesAsync();

        return Result<ApagarClienteResultado>.Ok(new ApagarClienteResultado(true, utilizador.Nome));
    }
}
