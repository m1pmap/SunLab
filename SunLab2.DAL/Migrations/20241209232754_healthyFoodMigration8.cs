using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    /// <inheritdoc />
    public partial class healthyFoodMigration8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Meals",
                columns: table => new
                {
                    MealID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MealName = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    FoodNoteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meals", x => x.MealID);
                    table.ForeignKey(
                        name: "FK_Meals_FoodNotes_FoodNoteId",
                        column: x => x.FoodNoteId,
                        principalTable: "FoodNotes",
                        principalColumn: "FoodNoteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Meals_FoodNoteId",
                table: "Meals",
                column: "FoodNoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Meals");
        }
    }
}
