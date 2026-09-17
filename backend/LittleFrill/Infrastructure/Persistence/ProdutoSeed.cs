using Core.Enums;

namespace Infrastructure.Persistence;

/// <summary>
/// Seed dos 20 produtos do protótipo, transcritos 1:1 a partir de
/// frontend/src/mocks/produtos.mock.ts (ids, nomes, secções, preços,
/// padrões, cores, stock, medidas, tecido, combina e nova têm de bater
/// certo com esse ficheiro). Custo: os 8 valores conhecidos vêm de
/// frontend/src/mocks/admin/produtos.mock.ts (mesmos ids); os restantes 12
/// são uma estimativa a ~35% do preço, ajustável depois pela própria
/// página admin. Ativo/Destaque arrancam como na loja: tudo visível, nada
/// em destaque por omissão.
/// </summary>
internal static class ProdutoSeed
{
    public static readonly object[] Produtos =
    {
        new { Id = 1, Nome = "Bolsa Alentejo", Tipo = "Bolsa", Seccao = Seccao.Acessorios, Preco = 48m, Custo = 17.20m, Padrao = Padrao.Xadrez, Cor = Cor.Rosa, Stock = 6, Medidas = "34 × 28 × 12 cm", Tecido = "Algodão xadrez, forro de sarja", Novo = true, CombinaCom = new List<int> { 5, 3 }, Ativo = true, Destaque = false },
        new { Id = 2, Nome = "Bolsa Tote de Linho", Tipo = "Bolsa", Seccao = Seccao.Acessorios, Preco = 42m, Custo = 14.70m, Padrao = Padrao.Liso, Cor = Cor.Verde, Stock = 3, Medidas = "38 × 32 × 10 cm", Tecido = "Linho lavado, alças de fita", Novo = false, CombinaCom = new List<int> { 4 }, Ativo = true, Destaque = false },
        new { Id = 3, Nome = "Necessaire Grande", Tipo = "Necessaire", Seccao = Seccao.Acessorios, Preco = 26m, Custo = 8.40m, Padrao = Padrao.Floral, Cor = Cor.Lilas, Stock = 12, Medidas = "24 × 15 × 9 cm", Tecido = "Algodão floral, interior impermeável", Novo = true, CombinaCom = new List<int> { 13, 5 }, Ativo = true, Destaque = false },
        new { Id = 4, Nome = "Necessaire Pequena", Tipo = "Necessaire", Seccao = Seccao.Acessorios, Preco = 18m, Custo = 6.30m, Padrao = Padrao.Xadrez, Cor = Cor.Azul, Stock = 9, Medidas = "18 × 11 × 7 cm", Tecido = "Algodão xadrez, fecho de metal", Novo = false, CombinaCom = new List<int> { 8 }, Ativo = true, Destaque = false },
        new { Id = 5, Nome = "Porta-moedas Coração", Tipo = "Porta-moedas", Seccao = Seccao.Acessorios, Preco = 12m, Custo = 3.10m, Padrao = Padrao.Floral, Cor = Cor.Rosa, Stock = 20, Medidas = "11 × 9 cm", Tecido = "Retalhos de algodão, mola de metal", Novo = false, CombinaCom = new List<int> { 1 }, Ativo = true, Destaque = false },
        new { Id = 6, Nome = "Capa de Portátil 13\"", Tipo = "Capa", Seccao = Seccao.Acessorios, Preco = 38m, Custo = 13.30m, Padrao = Padrao.Xadrez, Cor = Cor.Amarelo, Stock = 5, Medidas = "34 × 24 cm", Tecido = "Algodão acolchoado, velcro", Novo = false, CombinaCom = new List<int> { 4, 5 }, Ativo = true, Destaque = false },
        new { Id = 7, Nome = "Capa de Portátil 15\"", Tipo = "Capa", Seccao = Seccao.Acessorios, Preco = 42m, Custo = 15.60m, Padrao = Padrao.Liso, Cor = Cor.Azul, Stock = 4, Medidas = "39 × 28 cm", Tecido = "Linho acolchoado, velcro", Novo = false, CombinaCom = new List<int> { 3 }, Ativo = true, Destaque = false },
        new { Id = 8, Nome = "Capa de Kindle", Tipo = "Capa", Seccao = Seccao.Acessorios, Preco = 22m, Custo = 7.70m, Padrao = Padrao.Floral, Cor = Cor.Verde, Stock = 7, Medidas = "19 × 14 cm", Tecido = "Algodão floral, elástico de fita", Novo = true, CombinaCom = new List<int> { 5 }, Ativo = true, Destaque = false },
        new { Id = 9, Nome = "Babete com folho", Tipo = "Bebé", Seccao = Seccao.Bebe, Preco = 14m, Custo = 4.20m, Padrao = Padrao.Xadrez, Cor = Cor.Rosa, Stock = 15, Medidas = "22 × 26 cm", Tecido = "Algodão duplo, atrás em felpo", Novo = false, CombinaCom = new List<int> { 10 }, Ativo = true, Destaque = false },
        new { Id = 10, Nome = "Saco de fraldas", Tipo = "Bebé", Seccao = Seccao.Bebe, Preco = 34m, Custo = 11.90m, Padrao = Padrao.Floral, Cor = Cor.Lilas, Stock = 6, Medidas = "32 × 26 × 10 cm", Tecido = "Algodão floral, bolsos interiores", Novo = false, CombinaCom = new List<int> { 9, 4 }, Ativo = true, Destaque = false },
        new { Id = 11, Nome = "Guardanapos (jogo de 4)", Tipo = "Mesa", Seccao = Seccao.Mesa, Preco = 24m, Custo = 8.40m, Padrao = Padrao.Xadrez, Cor = Cor.Verde, Stock = 10, Medidas = "40 × 40 cm cada", Tecido = "Linho, bainha à mão", Novo = false, CombinaCom = new List<int> { 12 }, Ativo = true, Destaque = false },
        new { Id = 12, Nome = "Caminho de mesa", Tipo = "Mesa", Seccao = Seccao.Mesa, Preco = 28m, Custo = 9.80m, Padrao = Padrao.Liso, Cor = Cor.Amarelo, Stock = 5, Medidas = "140 × 40 cm", Tecido = "Linho lavado", Novo = true, CombinaCom = new List<int> { 11 }, Ativo = true, Destaque = false },
        new { Id = 13, Nome = "Toalha de mão bordada", Tipo = "Banho", Seccao = Seccao.Banho, Preco = 16m, Custo = 5.60m, Padrao = Padrao.Floral, Cor = Cor.Azul, Stock = 11, Medidas = "50 × 30 cm", Tecido = "Felpo com barra de algodão", Novo = false, CombinaCom = new List<int> { 14 }, Ativo = true, Destaque = false },
        new { Id = 14, Nome = "Cesto de banho", Tipo = "Banho", Seccao = Seccao.Banho, Preco = 30m, Custo = 10.50m, Padrao = Padrao.Xadrez, Cor = Cor.Lilas, Stock = 3, Medidas = "28 × 20 cm", Tecido = "Algodão engomado, aro de vime", Novo = false, CombinaCom = new List<int> { 13 }, Ativo = true, Destaque = false },
        new { Id = 15, Nome = "Fronha com folho", Tipo = "Cama", Seccao = Seccao.Cama, Preco = 32m, Custo = 11.20m, Padrao = Padrao.Floral, Cor = Cor.Rosa, Stock = 8, Medidas = "50 × 70 cm", Tecido = "Percal de algodão", Novo = false, CombinaCom = new List<int> { 16 }, Ativo = true, Destaque = false },
        new { Id = 16, Nome = "Colcha de retalhos", Tipo = "Cama", Seccao = Seccao.Cama, Preco = 86m, Custo = 30.10m, Padrao = Padrao.Xadrez, Cor = Cor.Lilas, Stock = 2, Medidas = "220 × 240 cm", Tecido = "Retalhos de algodão, enchimento fino", Novo = false, CombinaCom = new List<int> { 15 }, Ativo = true, Destaque = false },
        new { Id = 17, Nome = "Luva de forno", Tipo = "Cozinha", Seccao = Seccao.Cozinha, Preco = 15m, Custo = 5.10m, Padrao = Padrao.Listras, Cor = Cor.Rosa, Stock = 14, Medidas = "30 × 18 cm", Tecido = "Algodão com manta térmica", Novo = false, CombinaCom = new List<int> { 18 }, Ativo = true, Destaque = false },
        new { Id = 18, Nome = "Avental com folho", Tipo = "Cozinha", Seccao = Seccao.Cozinha, Preco = 34m, Custo = 11.90m, Padrao = Padrao.Floral, Cor = Cor.Amarelo, Stock = 6, Medidas = "Tamanho único, fitas 1,2 m", Tecido = "Algodão floral, bolso frontal", Novo = true, CombinaCom = new List<int> { 17 }, Ativo = true, Destaque = false },
        new { Id = 19, Nome = "Cama para gato", Tipo = "Pets", Seccao = Seccao.Animais, Preco = 40m, Custo = 14.50m, Padrao = Padrao.Xadrez, Cor = Cor.Azul, Stock = 4, Medidas = "50 × 40 cm", Tecido = "Algodão xadrez, enchimento lavável", Novo = false, CombinaCom = new List<int> { 20 }, Ativo = true, Destaque = false },
        new { Id = 20, Nome = "Bandana para cão", Tipo = "Pets", Seccao = Seccao.Animais, Preco = 9m, Custo = 3.15m, Padrao = Padrao.Listras, Cor = Cor.Verde, Stock = 22, Medidas = "Ajustável 26–40 cm", Tecido = "Algodão, botão de pressão", Novo = false, CombinaCom = new List<int> { 19 }, Ativo = true, Destaque = false },
    };
}
