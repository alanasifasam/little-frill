using Core.Enums;

namespace Core.Entities;

public class Encomenda
{
    private readonly List<EncomendaItem> _itens = new();

    protected Encomenda()
    {
        Referencia = string.Empty;
    }

    public Encomenda(
        int? utilizadorId,
        string referencia,
        List<EncomendaItem> itens,
        Endereco? entrega,
        MetodoEnvio metodoEnvio,
        MetodoPagamento metodoPagamento,
        decimal subtotal,
        decimal envio,
        decimal total,
        string? nif = null)
    {
        if (utilizadorId is not null && utilizadorId <= 0)
            throw new ArgumentException("Utilizador inválido.", nameof(utilizadorId));

        if (string.IsNullOrWhiteSpace(referencia))
            throw new ArgumentException("Referência é obrigatória.", nameof(referencia));

        if (itens is null || itens.Count == 0)
            throw new ArgumentException("Encomenda tem de ter pelo menos um item.", nameof(itens));

        if (subtotal <= 0)
            throw new ArgumentException("Subtotal tem de ser superior a zero.", nameof(subtotal));

        if (envio < 0)
            throw new ArgumentException("Envio não pode ser negativo.", nameof(envio));

        if (total <= 0)
            throw new ArgumentException("Total tem de ser superior a zero.", nameof(total));

        UtilizadorId = utilizadorId;
        Referencia = referencia;
        Criada = DateTime.UtcNow;
        _itens = new List<EncomendaItem>(itens);
        Entrega = entrega;
        MetodoEnvio = metodoEnvio;
        MetodoPagamento = metodoPagamento;
        Nif = nif;
        Subtotal = subtotal;
        Envio = envio;
        Total = total;
        Estado = EstadoEncomenda.Novo;
    }

    /// <summary>
    /// Único caminho que produz uma encomenda de balcão: sem conta de
    /// cliente nem morada de entrega, entregue em mão no ateliê (mesmo
    /// espírito do <see cref="Utilizador.CriarAdmin"/>). O construtor
    /// público continua a servir só o checkout da loja, que sempre passa
    /// um utilizador e uma morada reais.
    /// </summary>
    public static Encomenda CriarBalcao(
        string referencia,
        List<EncomendaItem> itens,
        decimal subtotal,
        MetodoPagamento metodoPagamento)
    {
        return new Encomenda(
            utilizadorId: null,
            referencia,
            itens,
            entrega: null,
            MetodoEnvio.Atelie,
            metodoPagamento,
            subtotal,
            envio: 0m,
            total: subtotal);
    }

    public int Id { get; private set; }
    public int? UtilizadorId { get; private set; }
    public Utilizador? Utilizador { get; private set; }
    public string Referencia { get; private set; }
    public DateTime Criada { get; private set; }
    public IReadOnlyList<EncomendaItem> Itens => _itens.AsReadOnly();
    public Endereco? Entrega { get; private set; }
    public MetodoEnvio MetodoEnvio { get; private set; }
    public MetodoPagamento MetodoPagamento { get; private set; }
    public string? Nif { get; private set; }
    public decimal Subtotal { get; private set; }
    public decimal Envio { get; private set; }
    public decimal Total { get; private set; }
    public EstadoEncomenda Estado { get; private set; }
    public DateTime? DataEmProducao { get; private set; }
    public DateTime? DataEmbalada { get; private set; }
    public DateTime? DataEnviada { get; private set; }
    public DateTime? DataEntregue { get; private set; }
    public string? CodigoRastreio { get; private set; }
    public bool Pago { get; private set; }
    public bool Apagada { get; private set; }

    // Só populado enquanto Estado == Anulada: guarda o estado de onde a
    // encomenda veio, para Reabrir() a repor fielmente. Fora desse período
    // fica sempre null.
    public EstadoEncomenda? EstadoAnterior { get; private set; }

    // O admin pode corrigir o estado livremente (não é obrigado a seguir
    // sempre o caminho novo→produção→embalada→enviada→entregue por ordem —
    // pode voltar atrás para corrigir um engano). "Anulada" fica de fora
    // de propósito: só se entra/sai desse estado via Anular()/Reabrir(),
    // que têm efeitos próprios (stock, EstadoAnterior) que este método
    // genérico não replica.
    public void DefinirEstado(EstadoEncomenda novoEstado)
    {
        if (novoEstado == EstadoEncomenda.Anulada)
            throw new InvalidOperationException("Use Anular() para cancelar a encomenda.");

        if (Estado == EstadoEncomenda.Anulada)
            throw new InvalidOperationException("Reabra a encomenda antes de mudar o estado.");

        if (novoEstado == EstadoEncomenda.Enviada && string.IsNullOrWhiteSpace(CodigoRastreio))
            throw new ArgumentException("Defina o código de rastreio antes de marcar como enviada.");

        if (novoEstado == EstadoEncomenda.Enviada && !Pago)
            throw new ArgumentException("Marque a encomenda como paga antes de enviar.");

        Estado = novoEstado;

        // A data de cada etapa só é gravada da primeira vez que é
        // alcançada — voltar atrás e para a frente de novo não a apaga
        // nem a substitui, mantém o registo de quando foi alcançada "de
        // verdade" pela primeira vez.
        switch (novoEstado)
        {
            case EstadoEncomenda.EmProducao:
                DataEmProducao ??= DateTime.UtcNow;
                break;
            case EstadoEncomenda.Embalada:
                DataEmbalada ??= DateTime.UtcNow;
                break;
            case EstadoEncomenda.Enviada:
                DataEnviada ??= DateTime.UtcNow;
                break;
            case EstadoEncomenda.Entregue:
                DataEntregue ??= DateTime.UtcNow;
                break;
        }
    }

    // Sem guarda de estado de propósito: o código de rastreio é editável
    // livremente pelo admin em qualquer momento (mesmo comportamento do
    // protótipo do frontend), independente do estado — DefinirEstado só
    // exige que já esteja definido quando o novo estado é "Enviada".
    public void DefinirRastreio(string? codigoRastreio)
    {
        CodigoRastreio = codigoRastreio;
    }

    public void AlternarPago()
    {
        Pago = !Pago;
    }

    public void Anular()
    {
        if (Estado == EstadoEncomenda.Anulada)
            throw new InvalidOperationException("Encomenda já está anulada.");

        EstadoAnterior = Estado;
        Estado = EstadoEncomenda.Anulada;
    }

    public void Reabrir()
    {
        if (Estado != EstadoEncomenda.Anulada)
            throw new InvalidOperationException("Só é possível reabrir uma encomenda anulada.");

        Estado = EstadoAnterior!.Value;
        EstadoAnterior = null;
    }

    // Soft-delete: a linha nunca sai da base de dados, só desaparece das
    // listagens (ver EncomendaRepository) — preserva o histórico de vendas
    // mesmo depois de "apagada".
    public void Apagar()
    {
        if (Estado != EstadoEncomenda.Anulada)
            throw new InvalidOperationException("Só é possível apagar uma encomenda já anulada.");

        Apagada = true;
    }
}
