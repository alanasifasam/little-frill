using Application.Mapping;
using Application.Models.Auth;
using Core.Common;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Auth;

namespace Application.Services;

public class AuthService : IAuthService
{
    private const string CredenciaisInvalidas = "Email ou palavra-passe inválidos.";

    private readonly IUtilizadorRepository _utilizadorRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUtilizadorRepository utilizadorRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _utilizadorRepository = utilizadorRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<AuthViewModel>> LoginAsync(LoginInputModel input)
    {
        if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.PalavraPasse))
            return Result<AuthViewModel>.Falha("Email e palavra-passe são obrigatórios.", ErrorType.Validacao);

        var utilizador = await _utilizadorRepository.ObterPorEmailAsync(input.Email);
        if (utilizador is null || !_passwordHasher.Verificar(utilizador.PasswordHash, input.PalavraPasse))
            return Result<AuthViewModel>.Falha(CredenciaisInvalidas, ErrorType.NaoAutorizado);

        var token = _jwtTokenGenerator.Gerar(utilizador);

        return Result<AuthViewModel>.Ok(new AuthViewModel(token, utilizador.Nome, utilizador.Email, RoleMapper.ToChave(utilizador.Role)));
    }

    public async Task<Result<AuthViewModel>> RegistoAsync(RegistoInputModel input)
    {
        if (await _utilizadorRepository.ExisteEmailAsync(input.Email))
            return Result<AuthViewModel>.Falha("Já existe uma conta com este email.", ErrorType.Conflito);

        var passwordHash = _passwordHasher.Hash(input.PalavraPasse);

        Utilizador utilizador;
        try
        {
            utilizador = new Utilizador(
                input.Nome,
                input.Sobrenome,
                input.Email,
                passwordHash,
                input.CodigoPostal,
                input.Distrito,
                input.QuerCarta ?? false);
        }
        catch (ArgumentException ex)
        {
            return Result<AuthViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _utilizadorRepository.AdicionarAsync(utilizador);
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtTokenGenerator.Gerar(utilizador);

        return Result<AuthViewModel>.Ok(new AuthViewModel(token, utilizador.Nome, utilizador.Email, RoleMapper.ToChave(utilizador.Role)));
    }
}
