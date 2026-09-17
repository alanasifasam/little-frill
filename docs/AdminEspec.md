# Little Frill — Administração · especificação para front-end e back-end

Documento de contexto para construir a área administrativa em **React + .NET**.
O protótipo funcional está em `Little Frill - Administracao.dc.html` (e no HTML
autónomo `Little Frill - Administracao.html`, que abre offline). Este documento
descreve o que esse protótipo faz, para não ser preciso lê-lo linha a linha.

Tokens de design, padrões de tecido em CSS e modelo de dados da loja: ver
`Handoff - React + .NET.md`. Aqui só o que é próprio da administração.

---

## 1. Estrutura

Uma só página com **nove separadores** sobre o mesmo estado. Nada é isolado: um
registo em qualquer separador recalcula os números em todos os outros.

| Rota | Separador | Para que serve |
| --- | --- | --- |
| `/admin` | Painel | leitura do mês em curso |
| `/admin/stock` | Stock | entradas, saídas e vendas rápidas |
| `/admin/produtos` | Produtos | CRUD do catálogo + imagem |
| `/admin/encomendas` | Encomendas | estado, rastreio, pagamento |
| `/admin/carrinhos` | Carrinhos | carrinhos abertos e abandonados |
| `/admin/clientes` | Clientes | CRUD de cadastros |
| `/admin/pagamentos` | Pagamentos | métodos e cobranças |
| `/admin/vendas` | Vendas e caixa | caixa dia a dia e ranking |
| `/admin/financeiro` | Custos e lucro | conta do mês e projeção |
| `/admin/site` | Site e manutenção | features da loja e checklist |

---

## 2. Modelo de dados (além do da loja)

```ts
// Produto ganha campos de gestão
interface ProdutoAdmin extends Produto {
  custo: number;        // custo de materiais por peça
  base: number;         // stock inicial do período (StockBase)
  ativo: boolean;       // visível na loja
  destaque: boolean;    // aparece na home
  imagemUrl?: string;   // foto da peça
}

interface Cliente {
  id: number; nome: string; email: string; tel: string;
  cp: string;           // 0000-000
  localidade: string;
}

type EstadoEncomenda = 'recebida' | 'producao' | 'embalada' | 'enviada' | 'entregue' | 'anulada';
type MetodoPagamento = 'mbway' | 'multibanco' | 'cartao' | 'transferencia';

interface Encomenda {
  ref: string;              // "CA-1200"
  dia: number;              // dia do mês (no protótipo; usar DateTime na API)
  clienteId: number | null; // null = venda de balcão, sem conta
  estado: EstadoEncomenda;
  metodo: MetodoPagamento;
  pago: boolean;
  rastreio: string;         // "DW 1204 7788 3 PT" ou "—"
  envio: 'ctt' | 'atelie';
  linhas: { id: number; qty: number }[];
}

interface Carrinho {
  id: number;
  clienteId: number | null; // null = visitante
  linhas: { id: number; qty: number }[];
  horas: number;            // desde a última alteração
}

interface MovimentoStock {
  dia: number;
  tipo: 'entrada' | 'saida';
  id: number;               // produtoId
  qty: number;
  motivo?: 'quebra' | 'amostra' | 'presente';  // só nas saídas
}

// Configuração do site, editável no separador Site
interface ConfigSite {
  flags: {
    bannerEnvio: boolean; mostrarStock: boolean; combinaCom: boolean;
    recolhaAtelie: boolean; cartaMensal: boolean; ferias: boolean;
  };
  secoesOn: Record<Sec, boolean>;
  metodosOn: Record<MetodoPagamento, boolean>;
  limiteEnvio: number;      // envio grátis a partir de
  titulo: string;           // H1 da home
  gancho: string;           // linha em itálico da home
  tarefas: { key: string; feito: boolean }[];
}
```

Custos fixos mensais (no protótipo são constantes; na API deve ser tabela
editável): renda do ateliê 180 €, luz e água 42 €, embalagem e etiquetas 38 €,
site e domínio 14 €.

---

## 3. Regras de cálculo (a implementar no back-end)

Todas as métricas derivam de encomendas + movimentos; nada é guardado
pré-calculado.

