using Core.Enums;

namespace Core.Entities;

public class MovimentoStock
{
    protected MovimentoStock()
    {
    }

    public MovimentoStock(int produtoId, TipoMovimentoStock tipo, int quantidade, MotivoSaidaStock? motivo)
    {
        if (produtoId <= 0)
            throw new ArgumentException("Produto é obrigatório.", nameof(produtoId));

        if (quantidade <= 0)
            throw new ArgumentException("Quantidade tem de ser superior a zero.", nameof(quantidade));

        if (tipo == TipoMovimentoStock.Saida && motivo is null)
            throw new ArgumentException("Motivo é obrigatório numa saída.", nameof(motivo));

        if (tipo == TipoMovimentoStock.Entrada && motivo is not null)
            throw new ArgumentException("Motivo só é permitido numa saída.", nameof(motivo));

        ProdutoId = produtoId;
        Tipo = tipo;
        Quantidade = quantidade;
        Motivo = motivo;
        Data = DateTime.UtcNow;
    }

    public int Id { get; private set; }
    public int ProdutoId { get; private set; }
    public TipoMovimentoStock Tipo { get; private set; }
    public int Quantidade { get; private set; }
    public MotivoSaidaStock? Motivo { get; private set; }
    public DateTime Data { get; private set; }
}
