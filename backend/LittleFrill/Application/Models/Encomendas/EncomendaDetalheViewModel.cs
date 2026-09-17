using Application.Mapping;
using Core.Entities;

namespace Application.Models.Encomendas;

public class EncomendaItemDetalheViewModel
{
    public int ProdutoId { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    public decimal PrecoUnitario { get; set; }
    public int Quantidade { get; set; }
    public decimal Subtotal { get; set; }
    public string? Padrao { get; set; }
    public string? Cor { get; set; }
    public string? ImagemUrl { get; set; }
    public decimal ImagemFocoX { get; set; }
    public decimal ImagemFocoY { get; set; }

    // produto pode ser null: o produto referenciado pode ter sido apagado
    // depois da encomenda ter sido feita. Nesse caso os dados de catálogo
    // (padrão, cor, imagem) ficam por preencher — o essencial da linha
    // (nome, preço, quantidade, subtotal) já está gravado na própria
    // EncomendaItem e não depende do produto continuar a existir.
    public static EncomendaItemDetalheViewModel FromEntity(EncomendaItem item, Produto? produto)
    {
        var capa = produto?.Imagens.OrderBy(i => i.Ordem).FirstOrDefault();

        return new EncomendaItemDetalheViewModel
        {
            ProdutoId = item.ProdutoId,
            NomeProduto = item.NomeProduto,
            PrecoUnitario = item.PrecoUnitario,
            Quantidade = item.Quantidade,
            Subtotal = item.Subtotal,
            Padrao = produto is not null ? PadraoMapper.ToChave(produto.Padrao) : null,
            Cor = produto is not null ? CorMapper.ToChave(produto.Cor) : null,
            ImagemUrl = capa?.Url,
            ImagemFocoX = capa?.FocoX ?? 50m,
            ImagemFocoY = capa?.FocoY ?? 50m
        };
    }
}

public class EnderecoViewModel
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Morada { get; set; } = string.Empty;
    public string? AndarPorta { get; set; }
    public string CodigoPostal { get; set; } = string.Empty;
    public string Localidade { get; set; } = string.Empty;
    public string Distrito { get; set; } = string.Empty;
    public string Pais { get; set; } = "PT";
    public string? Notas { get; set; }

    public static EnderecoViewModel FromEntity(Endereco endereco)
    {
        return new EnderecoViewModel
        {
            Nome = endereco.Nome,
            Email = endereco.Email,
            Telefone = endereco.Telefone,
            Morada = endereco.Morada,
            AndarPorta = endereco.AndarPorta,
            CodigoPostal = endereco.CodigoPostal,
            Localidade = endereco.Localidade,
            Distrito = endereco.Distrito,
            Pais = endereco.Pais,
            Notas = endereco.Notas
        };
    }
}

public class EncomendaDetalheViewModel
{
    public string Referencia { get; set; } = string.Empty;
    public DateTime Criada { get; set; }
    public int? ClienteId { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public List<EncomendaItemDetalheViewModel> Itens { get; set; } = new();
    // Nullable: uma venda de balcão (Encomenda.CriarBalcao) não tem morada
    // de entrega. Este detalhe só é consultado por utilizador autenticado
    // (ObterPorReferenciaEUtilizadorAsync), e vendas de balcão não têm
    // utilizador associado — na prática nunca chega null aqui, mas o tipo
    // reflete a possibilidade tal como a entidade.
    public EnderecoViewModel? Entrega { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Envio { get; set; }
    public decimal Total { get; set; }
    public DateTime? DataEmProducao { get; set; }
    public DateTime? DataEmbalada { get; set; }
    public DateTime? DataEnviada { get; set; }
    public DateTime? DataEntregue { get; set; }
    public string? CodigoRastreio { get; set; }
    public bool Pago { get; set; }

    public static EncomendaDetalheViewModel FromEntity(Encomenda encomenda, IReadOnlyDictionary<int, Produto> produtosPorId)
    {
        return new EncomendaDetalheViewModel
        {
            Referencia = encomenda.Referencia,
            Criada = encomenda.Criada,
            ClienteId = encomenda.UtilizadorId,
            ClienteNome = encomenda.Utilizador is not null
                ? $"{encomenda.Utilizador.Nome} {encomenda.Utilizador.Sobrenome}"
                : "Sem conta",
            Estado = EstadoEncomendaMapper.ToChave(encomenda.Estado),
            Itens = encomenda.Itens
                .Select(item =>
                {
                    produtosPorId.TryGetValue(item.ProdutoId, out var produto);
                    return EncomendaItemDetalheViewModel.FromEntity(item, produto);
                })
                .ToList(),
            Entrega = encomenda.Entrega is null ? null : EnderecoViewModel.FromEntity(encomenda.Entrega),
            Subtotal = encomenda.Subtotal,
            Envio = encomenda.Envio,
            Total = encomenda.Total,
            DataEmProducao = encomenda.DataEmProducao,
            DataEmbalada = encomenda.DataEmbalada,
            DataEnviada = encomenda.DataEnviada,
            DataEntregue = encomenda.DataEntregue,
            CodigoRastreio = encomenda.CodigoRastreio,
            Pago = encomenda.Pago
        };
    }
}
