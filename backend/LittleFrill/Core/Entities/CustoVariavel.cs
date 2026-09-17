namespace Core.Entities;

// Uma linha por despesa avulsa do ateliê (reparação da máquina de costura,
// compra extra de linhas, ...), editável livremente pelo admin na página
// "Custos e lucro" — ao contrário de CustoFixo, aqui não há Ativo/toggle:
// cada linha tem uma Data e ou cai no mês em curso (entra nas contas de
// PainelService/FinanceiroService) ou não cai (fica só no histórico da
// tabela de gestão).
public class CustoVariavel
{
    protected CustoVariavel()
    {
        Label = string.Empty;
    }

    public CustoVariavel(string label, decimal valor, DateTime data)
    {
        ValidarDetalhes(label, valor);

        Label = label;
        Valor = valor;
        Data = DateTime.SpecifyKind(data, DateTimeKind.Utc);
    }

    public int Id { get; private set; }
    public string Label { get; private set; }
    public decimal Valor { get; private set; }
    public DateTime Data { get; private set; }

    public void Atualizar(string label, decimal valor, DateTime data)
    {
        ValidarDetalhes(label, valor);

        Label = label;
        Valor = valor;
        Data = DateTime.SpecifyKind(data, DateTimeKind.Utc);
    }

    private static void ValidarDetalhes(string label, decimal valor)
    {
        if (string.IsNullOrWhiteSpace(label))
            throw new ArgumentException("Label é obrigatório.", nameof(label));

        if (valor < 0)
            throw new ArgumentException("Valor não pode ser negativo.", nameof(valor));
    }
}
