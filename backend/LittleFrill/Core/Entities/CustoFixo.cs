namespace Core.Entities;

// Uma linha por custo fixo mensal do ateliê (renda, luz e água, ...),
// editável livremente pelo admin na página "Custos e lucro" — ao contrário
// de SeccaoConfig, aqui há criação e remoção a sério, não só toggle. Só as
// linhas com Ativo = true entram na soma de FixosTotal usada pelo
// PainelService/FinanceiroService; as inativas continuam a aparecer na
// tabela de gestão, só não pesam nas contas.
public class CustoFixo
{
    protected CustoFixo()
    {
        Label = string.Empty;
    }

    public CustoFixo(string label, decimal valor)
    {
        ValidarDetalhes(label, valor);

        Label = label;
        Valor = valor;
        Ativo = true;
    }

    public int Id { get; private set; }
    public string Label { get; private set; }
    public decimal Valor { get; private set; }
    public bool Ativo { get; private set; }

    public void Atualizar(string label, decimal valor)
    {
        ValidarDetalhes(label, valor);

        Label = label;
        Valor = valor;
    }

    public void DefinirAtivo(bool ativo)
    {
        Ativo = ativo;
    }

    private static void ValidarDetalhes(string label, decimal valor)
    {
        if (string.IsNullOrWhiteSpace(label))
            throw new ArgumentException("Label é obrigatório.", nameof(label));

        if (valor < 0)
            throw new ArgumentException("Valor não pode ser negativo.", nameof(valor));
    }
}
