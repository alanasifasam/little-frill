# Little Frill — base de código para React + .NET

Documento de continuidade. O protótipo aprovado é `Casa Arrais.dc.html`
(exportado como ficheiro único em `Little Frill — prototipo.html`). Este
documento traduz esse design para o que é preciso construir em React (front) e
.NET (API), sem perder nenhuma decisão visual.

---

## 1. Tokens de design (CSS variables)

Copiar para o `:root` global da app React. Vêm do design system Broadsheet
re-tingido em pastéis.

```css
:root{
  /* ground / ink */
  --color-bg:#fdf8f4;
  --color-surface:#fbeee6;
  --color-text:#3b2a31;
  --color-divider:color-mix(in srgb,#3b2a31 14%,transparent);

  /* acento primário (rosa) — usado em botões, links, kickers */
  --color-accent:#c2668a;
  --color-accent-100:#fdeef3; --color-accent-200:#fadbe6; --color-accent-300:#f5bfd2;
  --color-accent-400:#e69ab5; --color-accent-500:#d4799a; --color-accent-600:#b25679;
  --color-accent-700:#994665; --color-accent-800:#7a3751; --color-accent-900:#4f2334;

  /* acento secundário (lilás) — raro, nunca no mesmo componente do primário */
  --color-accent-2:#8873c2;
  --color-accent-2-100:#f3f0fc; --color-accent-2-200:#e6e0f8; --color-accent-2-300:#d2c7f0;
  --color-accent-2-400:#b7a6e4; --color-accent-2-500:#9d89d4; --color-accent-2-600:#7c66b4;
  --color-accent-2-700:#65529a; --color-accent-2-800:#4e3f78; --color-accent-2-900:#332a4f;

  /* tipografia — uma só família, serif, também para a interface */
  --font-heading:"Source Serif 4",serif; --font-heading-weight:600;
  --font-body:"Source Serif 4",serif;

  /* espaçamento 1.25× e raios de 2px */
  --space-1:5px; --space-2:10px; --space-3:15px; --space-4:20px; --space-6:30px; --space-8:40px;
  --radius-sm:1px; --radius-md:2px; --radius-lg:4px;

  --shadow-sm:0 1px 2px color-mix(in srgb,#2d2b2b 14%,transparent);
  --shadow-md:0 3px 10px color-mix(in srgb,#2d2b2b 16%,transparent);
  --shadow-lg:0 12px 32px color-mix(in srgb,#2d2b2b 22%,transparent);
}
```

Fonte: Google Fonts `Source Serif 4` (400, 600, 700 + itálico 400).

Paletas alternativas do protótipo (troca só os 9 passos + base do acento):

| Paleta | 100 → 900 | base |
| --- | --- | --- |
| Rosa | #fdeef3 #fadbe6 #f5bfd2 #e69ab5 #d4799a #b25679 #994665 #7a3751 #4f2334 | #c2668a |
| Lilás | #f3f0fc #e6e0f8 #d2c7f0 #b7a6e4 #9d89d4 #7c66b4 #65529a #4e3f78 #332a4f | #8873c2 |
| Azul | #eaf4fb #d5e8f5 #b6d6ec #8dbcdc #6ba3c9 #4b83aa #3c6d91 #2f5573 #1f3a4e | #4c85ad |
| Verde | #eef5e6 #dcecce #c2dcab #a0c483 #84ac66 #688f4b #55763c #425c2f #2b3d1f | #6b9450 |

### Regras visuais que não se podem perder
- Layout **alinhado à esquerda e assimétrico**; títulos flush-left, ar à direita.
- **Sem caixas nem réguas a separar secções** — só espaço em branco. `.card` só
  para itens discretos (sugestões, resumo do carrinho).
- Tudo em serif, incluindo botões e labels. Nunca introduzir sans-serif.
- Régua grossa (3px) + fina (1px) a emoldurar a barra de secções do cabeçalho —
  é a única régua "a sério" da página.
- Bordos ondulados (folhos) por baixo das imagens e no topo do rodapé, com
  `--ruffle-op` a 0 quando o tweak `folhos` está desligado.

---

## 2. Padrões de tecido em CSS (substituem fotografia)

Enquanto não houver fotos reais, cada produto desenha o seu tecido. Cores:

