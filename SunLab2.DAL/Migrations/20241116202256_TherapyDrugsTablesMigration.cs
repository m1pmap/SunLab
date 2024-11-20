using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class TherapyDrugsTablesMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VirusSymptom");

            migrationBuilder.DropTable(
                name: "VirusDiseases");

            migrationBuilder.CreateTable(
                name: "Diseases",
                columns: table => new
                {
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    DiseaseType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diseases", x => x.DiseaseId);
                    table.ForeignKey(
                        name: "FK_Diseases_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Drugs",
                columns: table => new
                {
                    DrugID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DrugName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drugs", x => x.DrugID);
                    table.ForeignKey(
                        name: "FK_Drugs_Diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Symptoms",
                columns: table => new
                {
                    SymptomID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SymptomName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    SymptomSeverity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Symptoms", x => x.SymptomID);
                    table.ForeignKey(
                        name: "FK_Symptoms_Diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Therapies",
                columns: table => new
                {
                    TherapyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TherapyName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Therapies", x => x.TherapyID);
                    table.ForeignKey(
                        name: "FK_Therapies_Diseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "Diseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Diseases_UserID",
                table: "Diseases",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Drugs_DiseaseId",
                table: "Drugs",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Symptoms_DiseaseId",
                table: "Symptoms",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Therapies_DiseaseId",
                table: "Therapies",
                column: "DiseaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Drugs");

            migrationBuilder.DropTable(
                name: "Symptoms");

            migrationBuilder.DropTable(
                name: "Therapies");

            migrationBuilder.DropTable(
                name: "Diseases");

            migrationBuilder.CreateTable(
                name: "VirusDiseases",
                columns: table => new
                {
                    VirusDiseaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    VirusDiseaseName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VirusDiseases", x => x.VirusDiseaseId);
                    table.ForeignKey(
                        name: "FK_VirusDiseases_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VirusSymptom",
                columns: table => new
                {
                    VirusSymptomID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VirusDiseaseId = table.Column<int>(type: "int", nullable: false),
                    VirusSymptomName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    VirusSymptomSeverity = table.Column<int>(type: "int", nullable: false)
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
                name: "IX_VirusDiseases_UserID",
                table: "VirusDiseases",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_VirusSymptom_VirusDiseaseId",
                table: "VirusSymptom",
                column: "VirusDiseaseId");
        }
    }
}
