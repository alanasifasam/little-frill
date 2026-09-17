using Application.Mapping;
using Core.Entities;

namespace Application.Models.Stock;

public class MovimentoStockViewModel
{
    public DateTime Data { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public int ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public string? Motivo { get; set; }

    public static MovimentoStockViewModel FromEntity(MovimentoStock movimento, string produtoNome)
    {
        return new MovimentoStockViewModel
        {
            Data = movimento.Data,
            Tipo = TipoMovimentoStockMapper.ToChave(movimento.Tipo),
            ProdutoId = movimento.ProdutoId,
            ProdutoNome = produtoNome,
            Quantidade = movimento.Quantidade,
            Motivo = movimento.Motivo is null ? null : MotivoSaidaStockMapper.ToChave(movimento.Motivo.Value)
        };
    }
}
