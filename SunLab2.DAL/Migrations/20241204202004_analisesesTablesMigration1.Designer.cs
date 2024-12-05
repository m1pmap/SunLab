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
    [Migration("20241204202004_analisesesTablesMigration1")]
    partial class analisesesTablesMigration1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SunLab2.DAL.Model.BloodAnalise", b =>
                {
                    b.Property<int>("BloodAnaliseID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BloodAnaliseID"));

                    b.Property<double>("CP")
                        .HasColumnType("float");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DiseaseID")
                        .HasColumnType("int");

                    b.Property<double>("ESR")
                        .HasColumnType("float");

                    b.Property<double>("HCT")
                        .HasColumnType("float");

                    b.Property<double>("HGB")
                        .HasColumnType("float");

                    b.Property<double>("PLT")
                        .HasColumnType("float");

                    b.Property<double>("RBC")
                        .HasColumnType("float");

                    b.Property<double>("RET")
                        .HasColumnType("float");

                    b.Property<double>("WBC")
                        .HasColumnType("float");

                    b.HasKey("BloodAnaliseID");

                    b.HasIndex("DiseaseID");

                    b.ToTable("BloodAnalises");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Disease", b =>
                {
                    b.Property<int>("DiseaseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DiseaseId"));

                    b.Property<string>("DiseaseName")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<string>("DiseaseType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("DiseaseId");

                    b.HasIndex("UserID");

                    b.ToTable("Diseases");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Drug", b =>
                {
                    b.Property<int>("DrugID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DrugID"));

                    b.Property<int>("DiseaseId")
                        .HasColumnType("int");

                    b.Property<string>("DrugName")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("DrugID");

                    b.HasIndex("DiseaseId");

                    b.ToTable("Drugs");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.DrugTime", b =>
                {
                    b.Property<int>("DrugTimeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("DrugTimeID"));

                    b.Property<int>("DrugId")
                        .HasColumnType("int");

                    b.Property<string>("Time")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("DrugTimeID");

                    b.HasIndex("DrugId");

                    b.ToTable("DrugTimes");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.MentalEmotion", b =>
                {
                    b.Property<int>("MentalEmotionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MentalEmotionID"));

                    b.Property<int>("DayNum")
                        .HasColumnType("int");

                    b.Property<string>("Emotion")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("MentalEmotionID");

                    b.HasIndex("UserID");

                    b.ToTable("MentalEmotions");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Symptom", b =>
                {
                    b.Property<int>("SymptomID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SymptomID"));

                    b.Property<int>("DiseaseId")
                        .HasColumnType("int");

                    b.Property<string>("SymptomName")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("SymptomID");

                    b.HasIndex("DiseaseId");

                    b.ToTable("Symptoms");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.SymptomSeverity", b =>
                {
                    b.Property<int>("SymptomSeverityID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SymptomSeverityID"));

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Severity")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<int>("SymptomId")
                        .HasColumnType("int");

                    b.HasKey("SymptomSeverityID");

                    b.HasIndex("SymptomId");

                    b.ToTable("SymptomSeverities");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Therapy", b =>
                {
                    b.Property<int>("TherapyID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TherapyID"));

                    b.Property<int>("DiseaseId")
                        .HasColumnType("int");

                    b.Property<string>("TherapyName")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("TherapyID");

                    b.HasIndex("DiseaseId");

                    b.ToTable("Therapies");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.UrineAnalise", b =>
                {
                    b.Property<int>("UrineAnaliseID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UrineAnaliseID"));

                    b.Property<double>("BACT")
                        .HasColumnType("float");

                    b.Property<double>("BIL")
                        .HasColumnType("float");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DiseaseID")
                        .HasColumnType("int");

                    b.Property<double>("EC")
                        .HasColumnType("float");

                    b.Property<double>("ER")
                        .HasColumnType("float");

                    b.Property<double>("GEM")
                        .HasColumnType("float");

                    b.Property<double>("GLU")
                        .HasColumnType("float");

                    b.Property<double>("KET")
                        .HasColumnType("float");

                    b.Property<double>("LE")
                        .HasColumnType("float");

                    b.Property<double>("OP")
                        .HasColumnType("float");

                    b.Property<double>("PRO")
                        .HasColumnType("float");

                    b.Property<double>("UBG")
                        .HasColumnType("float");

                    b.Property<double>("ph")
                        .HasColumnType("float");

                    b.HasKey("UrineAnaliseID");

                    b.HasIndex("DiseaseID");

                    b.ToTable("UrineAnalises");
                });

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

            modelBuilder.Entity("SunLab2.DAL.Model.BloodAnalise", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Disease", "Disease")
                        .WithMany("BloodAnalises")
                        .HasForeignKey("DiseaseID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Disease");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Disease", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.User", "User")
                        .WithMany("Diseases")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Drug", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Disease", "Disease")
                        .WithMany("Drugs")
                        .HasForeignKey("DiseaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Disease");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.DrugTime", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Drug", "Drug")
                        .WithMany("DrugTimes")
                        .HasForeignKey("DrugId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Drug");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.MentalEmotion", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.User", "User")
                        .WithMany("MentalEmotions")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Symptom", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Disease", "Disease")
                        .WithMany("Symptoms")
                        .HasForeignKey("DiseaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Disease");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.SymptomSeverity", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Symptom", "Symptom")
                        .WithMany("SymptomSeverities")
                        .HasForeignKey("SymptomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Symptom");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Therapy", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Disease", "Disease")
                        .WithMany("Therapies")
                        .HasForeignKey("DiseaseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Disease");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.UrineAnalise", b =>
                {
                    b.HasOne("SunLab2.DAL.Model.Disease", "Disease")
                        .WithMany("UrineAnalises")
                        .HasForeignKey("DiseaseID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Disease");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Disease", b =>
                {
                    b.Navigation("BloodAnalises");

                    b.Navigation("Drugs");

                    b.Navigation("Symptoms");

                    b.Navigation("Therapies");

                    b.Navigation("UrineAnalises");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Drug", b =>
                {
                    b.Navigation("DrugTimes");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.Symptom", b =>
                {
                    b.Navigation("SymptomSeverities");
                });

            modelBuilder.Entity("SunLab2.DAL.Model.User", b =>
                {
                    b.Navigation("Diseases");

                    b.Navigation("MentalEmotions");
                });
#pragma warning restore 612, 618
        }
    }
}
