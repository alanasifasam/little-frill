using Application.Mapping;
using Application.Models.Produtos;
using Core.Common;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Files;

namespace Application.Services;

// Serviço próprio do admin: separado de IProdutoService (só leitura, serve
// a loja pública) para não misturar mutações de catálogo com o caminho de
// leitura da storefront.
public class ProdutoAdminService : IProdutoAdminService
{
    private readonly IProdutoRepository _produtoRepository;
    private readonly IEncomendaRepository _encomendaRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IArmazenamentoImagens _armazenamentoImagens;

    public ProdutoAdminService(
        IProdutoRepository produtoRepository,
        IEncomendaRepository encomendaRepository,
        IUnitOfWork unitOfWork,
        IArmazenamentoImagens armazenamentoImagens)
    {
        _produtoRepository = produtoRepository;
        _encomendaRepository = encomendaRepository;
        _unitOfWork = unitOfWork;
        _armazenamentoImagens = armazenamentoImagens;
    }

    public async Task<Result<IReadOnlyList<ProdutoAdminViewModel>>> ListarAsync()
    {
        var produtos = await _produtoRepository.ListarParaAdminAsync();
        var vendidasPorProduto = await _encomendaRepository.ObterQuantidadesVendidasPorProdutoAsync();

        var viewModels = produtos
            .Select(p => ProdutoAdminViewModel.FromEntity(p, vendidasPorProduto.GetValueOrDefault(p.Id)))
            .ToList();

        return Result<IReadOnlyList<ProdutoAdminViewModel>>.Ok(viewModels);
    }

    public async Task<Result<ProdutoAdminViewModel>> CriarAsync(ProdutoAdminInputModel input)
    {
        var camposResultado = ValidarCamposReferencia(input);
        if (camposResultado is not null)
            return Result<ProdutoAdminViewModel>.Falha(camposResultado.Erro!, camposResultado.TipoErro);

        var (seccao, padrao, cor) = ObterEnumsValidados(input);

        Produto produto;
        try
        {
            produto = new Produto(
                input.Nome,
                input.Tipo,
                seccao!.Value,
                input.Preco,
                input.Custo,
                padrao!.Value,
                cor!.Value,
                input.Stock,
                input.Medidas ?? string.Empty,
                input.Tecido ?? string.Empty,
                combinaCom: input.Combina);
        }
        catch (ArgumentException ex)
        {
            return Result<ProdutoAdminViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _produtoRepository.AdicionarAsync(produto);
        await _unitOfWork.SaveChangesAsync();

        return Result<ProdutoAdminViewModel>.Ok(ProdutoAdminViewModel.FromEntity(produto, 0));
    }

    public async Task<Result<ProdutoAdminViewModel>> EditarAsync(int id, ProdutoAdminInputModel input)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<ProdutoAdminViewModel>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        var camposResultado = ValidarCamposReferencia(input);
        if (camposResultado is not null)
            return Result<ProdutoAdminViewModel>.Falha(camposResultado.Erro!, camposResultado.TipoErro);

        var (seccao, padrao, cor) = ObterEnumsValidados(input);

        try
        {
            // Sem produto.DefinirStock(input.Stock) aqui de propósito: o
            // corpo do pedido de editar traz o stock que o formulário tinha
            // no momento em que foi aberto — se uma venda ou movimento de
            // stock acontecer entretanto (Stock page, checkout, outra aba),
            // gravar essa foto antiga desfazia-o silenciosamente. Corrigir
            // stock de uma peça já existente é sempre pela página Stock.
            produto.AtualizarDetalhes(
                input.Nome,
                input.Tipo,
                seccao!.Value,
                input.Preco,
                input.Custo,
                padrao!.Value,
                cor!.Value,
                input.Medidas ?? string.Empty,
                input.Tecido ?? string.Empty,
                input.Combina);
        }
        catch (ArgumentException ex)
        {
            return Result<ProdutoAdminViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        var vendidasPorProduto = await _encomendaRepository.ObterQuantidadesVendidasPorProdutoAsync();

        return Result<ProdutoAdminViewModel>.Ok(
            ProdutoAdminViewModel.FromEntity(produto, vendidasPorProduto.GetValueOrDefault(produto.Id)));
    }

    public async Task<Result<ApagarProdutoResultado>> ApagarAsync(int id)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<ApagarProdutoResultado>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        var temEncomendas = await _encomendaRepository.ExisteItemParaProdutoAsync(id);
        if (temEncomendas)
        {
            if (produto.Ativo)
                produto.AlternarAtivo();

            await _unitOfWork.SaveChangesAsync();

            return Result<ApagarProdutoResultado>.Ok(new ApagarProdutoResultado(true, produto.Nome));
        }

        await _produtoRepository.RemoverAsync(produto);
        await _unitOfWork.SaveChangesAsync();

        return Result<ApagarProdutoResultado>.Ok(new ApagarProdutoResultado(false, produto.Nome));
    }

