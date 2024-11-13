using Microsoft.EntityFrameworkCore;
using SunLab2.DAL.Model;

namespace SunLab2.DAL
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<VirusDisease> VirusDiseases { get; set; }

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
            // Связь один-ко-многим (One-to-Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.VirusDiseases) // Один пользователь может иметь много заболеваний
                .WithOne(v => v.User) // Каждое заболевание связано с одним пользователем
                .HasForeignKey(v => v.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); // Устанавливаем каскадное удаление (по желанию)

            base.OnModelCreating(modelBuilder);
        }
    }
}
