using Core.Entities;

namespace Core.Interfaces;

public interface IEncomendaRepository
{
    Task AdicionarAsync(Encomenda encomenda);

    Task<string> ProximaReferenciaAsync();

    // Filtra fora encomendas soft-apagadas (ver Encomenda.Apagar) — uma
    // encomenda que o admin apagou desaparece também de "Os meus pedidos".
    Task<IReadOnlyList<Encomenda>> ListarPorUtilizadorIdAsync(int utilizadorId);

    // Mesma nota sobre soft-delete acima.
    Task<Encomenda?> ObterPorReferenciaEUtilizadorAsync(string referencia, int utilizadorId);

    // Todas as encomendas não apagadas, para a tabela admin de Encomendas.
    // Tracked de propósito: o admin muta o estado (avançar, anular,
    // reabrir, ...) e persiste no mesmo DbContext. Inclui Utilizador
    // explicitamente — é uma relação a sério, não um tipo possuído, ao
    // contrário de Entrega/Itens, que carregam sozinhos.
    Task<IReadOnlyList<Encomenda>> ListarParaAdminAsync();

    // Caminho de mutação do admin: sem filtro de utilizador (ao contrário
    // de ObterPorReferenciaEUtilizadorAsync, que serve só "Os meus
    // pedidos"), tracked para permitir persistir as transições de estado.
    Task<Encomenda?> ObterPorReferenciaAsync(string referencia);

    // Histórico total de unidades vendidas por produto (não é "vendas do
    // mês"), agregado numa só query para alimentar a coluna "Vendidas" da
    // tabela admin de Produtos sem N+1. Exclui encomendas anuladas (regra 4
    // do AdminEspec).
    Task<Dictionary<int, int>> ObterQuantidadesVendidasPorProdutoAsync();

    // Variante mensal do método acima: a página admin de Stock reporta
    // "vendidas" sempre do mês corrente (diferente da página Produtos, que
    // usa o histórico total acima). O método acima fica intocado.
    Task<Dictionary<int, int>> ObterQuantidadesVendidasPorProdutoNoMesAsync(DateTime inicio, DateTime fim);

    // Todas as encomendas (qualquer Estado, incluindo Anulada) criadas no
    // intervalo [inicio, fimExclusivo) — usado pelo FinanceiroService para
    // montar o histórico de receita dos últimos 6 meses. Ao contrário dos
    // outros métodos deste repositório, não filtra Anulada: quem chama
    // decide (mesmo espírito de ListarParaAdminAsync, que devolve tudo e
    // deixa o PainelService filtrar).
    Task<IReadOnlyList<Encomenda>> ListarEntreDatasAsync(DateTime inicio, DateTime fimExclusivo);

    // Usado pela regra de apagar produto: se houver alguma encomenda com
    // uma linha para este produto, apagar a sério destruiria histórico de
    // vendas — o serviço desativa em vez de remover. Exclui encomendas
    // anuladas, mesma regra acima.
    Task<bool> ExisteItemParaProdutoAsync(int produtoId);

    // Número de encomendas e total gasto por utilizador, agregado numa só
    // query para alimentar as colunas "N Encomendas"/"Gasto" da tabela
    // admin de Clientes sem N+1. Filtra fora encomendas de balcão
    // (UtilizadorId nulo) — não têm cliente a quem atribuir o gasto — e
    // encomendas anuladas, mesma regra acima.
    Task<Dictionary<int, (int NEncomendas, decimal Gasto)>> ObterContagemEGastoPorUtilizadorAsync();

    // Usado pela regra de apagar cliente: se houver alguma encomenda ligada
    // a este utilizador, apagar a sério destruiria histórico de vendas —
    // o serviço bloqueia a remoção em vez de a fazer (Utilizador não tem
    // um Ativo para desativar, ao contrário de Produto).
    Task<bool> ExisteEncomendaParaUtilizadorAsync(int utilizadorId);
}
