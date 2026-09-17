using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "produtos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    tipo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    seccao = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    preco = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    padrao = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    cor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    medidas = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    tecido = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    novo = table.Column<bool>(type: "boolean", nullable: false),
                    combina_com = table.Column<List<int>>(type: "integer[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produtos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "utilizadores",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    sobrenome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    codigo_postal = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: true),
                    distrito = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    quer_carta = table.Column<bool>(type: "boolean", nullable: false),
                    criado_em = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_utilizadores", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "encomendas",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    utilizador_id = table.Column<int>(type: "integer", nullable: false),
                    referencia = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    criada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    entrega_nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    entrega_email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    entrega_telefone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    entrega_morada = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    entrega_andar_porta = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    entrega_codigo_postal = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    entrega_localidade = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    entrega_distrito = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    entrega_pais = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    entrega_notas = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    metodo_envio = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    metodo_pagamento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    nif = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: true),
                    subtotal = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    envio = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    total = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_encomendas", x => x.id);
                    table.ForeignKey(
                        name: "FK_encomendas_utilizadores_utilizador_id",
                        column: x => x.utilizador_id,
                        principalTable: "utilizadores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "encomenda_itens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    produto_id = table.Column<int>(type: "integer", nullable: false),
                    nome_produto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    preco_unitario = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    quantidade = table.Column<int>(type: "integer", nullable: false),
                    encomenda_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_encomenda_itens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_encomenda_itens_encomendas_encomenda_id",
                        column: x => x.encomenda_id,
                        principalTable: "encomendas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "produtos",
                columns: new[] { "id", "combina_com", "cor", "medidas", "nome", "novo", "padrao", "preco", "seccao", "stock", "tecido", "tipo" },
                values: new object[,]
                {
                    { 1, new List<int> { 5, 3 }, "Rosa", "34 × 28 × 12 cm", "Bolsa Alentejo", true, "Xadrez", 48m, "Acessorios", 6, "Algodão xadrez, forro de sarja", "Bolsa" },
                    { 2, new List<int> { 4 }, "Verde", "38 × 32 × 10 cm", "Bolsa Tote de Linho", false, "Liso", 42m, "Acessorios", 3, "Linho lavado, alças de fita", "Bolsa" },
                    { 3, new List<int> { 13, 5 }, "Lilas", "24 × 15 × 9 cm", "Necessaire Grande", true, "Floral", 26m, "Acessorios", 12, "Algodão floral, interior impermeável", "Necessaire" },
                    { 4, new List<int> { 8 }, "Azul", "18 × 11 × 7 cm", "Necessaire Pequena", false, "Xadrez", 18m, "Acessorios", 9, "Algodão xadrez, fecho de metal", "Necessaire" },
                    { 5, new List<int> { 1 }, "Rosa", "11 × 9 cm", "Porta-moedas Coração", false, "Floral", 12m, "Acessorios", 20, "Retalhos de algodão, mola de metal", "Porta-moedas" },
                    { 6, new List<int> { 4, 5 }, "Amarelo", "34 × 24 cm", "Capa de Portátil 13\"", false, "Xadrez", 38m, "Acessorios", 5, "Algodão acolchoado, velcro", "Capa" },
                    { 7, new List<int> { 3 }, "Azul", "39 × 28 cm", "Capa de Portátil 15\"", false, "Liso", 42m, "Acessorios", 4, "Linho acolchoado, velcro", "Capa" },
                    { 8, new List<int> { 5 }, "Verde", "19 × 14 cm", "Capa de Kindle", true, "Floral", 22m, "Acessorios", 7, "Algodão floral, elástico de fita", "Capa" },
                    { 9, new List<int> { 10 }, "Rosa", "22 × 26 cm", "Babete com folho", false, "Xadrez", 14m, "Bebe", 15, "Algodão duplo, atrás em felpo", "Bebé" },
                    { 10, new List<int> { 9, 4 }, "Lilas", "32 × 26 × 10 cm", "Saco de fraldas", false, "Floral", 34m, "Bebe", 6, "Algodão floral, bolsos interiores", "Bebé" },
                    { 11, new List<int> { 12 }, "Verde", "40 × 40 cm cada", "Guardanapos (jogo de 4)", false, "Xadrez", 24m, "Mesa", 10, "Linho, bainha à mão", "Mesa" },
                    { 12, new List<int> { 11 }, "Amarelo", "140 × 40 cm", "Caminho de mesa", true, "Liso", 28m, "Mesa", 5, "Linho lavado", "Mesa" },
                    { 13, new List<int> { 14 }, "Azul", "50 × 30 cm", "Toalha de mão bordada", false, "Floral", 16m, "Banho", 11, "Felpo com barra de algodão", "Banho" },
                    { 14, new List<int> { 13 }, "Lilas", "28 × 20 cm", "Cesto de banho", false, "Xadrez", 30m, "Banho", 3, "Algodão engomado, aro de vime", "Banho" },
                    { 15, new List<int> { 16 }, "Rosa", "50 × 70 cm", "Fronha com folho", false, "Floral", 32m, "Cama", 8, "Percal de algodão", "Cama" },
                    { 16, new List<int> { 15 }, "Lilas", "220 × 240 cm", "Colcha de retalhos", false, "Xadrez", 86m, "Cama", 2, "Retalhos de algodão, enchimento fino", "Cama" },
                    { 17, new List<int> { 18 }, "Rosa", "30 × 18 cm", "Luva de forno", false, "Listras", 15m, "Cozinha", 14, "Algodão com manta térmica", "Cozinha" },
                    { 18, new List<int> { 17 }, "Amarelo", "Tamanho único, fitas 1,2 m", "Avental com folho", true, "Floral", 34m, "Cozinha", 6, "Algodão floral, bolso frontal", "Cozinha" },
                    { 19, new List<int> { 20 }, "Azul", "50 × 40 cm", "Cama para gato", false, "Xadrez", 40m, "Animais", 4, "Algodão xadrez, enchimento lavável", "Pets" },
                    { 20, new List<int> { 19 }, "Verde", "Ajustável 26–40 cm", "Bandana para cão", false, "Listras", 9m, "Animais", 22, "Algodão, botão de pressão", "Pets" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_encomenda_itens_encomenda_id",
                table: "encomenda_itens",
                column: "encomenda_id");

            migrationBuilder.CreateIndex(
                name: "IX_encomendas_referencia",
                table: "encomendas",
                column: "referencia",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_encomendas_utilizador_id",
                table: "encomendas",
                column: "utilizador_id");

            migrationBuilder.CreateIndex(
                name: "IX_utilizadores_email",
                table: "utilizadores",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "encomenda_itens");

            migrationBuilder.DropTable(
                name: "produtos");

            migrationBuilder.DropTable(
                name: "encomendas");

            migrationBuilder.DropTable(
                name: "utilizadores");
        }
    }
}
