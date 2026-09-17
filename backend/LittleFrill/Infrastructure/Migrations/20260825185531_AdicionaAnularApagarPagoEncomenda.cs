using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaAnularApagarPagoEncomenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "apagada",
                table: "encomendas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "estado_anterior",
                table: "encomendas",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "pago",
                table: "encomendas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

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
            migrationBuilder.DropColumn(
                name: "apagada",
                table: "encomendas");

            migrationBuilder.DropColumn(
                name: "estado_anterior",
                table: "encomendas");

            migrationBuilder.DropColumn(
                name: "pago",
                table: "encomendas");

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
