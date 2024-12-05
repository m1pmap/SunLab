using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class analisesesTablesMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BloodAnalises",
                columns: table => new
                {
                    BloodAnaliseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RBC = table.Column<int>(type: "int", nullable: false),
                    HGB = table.Column<int>(type: "int", nullable: false),
                    WBC = table.Column<int>(type: "int", nullable: false),
                    CP = table.Column<int>(type: "int", nullable: false),
                    HCT = table.Column<int>(type: "int", nullable: false),
                    RET = table.Column<int>(type: "int", nullable: false),
                    PLT = table.Column<int>(type: "int", nullable: false),
                    ESR = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodAnalises", x => x.BloodAnaliseID);
                    table.ForeignKey(
                        name: "FK_BloodAnalises_Diseases_DiseaseID",
                        column: x => x.DiseaseID,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UrineAnalises",
                columns: table => new
                {
                    UrineAnaliseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ph = table.Column<int>(type: "int", nullable: false),
                    OP = table.Column<int>(type: "int", nullable: false),
                    PRO = table.Column<int>(type: "int", nullable: false),
                    GLU = table.Column<int>(type: "int", nullable: false),
                    BIL = table.Column<int>(type: "int", nullable: false),
                    UBG = table.Column<int>(type: "int", nullable: false),
                    KET = table.Column<int>(type: "int", nullable: false),
                    GEM = table.Column<int>(type: "int", nullable: false),
                    ER = table.Column<int>(type: "int", nullable: false),
                    LE = table.Column<int>(type: "int", nullable: false),
                    EC = table.Column<int>(type: "int", nullable: false),
                    BACT = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UrineAnalises", x => x.UrineAnaliseID);
                    table.ForeignKey(
                        name: "FK_UrineAnalises_Diseases_DiseaseID",
                        column: x => x.DiseaseID,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BloodAnalises_DiseaseID",
                table: "BloodAnalises",
                column: "DiseaseID");

            migrationBuilder.CreateIndex(
                name: "IX_UrineAnalises_DiseaseID",
                table: "UrineAnalises",
                column: "DiseaseID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BloodAnalises");

            migrationBuilder.DropTable(
                name: "UrineAnalises");
        }
    }
}
