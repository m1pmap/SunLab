﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SunLab2.DAL;

#nullable disable

namespace SunLab2.DAL.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20241113211444_VirusDiseasesTableMigration2")]
    partial class VirusDiseasesTableMigration2
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SunLab2.DAL.Model.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"));

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("UserID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.VirusDisease", b =>
                {
                    b.Property<int>("VirusDiseaseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VirusDiseaseId"));

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.Property<string>("VirusDiseaseName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("VirusDiseaseId");

                    b.HasIndex("UserID");

                    b.ToTable("VirusDiseases");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.VirusDisease", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.User", "User")
                        .WithMany("VirusDiseases")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.User", b =>
                {
                    b.Navigation("VirusDiseases");
                });
#pragma warning restore 612, 618
        }
    }
}