```ts
export const CORES = {
  rosa:    { label: 'Rosa',    lt: '#fbdce6', md: '#f2b8cd' },
  azul:    { label: 'Azul',    lt: '#dbeaf6', md: '#aecfe6' },
  lilas:   { label: 'Lilás',   lt: '#e8e1f7', md: '#c9bbe8' },
  amarelo: { label: 'Amarelo', lt: '#fbeec8', md: '#f4dc94' },
  verde:   { label: 'Verde',   lt: '#e2efd8', md: '#bcdba9' },
} as const;

export type Padrao = 'xadrez' | 'floral' | 'listras' | 'liso';

export function swatch(padrao: Padrao, cor: keyof typeof CORES): string {
  const c = CORES[cor];
  if (padrao === 'liso') return c.lt;
  if (padrao === 'listras')
    return `repeating-linear-gradient(90deg,${c.md} 0 10px,${c.lt} 10px 20px)`;
  if (padrao === 'xadrez') {
    const s = `color-mix(in srgb,${c.md} 62%,transparent)`;
    return `repeating-linear-gradient(90deg,${s} 0 17px,transparent 17px 34px),` +
           `repeating-linear-gradient(0deg,${s} 0 17px,transparent 17px 34px),${c.lt}`;
  }
  const petal = c.md, mid = `color-mix(in srgb,${c.md} 55%,#fffdf9)`;
  const f = (x: number, y: number, r: number) =>
    `radial-gradient(circle at ${x}% ${y}%,${petal} 0 ${r}px,transparent ${r + 0.6}px) 0 0/42px 42px`;
  return [f(50,36,6), f(64,50,6), f(50,64,6), f(36,50,6),
    `radial-gradient(circle at 50% 50%,${mid} 0 3.5px,transparent 4px) 0 0/42px 42px`,
    `radial-gradient(circle at 50% 50%,${petal} 0 3px,transparent 3.6px) 21px 21px/42px 42px`,
    c.lt].join(',');
}
```

Quando entrarem fotos reais: manter o mesmo rácio dos blocos (240px de altura no
catálogo, 520px no detalhe) e o bordo ondulado por baixo.

---

## 3. Modelo de dados

### Front (TypeScript)

```ts
export type Sec = 'acessorios' | 'bebe' | 'mesa' | 'banho' | 'cama' | 'cozinha' | 'animais';

export interface Produto {
  id: number;
  nome: string;
  tipo: string;            // Bolsa, Necessaire, Capa, Porta-moedas, Bebé, Mesa, Banho, Cama, Cozinha, Pets
  sec: Sec;                // secção de navegação (animais mostra-se como "Pets")
  preco: number;           // EUR
  padrao: Padrao;
  cor: keyof typeof CORES;
  stock: number;
  medidas: string;
  tecido: string;
  combina: number[];        // ids sugeridos — alimenta "Combina com"
  nova?: boolean;
}

export interface LinhaCarrinho { id: number; qty: number; }
```

### API (.NET — entidades sugeridas)

```csharp
public class Produto {
  public int Id { get; set; }
  public string Nome { get; set; } = "";
  public string Tipo { get; set; } = "";
  public string Seccao { get; set; } = "";      // acessorios|bebe|mesa|banho|cama|cozinha|animais
  public decimal Preco { get; set; }
  public string Padrao { get; set; } = "";      // xadrez|floral|listras|liso
  public string Cor { get; set; } = "";         // rosa|azul|lilas|amarelo|verde
  public int Stock { get; set; }
  public string Medidas { get; set; } = "";
  public string Tecido { get; set; } = "";
  public bool Novo { get; set; }
  public List<int> CombinaCom { get; set; } = new();
}

public class Encomenda {
  public int Id { get; set; }
  public string Referencia { get; set; } = "";  // "CA-1204"
  public DateTime Criada { get; set; }
  public List<EncomendaItem> Itens { get; set; } = new();
  public Endereco Entrega { get; set; } = new();
  public string MetodoEnvio { get; set; } = "ctt";   // ctt|atelie
  public string MetodoPagamento { get; set; } = "mbway"; // mbway|multibanco|cartao|transferencia
  public decimal Subtotal { get; set; }
  public decimal Envio { get; set; }
  public decimal Total { get; set; }
  public string Estado { get; set; } = "novo";   // novo|em producao|enviada|entregue
}

