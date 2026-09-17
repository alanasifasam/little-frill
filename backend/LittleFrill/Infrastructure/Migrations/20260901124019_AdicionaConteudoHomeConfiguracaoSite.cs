using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaConteudoHomeConfiguracaoSite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "confianca1_texto",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Tudo é cortado, cosido e passado a ferro no ateliê. Se pedir dois iguais, saem dois iguais — nunca idênticos.");

            migrationBuilder.AddColumn<string>(
                name: "confianca1_titulo",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Uma pessoa, uma máquina");

            migrationBuilder.AddColumn<string>(
                name: "confianca2_texto",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Algodão e linho pré-lavados, forro de sarja e fita de viés feita do mesmo pano. Máquina a 30°, sem drama.");

            migrationBuilder.AddColumn<string>(
                name: "confianca2_titulo",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Tecidos que aguentam");

            migrationBuilder.AddColumn<string>(
                name: "confianca3_texto_modelo",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Expedimos em 2 a 4 dias úteis por CTT, ou pode vir buscar ao ateliê. Grátis acima de {valor}.");

            migrationBuilder.AddColumn<string>(
                name: "confianca3_titulo",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Envio de Portugal");

            migrationBuilder.AddColumn<string>(
                name: "hero_corpo",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Bolsas, necessaires, capas de portátil e de Kindle, porta-moedas — e o enxoval todo para o bebé, a mesa, o banho, a cama, a cozinha e os pets da casa.");

            migrationBuilder.AddColumn<string>(
                name: "hero_cta1_label",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Ver todas as peças");

            migrationBuilder.AddColumn<string>(
                name: "hero_cta2_label",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Acessórios");

            migrationBuilder.AddColumn<string>(
                name: "hero_eyebrow",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Ateliê · Lisboa, Portugal");

            migrationBuilder.AddColumn<string>(
                name: "hero_imagem_legenda",
                table: "configuracoes_site",
                type: "text",
                nullable: false,
                defaultValue: "Algodão xadrez rosa, o padrão da casa desde 2019.");

            migrationBuilder.UpdateData(
                table: "configuracoes_site",
                keyColumn: "id",
                keyValue: 1,
                columns: new[] { "confianca1_texto", "confianca1_titulo", "confianca2_texto", "confianca2_titulo", "confianca3_texto_modelo", "confianca3_titulo", "hero_corpo", "hero_cta1_label", "hero_cta2_label", "hero_eyebrow", "hero_imagem_legenda" },
                values: new object[] { "Tudo é cortado, cosido e passado a ferro no ateliê. Se pedir dois iguais, saem dois iguais — nunca idênticos.", "Uma pessoa, uma máquina", "Algodão e linho pré-lavados, forro de sarja e fita de viés feita do mesmo pano. Máquina a 30°, sem drama.", "Tecidos que aguentam", "Expedimos em 2 a 4 dias úteis por CTT, ou pode vir buscar ao ateliê. Grátis acima de {valor}.", "Envio de Portugal", "Bolsas, necessaires, capas de portátil e de Kindle, porta-moedas — e o enxoval todo para o bebé, a mesa, o banho, a cama, a cozinha e os pets da casa.", "Ver todas as peças", "Acessórios", "Ateliê · Lisboa, Portugal", "Algodão xadrez rosa, o padrão da casa desde 2019." });

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
                name: "confianca1_texto",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "confianca1_titulo",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "confianca2_texto",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "confianca2_titulo",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "confianca3_texto_modelo",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "confianca3_titulo",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "hero_corpo",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "hero_cta1_label",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "hero_cta2_label",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "hero_eyebrow",
                table: "configuracoes_site");

            migrationBuilder.DropColumn(
                name: "hero_imagem_legenda",
                table: "configuracoes_site");

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
