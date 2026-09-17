using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaCamposAdminProduto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ativo",
                table: "produtos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "custo",
                table: "produtos",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "destaque",
                table: "produtos",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url",
                table: "produtos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 5, 3 }, 17.20m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 2,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 4 }, 14.70m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 3,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 13, 5 }, 8.40m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 4,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 8 }, 6.30m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 1 }, 3.10m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 4, 5 }, 13.30m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 3 }, 15.60m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 5 }, 7.70m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 10 }, 4.20m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 10,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 9, 4 }, 11.90m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 11,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 12 }, 8.40m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 12,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 11 }, 9.80m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 13,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 14 }, 5.60m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 14,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 13 }, 10.50m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 15,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 16 }, 11.20m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 16,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 15 }, 30.10m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 17,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 18 }, 5.10m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 18,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 17 }, 11.90m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 19,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 20 }, 14.50m, false, null });

            migrationBuilder.UpdateData(
                table: "produtos",
                keyColumn: "id",
                keyValue: 20,
                columns: new[] { "ativo", "combina_com", "custo", "destaque", "imagem_url" },
                values: new object[] { true, new List<int> { 19 }, 3.15m, false, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ativo",
                table: "produtos");

            migrationBuilder.DropColumn(
                name: "custo",
                table: "produtos");

            migrationBuilder.DropColumn(
                name: "destaque",
                table: "produtos");

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
        }
    }
}