```
vivas          = encomendas.filter(estado !== 'anulada')
vendasPecas    = Σ vivas.linhas (preço × qty)
enviosCtt      = vivas.filter(envio === 'ctt').length
enviosCobrados = enviosCtt × envioCobrado        // 4,50 € por omissão
custoEnvios    = enviosCtt × envioReal           // 4,10 € por omissão
custoMateriais = Σ vivas.linhas (custo × qty)
receita        = vendasPecas + enviosCobrados
lucro          = receita − custoMateriais − custoEnvios − fixos
margem         = lucro / receita
stock(p)       = p.base + entradas(p) − saidas(p) − vendidas(p)
vendidas(p)    = Σ vivas.linhas onde id === p.id
valorStock     = Σ max(0, stock(p)) × p.custo
```

Meta e projeção (dia corrente `D`, dias do mês `N`):

```
ritmoNecessario = meta × (D / N)      // risco preto na barra da meta
projVendas      = receita × (N / D)
projLucro       = projVendas − (custoMateriais + custoEnvios) × (N / D) − fixos
pontoEquilibrio = fixos / (1 − (custoMateriais + custoEnvios) / receita)
talaoMedio      = receita / nº de encomendas
```

---

## 4. Regras de negócio (invariantes)

1. **Venda registada** entra na caixa do dia, desconta stock, soma ao custo de
   materiais e reajusta lucro, margem, meta e projeção — numa só operação.
2. **Saída ou venda só passa se houver stock.** Caso contrário devolve erro com
   a quantidade disponível: *"Só há 2 de Cama para gato — a fornada tem de entrar
   primeiro."*
3. **Produto com vendas nunca é apagado.** O apagar transforma-se em desativar
   (`ativo = false`), para o histórico de encomendas não partir. Sem vendas,
   apaga de facto.
4. **Encomenda anulada sai de todas as contas**: receita, caixa, ranking,
   peças vendidas e stock (a peça volta ao inventário). Reabrir devolve tudo.
5. **Cliente com encomendas não é apagado** — mesma regra dos produtos.
6. **Converter carrinho** cria encomenda com a referência seguinte, estado
   `recebida`, `pago = false`, e remove o carrinho.
7. **Estado da encomenda** é a mesma máquina de estados de "Os meus pedidos":
   `recebida → producao → embalada → enviada → entregue`, mais `anulada`. O
   cliente vê exactamente o que aqui for gravado, incluindo o rastreio.
8. **Método de pagamento desligado** desaparece do checkout da loja.
9. **Modo de férias** ligado: a loja aceita encomendas mas avisa que só saem no
   regresso; o aviso aparece também no Painel.
10. **Secção escondida** sai da navegação e do catálogo, sem apagar as peças.
11. Nova referência de encomenda: `CA-` + sequência (o protótipo salta de 3 em 3
    para imitar referências reais não contíguas).

---

## 5. Endpoints sugeridos

```
GET    /api/admin/painel                 → métricas do mês, barras dos 10 dias, alertas
GET    /api/admin/produtos               → catálogo com custo, stock, vendidas, margem
POST   /api/admin/produtos               → criar
PUT    /api/admin/produtos/{id}          → editar
DELETE /api/admin/produtos/{id}          → apagar ou desativar (regra 3)
PATCH  /api/admin/produtos/{id}/ativo    → ligar/desligar na loja
PATCH  /api/admin/produtos/{id}/destaque → destaque na home
POST   /api/admin/produtos/{id}/imagem   → upload da foto

GET    /api/admin/stock                  → inventário + movimentos do mês
POST   /api/admin/stock/entrada          → { produtoId, qty }
POST   /api/admin/stock/saida            → { produtoId, qty, motivo }   (regra 2)
POST   /api/admin/stock/venda            → { produtoId, qty }           (regra 1)

GET    /api/admin/encomendas
PATCH  /api/admin/encomendas/{ref}/estado    → { estado }
PATCH  /api/admin/encomendas/{ref}/rastreio  → { rastreio }
PATCH  /api/admin/encomendas/{ref}/pago      → { pago }
POST   /api/admin/encomendas/{ref}/anular    → alterna anulada/recebida (regra 4)
DELETE /api/admin/encomendas/{ref}

GET    /api/admin/carrinhos
POST   /api/admin/carrinhos/{id}/converter   → (regra 6)
DELETE /api/admin/carrinhos/{id}

GET    /api/admin/clientes
POST   /api/admin/clientes
PUT    /api/admin/clientes/{id}
DELETE /api/admin/clientes/{id}              → (regra 5)

GET    /api/admin/pagamentos                 → métodos, repartição, transacções, por receber
PATCH  /api/admin/pagamentos/{metodo}        → { ativo }

GET    /api/admin/vendas                     → caixa dia a dia, ranking, talão médio
GET    /api/admin/financeiro                 → conta do mês, margem, equilíbrio, projeção, histórico
GET    /api/admin/config                     → ConfigSite
PUT    /api/admin/config                     → guardar flags, secções, limiar, copy, tarefas
```

