using Microsoft.EntityFrameworkCore;
using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;

namespace SunLab2.DAL
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Disease> Diseases { get; set; }
        public DbSet<Symptom> Symptoms { get; set; }
        public DbSet<Therapy> Therapies { get; set; }
        public DbSet<Drug> Drugs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(@"Server=MNS1-212N\SQLEXPRESS;Database=Test_DB;Trusted_Connection=True;MultipleActiveResultSets=true; TrustServerCertificate=True");
            //optionsBuilder.UseSqlServer(@"Server=MNS1-212N\SQLEXPRESS; Database=Test_DB; AttachDbFilename="+ GlobalStatic_Class.connectionString + ";Trusted_Connection=True;MultipleActiveResultSets=true; Integrated Security=True;Connect Timeout=30; TrustServerCertificate=True");
            //optionsBuilder.UseSqlServer("Data Source = (LocalDB)\\MSSQLLocalDB;  AttachDbFilename=" + ConnectionString_Global.Value + ";Trusted_Connection=True;MultipleActiveResultSets=true; Integrated Security=True;Connect Timeout=30; TrustServerCertificate=True");
            //optionsBuilder.UseSqlServer("Data Source = (LocalDB)\\MSSQLLocalDB; Database=SunLabDB;  AttachDbFilename=C:\\Project\\Dahmira-New-Application-master\\Dahmira-New-Application-master\\bin\\Debug\\net8.0-windows\\Dahmira_TestDb11.mdf; Trusted_Connection=True;MultipleActiveResultSets=true; Integrated Security=True;Connect Timeout=30; TrustServerCertificate=True");
            optionsBuilder.UseSqlServer("Data Source = (LocalDB)\\MSSQLLocalDB; Database=SunLabDB;  AttachDbFilename=|DataDirectory|SunLabDB.mdf; Trusted_Connection=True;MultipleActiveResultSets=true; Integrated Security=True;Connect Timeout=30; TrustServerCertificate=True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Diseases) // Один пользователь может иметь много заболеваний
                .WithOne(v => v.User) // Каждое заболевание связано с одним пользователем
                .HasForeignKey(v => v.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); // Устанавливаем каскадное удаление (по желанию)

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Symptoms) // Одна болезнь может иметь много симптомов
                .WithOne(s => s.Disease) // Каждый симптом связан с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Therapies) // Одна болезнь может иметь много методов лечения
                .WithOne(s => s.Disease) // Каждый симптом связан с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Drugs) // Одна болезнь может иметь много лекарств
                .WithOne(s => s.Disease) // Каждый симптом связан с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
