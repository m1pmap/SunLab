using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class VirusSymptomsTableMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VirusSymptonName",
                table: "VirusSymptom",
                newName: "VirusSymptomName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VirusSymptomName",
                table: "VirusSymptom",
                newName: "VirusSymptonName");
        }
    }
}