    public async Task<Result<bool>> AlternarAtivoAsync(int id)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<bool>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        produto.AlternarAtivo();
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Ok(produto.Ativo);
    }

    public async Task<Result<bool>> AlternarDestaqueAsync(int id)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<bool>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        produto.AlternarDestaque();
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Ok(produto.Destaque);
    }

    public async Task<Result<bool>> AlternarNovoAsync(int id)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<bool>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        produto.AlternarNovo();
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Ok(produto.Novo);
    }

    public async Task<Result<IReadOnlyList<ProdutoImagemViewModel>>> AdicionarImagensAsync(
        int id,
        IReadOnlyList<(Stream Conteudo, string NomeFicheiro)> ficheiros)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(id);
        if (produto is null)
            return Result<IReadOnlyList<ProdutoImagemViewModel>>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        foreach (var ficheiro in ficheiros)
        {
            var url = await _armazenamentoImagens.GuardarAsync(id, ficheiro.Conteudo, ficheiro.NomeFicheiro);
            produto.AdicionarImagem(url);
        }

        await _unitOfWork.SaveChangesAsync();

        var imagens = produto.Imagens
            .OrderBy(i => i.Ordem)
            .Select(ProdutoImagemViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<ProdutoImagemViewModel>>.Ok(imagens);
    }

    public async Task<Result> RemoverImagemAsync(int produtoId, int imagemId)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(produtoId);
        if (produto is null)
            return Result.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            produto.RemoverImagem(imagemId);
        }
        catch (ArgumentException ex)
        {
            return Result.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result.Ok();
    }

    public async Task<Result<IReadOnlyList<ProdutoImagemViewModel>>> DefinirCapaAsync(int produtoId, int imagemId)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(produtoId);
        if (produto is null)
            return Result<IReadOnlyList<ProdutoImagemViewModel>>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            produto.DefinirCapa(imagemId);
        }
        catch (ArgumentException ex)
        {
            return Result<IReadOnlyList<ProdutoImagemViewModel>>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        var imagens = produto.Imagens
            .OrderBy(i => i.Ordem)
            .Select(ProdutoImagemViewModel.FromEntity)
            .ToList();

        return Result<IReadOnlyList<ProdutoImagemViewModel>>.Ok(imagens);
    }

    public async Task<Result<ProdutoImagemViewModel>> DefinirFocoAsync(int produtoId, int imagemId, decimal focoX, decimal focoY)
    {
        var produto = await _produtoRepository.ObterParaEdicaoAsync(produtoId);
        if (produto is null)
            return Result<ProdutoImagemViewModel>.Falha("Produto não encontrado.", ErrorType.NaoEncontrado);

        try
        {
            produto.DefinirFocoImagem(imagemId, focoX, focoY);
        }
        catch (ArgumentException ex)
        {
            return Result<ProdutoImagemViewModel>.Falha(ex.Message, ErrorType.Validacao);
        }

        await _unitOfWork.SaveChangesAsync();

        return Result<ProdutoImagemViewModel>.Ok(
            ProdutoImagemViewModel.FromEntity(produto.Imagens.First(i => i.Id == imagemId)));
    }

    private static Result? ValidarCamposReferencia(ProdutoAdminInputModel input)
    {
        if (SeccaoMapper.ParseChave(input.Sec) is null)
            return Result.Falha("Secção inválida.", ErrorType.Validacao);

        if (PadraoMapper.ParseChave(input.Padrao) is null)
            return Result.Falha("Padrão inválido.", ErrorType.Validacao);

        if (CorMapper.ParseChave(input.Cor) is null)
            return Result.Falha("Cor inválida.", ErrorType.Validacao);

        return null;
    }

    private static (Seccao? Seccao, Padrao? Padrao, Cor? Cor) ObterEnumsValidados(ProdutoAdminInputModel input)
    {
        return (SeccaoMapper.ParseChave(input.Sec), PadraoMapper.ParseChave(input.Padrao), CorMapper.ParseChave(input.Cor));
    }
}
