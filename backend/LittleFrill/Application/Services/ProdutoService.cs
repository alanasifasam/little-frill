using Application.Mapping;
using Application.Models.Produtos;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;

namespace Application.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _produtoRepository;
    private readonly ISeccaoConfigRepository _seccaoConfigRepository;

    public ProdutoService(IProdutoRepository produtoRepository, ISeccaoConfigRepository seccaoConfigRepository)
    {
        _produtoRepository = produtoRepository;
        _seccaoConfigRepository = seccaoConfigRepository;
    }

    public async Task<Result<IReadOnlyList<ProdutoViewModel>>> ListarAsync(ProdutoFiltroInputModel filtro)
    {
        Seccao? seccao = null;
        if (!string.IsNullOrWhiteSpace(filtro.Sec))
        {
            seccao = SeccaoMapper.ParseChave(filtro.Sec);
            if (seccao is null)
                return Result<IReadOnlyList<ProdutoViewModel>>.Falha("Secção inválida.", ErrorType.Validacao);
        }

        Padrao? padrao = null;
        if (!string.IsNullOrWhiteSpace(filtro.Padrao))
        {
            padrao = PadraoMapper.ParseChave(filtro.Padrao);
            if (padrao is null)
                return Result<IReadOnlyList<ProdutoViewModel>>.Falha("Padrão inválido.", ErrorType.Validacao);
        }

        Cor? cor = null;
        if (!string.IsNullOrWhiteSpace(filtro.Cor))
        {
            cor = CorMapper.ParseChave(filtro.Cor);
            if (cor is null)
                return Result<IReadOnlyList<ProdutoViewModel>>.Falha("Cor inválida.", ErrorType.Validacao);
        }

        var seccoesConfig = await _seccaoConfigRepository.ListarAsync();
        var seccoesAtivas = seccoesConfig.Where(s => s.Ativa).Select(s => s.Seccao).ToList();

        var produtos = await _produtoRepository.ListarAsync(seccao, padrao, cor, filtro.PrecoMax, filtro.SoStock, filtro.Destaque, filtro.Nova, seccoesAtivas);

        var ordenados = OrdenarPorCriterio(produtos, filtro.Ordenar);

        var viewModels = ordenados.Select(ProdutoViewModel.FromEntity).ToList();

        return Result<IReadOnlyList<ProdutoViewModel>>.Ok(viewModels);
    }

    public async Task<Result<ProdutoViewModel>> ObterPorIdAsync(int id)
    {
        var produto = await _produtoRepository.ObterPorIdAsync(id);
        if (produto is null)
            return Result<ProdutoViewModel>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        return Result<ProdutoViewModel>.Ok(ProdutoViewModel.FromEntity(produto));
    }

    private static IReadOnlyList<Produto> OrdenarPorCriterio(IReadOnlyList<Produto> produtos, string? ordenar)
    {
        return ordenar switch
        {
            "baratos" => produtos.OrderBy(p => p.Preco).ToList(),
            "caros" => produtos.OrderByDescending(p => p.Preco).ToList(),
            "nome" => produtos.OrderBy(p => p.Nome, StringComparer.CurrentCulture).ToList(),
            _ => produtos
        };
    }
}
