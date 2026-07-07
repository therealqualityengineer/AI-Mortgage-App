using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AI.Mortgage.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class WidenCountryColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "country",
                schema: "customer",
                table: "customers",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                defaultValue: "US",
                oldClrType: typeof(string),
                oldType: "character varying(2)",
                oldMaxLength: 2,
                oldNullable: true,
                oldDefaultValue: "US");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "country",
                schema: "customer",
                table: "customers",
                type: "character varying(2)",
                maxLength: 2,
                nullable: true,
                defaultValue: "US",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true,
                oldDefaultValue: "US");
        }
    }
}
