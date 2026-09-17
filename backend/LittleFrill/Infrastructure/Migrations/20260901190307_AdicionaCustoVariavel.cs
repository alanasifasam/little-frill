using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaCustoVariavel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "custos_variaveis",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    label = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    data = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_custos_variaveis", x => x.id);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "custos_variaveis");

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
