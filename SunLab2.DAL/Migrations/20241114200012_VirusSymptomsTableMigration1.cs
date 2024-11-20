using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class VirusSymptomsTableMigration1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "VirusDiseases");

            migrationBuilder.AlterColumn<string>(
                name: "VirusDiseaseName",
                table: "VirusDiseases",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "VirusSymptom",
                columns: table => new
                {
                    VirusSymptomID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VirusSymptonName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    VirusSymptomSeverity = table.Column<int>(type: "int", nullable: false),
                    VirusDiseaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VirusSymptom", x => x.VirusSymptomID);
                    table.ForeignKey(
                        name: "FK_VirusSymptom_VirusDiseases_VirusDiseaseId",
                        column: x => x.VirusDiseaseId,
                        principalTable: "VirusDiseases",
                        principalColumn: "VirusDiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VirusSymptom_VirusDiseaseId",
                table: "VirusSymptom",
                column: "VirusDiseaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VirusSymptom");

            migrationBuilder.AlterColumn<string>(
                name: "VirusDiseaseName",
                table: "VirusDiseases",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "VirusDiseases",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
