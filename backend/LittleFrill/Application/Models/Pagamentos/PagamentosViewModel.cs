namespace Application.Models.Pagamentos;

public class MetodoLinhaViewModel
{
    public string Metodo { get; set; } = "";
    public bool Ativo { get; set; }
    public decimal TaxaPercent { get; set; }
    public decimal CustoFixo { get; set; }
    public string? Iban { get; set; }
    public string? NumeroMbway { get; set; }
    public string Nota { get; set; } = "";
    public int Usos { get; set; }
    public decimal Valor { get; set; }
    public int BarraPct { get; set; }
}

public class TransacaoLinhaViewModel
{
    public string Ref { get; set; } = "";
    public int Dia { get; set; }
    public string ClienteNome { get; set; } = "";
    public string Metodo { get; set; } = "";
    public decimal Total { get; set; }
    public bool Anulada { get; set; }
    public bool Pago { get; set; }
}

public class PagamentosViewModel
{
    public List<MetodoLinhaViewModel> Metodos { get; set; } = new();
    public List<TransacaoLinhaViewModel> Transacoes { get; set; } = new();
    public decimal PorPagar { get; set; }
    public int NPorPagar { get; set; }
}
