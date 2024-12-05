using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class newMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SymptomSeverity",
                table: "Symptoms");

            migrationBuilder.CreateTable(
                name: "SymptomSeverities",
                columns: table => new
                {
                    SymptomSeverityID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Severity = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SymptomId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SymptomSeverities", x => x.SymptomSeverityID);
                    table.ForeignKey(
                        name: "FK_SymptomSeverities_Symptoms_SymptomId",
                        column: x => x.SymptomId,
                        principalTable: "Symptoms",
                        principalColumn: "SymptomID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SymptomSeverities_SymptomId",
                table: "SymptomSeverities",
                column: "SymptomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SymptomSeverities");

            migrationBuilder.AddColumn<string>(
                name: "SymptomSeverity",
                table: "Symptoms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