public class Endereco {
  public string Nome { get; set; } = "";
  public string Email { get; set; } = "";
  public string Telefone { get; set; } = "";
  public string Morada { get; set; } = "";
  public string AndarPorta { get; set; } = "";
  public string CodigoPostal { get; set; } = ""; // 0000-000
  public string Localidade { get; set; } = "";
  public string Distrito { get; set; } = "";     // 18 distritos + Açores + Madeira
  public string Pais { get; set; } = "PT";       // só Portugal
  public string? Notas { get; set; }
}
```

Endpoints mínimos: `GET /api/produtos` (filtros: sec, padrao, cor, precoMax,
soStock, ordenar), `GET /api/produtos/{id}`, `POST /api/encomendas`,
`POST /api/auth/login`, `POST /api/auth/registo`.

---

## 4. Regras de negócio já decididas

- Moeda EUR, formato português: `48,00 €` (vírgula decimal, símbolo à direita).
- Envio: **CTT Expresso** com custo configurável (4,50 € por omissão), **grátis**
  acima de um limiar configurável (50 € na versão atual do utilizador, 60 € por
  omissão do código); **Recolher no ateliê** é sempre grátis.
- Prazo de entrega comunicado: 2 a 4 dias úteis; ilhas +1 a 2 dias.
- Pagamento: MB WAY (pede telefone), Multibanco (entidade+referência, 3 dias),
  Cartão (pede número/validade/CVV), Transferência (IBAN por e-mail).
  Opção de fatura com NIF.
- Só entregas em Portugal (continente e ilhas).
- Referência de encomenda: `CA-` + número sequencial (o protótipo gera 1200–1999).
- Stock: acima de 3 mostra "N prontas na prateleira"; até 3 mostra
  "só N — última fornada" e etiqueta magenta "Poucas". Produtos novos: etiqueta
  rosa "Novo".
- "Combina com": pares por `combina[]`; o botão junta as duas peças ao carrinho
  e mostra o preço somado do par.

---

## 5. Ecrãs e rotas React

| Rota | Ecrã | Notas |
| --- | --- | --- |
| `/` | Home | hero + gancho, mosaicos das 7 secções, "Saíram do ateliê esta semana" (4 novidades), 3 colunas de confiança |
| `/catalogo` | Catálogo | filtros: secção, padrão, cor, preço máximo, "só o que está pronto", ordenação; abaixo da grelha, "Combina com" |
| `/catalogo/:sec` | Catálogo filtrado | os links da barra de secções entram aqui |
| `/produto/:id` | Detalhe | swatch grande + 3 vistas, tabela de medidas/tecido/lavagem/envio, quantidade, "Combina com" |
| `/carrinho` | Carrinho | linhas com quantidade, resumo com subtotal/envio/total e nota de quanto falta para envio grátis |
| `/checkout/morada` | Morada + envio | formulário PT (código postal 0000-000, distrito), escolha de envio, resumo lateral |
| `/checkout/pagamento` | Pagamento | 4 métodos, campos condicionais, NIF |
| `/checkout/confirmacao` | Confirmação | referência, total pago, resumo do envio |
| `/entrar` | Login | |
| `/registo` | Criar conta | |

Indicador de passos do checkout: `1 · Morada  2 · Pagamento  3 · Confirmação`,
o ativo em `--color-accent-700`, os outros a 45% de opacidade.

## 6. Copy fixa (não reescrever sem pedir)

- Cabeçalho: **Little Frill** / `by Arrais` / *feito à mão, feito com calma*
- Rodapé: **Little Frill** / `by Arrais Atelier` / *Ateliê de costura em Lisboa.
  Feito à mão, feito com calma, desde 2019.*
- Home H1: **Presentes que não existem em mais nenhuma casa.**
- Gancho: *Cada peça tem par: leve o conjunto e poupe no envio.*
- Vocabulário: Carrinho, Ateliê, Pets, Lisboa.

## 7. Área administrativa (ainda por desenhar)

Pedida pelo utilizador, deixada para depois: entradas/saídas de stock, caixa
diário, vendas do mês com meta, custos, lucro e projeções. Quando for desenhada,
deve reutilizar `.table`, `.card`, os tokens acima e a mesma tipografia serif.
