using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class VirusDiseasesTableMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DiseaseName",
                table: "VirusDiseases",
                newName: "VirusDiseaseName");

            migrationBuilder.RenameColumn(
                name: "DiseaseId",
                table: "VirusDiseases",
                newName: "VirusDiseaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VirusDiseaseName",
                table: "VirusDiseases",
                newName: "DiseaseName");

            migrationBuilder.RenameColumn(
                name: "VirusDiseaseId",
                table: "VirusDiseases",
                newName: "DiseaseId");
        }
    }
}
