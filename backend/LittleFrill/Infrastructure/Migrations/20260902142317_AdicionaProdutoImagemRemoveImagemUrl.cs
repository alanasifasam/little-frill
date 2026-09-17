using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaProdutoImagemRemoveImagemUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "produto_imagens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ordem = table.Column<int>(type: "integer", nullable: false),
                    produto_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produto_imagens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_produto_imagens_produtos_produto_id",
                        column: x => x.produto_id,
                        principalTable: "produtos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Migra a foto de qualquer produto que já a tenha (coluna
            // imagem_url, prestes a ser removida) para a nova tabela
            // produto_imagens, como a primeira imagem (ordem 0), antes de a
            // coluna antiga desaparecer.
            migrationBuilder.Sql(
                "INSERT INTO produto_imagens (produto_id, url, ordem) SELECT id, imagem_url, 0 FROM produtos WHERE imagem_url IS NOT NULL;");

            migrationBuilder.DropColumn(
                name: "imagem_url",
                table: "produtos");

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 1,
                column: "combina_com",
                value: new List<int> { 5, 3 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 2,
                column: "combina_com",
                value: new List<int> { 4 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 3,
                column: "combina_com",
                value: new List<int> { 13, 5 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 4,
                column: "combina_com",
                value: new List<int> { 8 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 5,
                column: "combina_com",
                value: new List<int> { 1 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 6,
                column: "combina_com",
                value: new List<int> { 4, 5 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 7,
                column: "combina_com",
                value: new List<int> { 3 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 8,
                column: "combina_com",
                value: new List<int> { 5 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 9,
                column: "combina_com",
                value: new List<int> { 10 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 10,
                column: "combina_com",
                value: new List<int> { 9, 4 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 11,
                column: "combina_com",
                value: new List<int> { 12 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 12,
                column: "combina_com",
                value: new List<int> { 11 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 13,
                column: "combina_com",
                value: new List<int> { 14 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 14,
                column: "combina_com",
                value: new List<int> { 13 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 15,
                column: "combina_com",
                value: new List<int> { 16 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 16,
                column: "combina_com",
                value: new List<int> { 15 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 17,
                column: "combina_com",
                value: new List<int> { 18 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 18,
                column: "combina_com",
                value: new List<int> { 17 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 19,
                column: "combina_com",
                value: new List<int> { 20 });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 20,
                column: "combina_com",
                value: new List<int> { 19 });

            migrationBuilder.CreateIndex(
                name: "IX_produto_imagens_produto_id",
                table: "produto_imagens",
                column: "produto_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "imagem_url",
                table: "produtos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            // Copia de volta para imagem_url a primeira imagem (menor
            // ordem) de cada produto, antes de a tabela produto_imagens
            // desaparecer.
            migrationBuilder.Sql(@"
                UPDATE produtos
                SET imagem_url = primeira.url
                FROM (
                    SELECT DISTINCT ON (produto_id) produto_id, url
                    FROM produto_imagens
                    ORDER BY produto_id, ordem
                ) AS primeira
                WHERE produtos.id = primeira.produto_id;
            ");

            migrationBuilder.DropTable(
                name: "produto_imagens");

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 5, 3 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 4 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 13, 5 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 8 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 1 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 4, 5 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 3 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 5 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 10 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 10,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 9, 4 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 11,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 12 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 12,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 11 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 13,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 14 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 14,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 13 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 15,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 16 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 16,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 15 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 17,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 18 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 18,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 17 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 19,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 20 }, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 20,
                columns: new[] { "combina_com", "imagem_url" },
                values: new object[] { new List<int> { 19 }, null });
        }
    }
}