---

## 6. O que cada separador mostra

### Painel
Quatro números grandes: vendas do mês (+ % da meta), caixa de hoje (+ nº de
encomendas), lucro (+ margem), peças em stock (+ nº a repor). Barra da meta com
risco preto no ritmo necessário hoje. Barras da caixa dos últimos 10 dias, com o
dia corrente em rosa cheio. Tabela dos últimos movimentos (vendas e stock
misturados, mais recente primeiro). Coluna lateral com as peças a repor.
Aviso de modo de férias quando ligado.

### Stock
Formulário: peça (com o stock no rótulo de cada opção), quantidade, motivo da
saída; três botões — entrada, saída, registar venda. Linha de confirmação
por baixo. Tabela de movimentos do mês. Inventário completo com custo, preço,
margem, entradas, saídas, vendidas, stock e etiqueta *Repor* / *Esgotada*.

### Produtos
Tabela: miniatura do tecido, nome, tipo, preço, custo, margem, stock, vendidas,
estado na loja, destaque, editar, apagar. Editor lateral: nome, tipo, preço,
custo, padrão, cor, tecido, stock inicial, alvo de largar a fotografia
(220×180 px) e pré-visualização do swatch com a margem calculada ao vivo.
Resumo: *"8 peças no catálogo, 8 visíveis na loja e 1 em destaque na home."*

### Encomendas
Linha por encomenda: referência, dia, cliente e localidade, peças, total,
select de estado, campo de rastreio editável, etiqueta paga/por pagar com
botão, anular/reabrir, apagar. Encomendas anuladas ficam a 50 % de opacidade.
Resumo: válidas, à espera de costura, por pagar.

### Carrinhos
Cliente ou visitante, e-mail, peças, total, idade (*"há 3 horas"* / *"há 2
dias"*), etiqueta *Ainda quente* (< 24 h) ou *Abandonado*, converter em
encomenda, apagar.

### Clientes
Nome, e-mail, telefone, código postal e localidade, nº de encomendas, total
gasto, etiqueta de cliente fiel (≥ 3 encomendas), editar, apagar. Editor
lateral com os cinco campos.

### Pagamentos
Os quatro métodos com nota explicativa, interruptor, nº de usos, valor e barra
de repartição. Tabela de transacções com botão para marcar paga / por pagar.
Total por receber em destaque.

### Vendas e caixa
Encomendas do mês, peças vendidas, talão médio, melhor dia. Caixa dia a dia com
referências e barra proporcional. Ranking das cinco peças mais vendidas.

### Custos e lucro
Conta do mês linha a linha (vendas, envios cobrados, custo de materiais, custo
real dos envios, cada custo fixo → lucro). Margem, ponto de equilíbrio e
percentagem já coberta. Projeção de vendas e lucro até fim do mês, com frase
explicativa. Histórico dos últimos seis meses, mês em curso em rosa cheio.

### Site e manutenção
Seis features com interruptor, limiar de envio grátis com pré-visualização da
barra da loja, sete secções com nº de peças, título e gancho da home editáveis
com pré-visualização, tabela das páginas do site e checklist de manutenção com
contador de pendentes.

---

## 7. Notas de implementação

- Tudo em **inline styles** no protótipo; na app React usar os tokens de
  `Handoff - React + .NET.md` como CSS variables globais.
- Classes reutilizadas do design system: `.table`, `.tag` (+ `tag-accent`,
  `tag-accent-2`, `tag-outline`, `tag-neutral`), `.btn` (+ `btn-primary`,
  `btn-secondary`), `.field`, `.input`, `.radio`.
- Moeda sempre `48,00 €` (vírgula decimal, símbolo à direita).
- Datas do protótipo são dias do mês (`17/08`) porque simula agosto de 2026;
  na app usar datas reais e derivar `D` e `N` do calendário.
- Miniaturas de 44 px na tabela mostram apenas o padrão de tecido; o alvo de
  upload vive no editor da peça (a UI de drop precisa de ≥ 120 px).
- Os valores de envio (4,50 € cobrado, 4,10 € real) e a meta mensal (1500 €)
  devem ser configuráveis — no protótipo são tweaks.
