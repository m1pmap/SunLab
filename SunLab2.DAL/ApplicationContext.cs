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
        public DbSet<DrugTime> DrugTimes { get; set; }
        public DbSet<SymptomSeverity> SymptomSeverities { get; set; }
        public DbSet<MentalEmotion> MentalEmotions { get; set; }
        public DbSet<BloodAnalise> BloodAnalises { get; set; }
        public DbSet<UrineAnalise> UrineAnalises { get; set; }
        public DbSet<Step> Steps{ get; set; }
        public DbSet<Weight> Weights{ get; set; }
        public DbSet<Height> Heights{ get; set; }
        public DbSet<Product> Products{ get; set; }
        public DbSet<FoodNote> FoodNotes { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<MealProduct> MealProducts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source = (LocalDB)\\MSSQLLocalDB; Database=SunLabDB;  AttachDbFilename=|DataDirectory|SunLabDB.mdf; Trusted_Connection=True;MultipleActiveResultSets=true; Integrated Security=True;Connect Timeout=30; TrustServerCertificate=True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Diseases) // Один пользователь может иметь много заболеваний
                .WithOne(v => v.User) // Каждое заболевание связано с одним пользователем
                .HasForeignKey(v => v.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<User>()
                .HasMany(u => u.MentalEmotions) // Один пользователь может иметь много эмоций
                .WithOne(me => me.User) // Каждая эмоция связана с одним пользователем
                .HasForeignKey(me => me.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<User>()
                .HasMany(u => u.Steps) // Один пользователь может иметь много шагов
                .WithOne(me => me.User) // Каждый шаг связана с одним пользователем
                .HasForeignKey(me => me.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<User>()
                .HasMany(u => u.Weights) // Один пользователь может иметь много весов
                .WithOne(me => me.User) // Каждый вес связана с одним пользователем
                .HasForeignKey(me => me.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<User>()
                .HasMany(u => u.Heights) // Один пользователь может иметь много ростов
                .WithOne(me => me.User) // Каждый рост связана с одним пользователем
                .HasForeignKey(me => me.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<User>()
                .HasMany(u => u.FoodNotes) // Один пользователь может иметь много записей питания
                .WithOne(me => me.User) // Каждый заметка питания связана с одним пользователем
                .HasForeignKey(me => me.UserID) // Указываем внешний ключ
                .OnDelete(DeleteBehavior.Cascade); //Каскадное удаление

            modelBuilder.Entity<FoodNote>()
                .HasMany(v => v.Meals) // Одна запись питания может иметь много приёмов пищи
                .WithOne(s => s.FoodNote) // Каждый приём пищи связан с одной записью питания
                .HasForeignKey(s => s.FoodNoteId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Symptoms) // Одна болезнь может иметь много симптомов
                .WithOne(s => s.Disease) // Каждый симптом связан с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Therapies) // Одна болезнь может иметь много методов лечения
                .WithOne(s => s.Disease) // Каждый метод лечения связан с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.Drugs) // Одна болезнь может иметь много лекарств
                .WithOne(s => s.Disease) // Каждое лекарство связано с одной болезнью
                .HasForeignKey(s => s.DiseaseId);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.BloodAnalises) // Одна болезнь может иметь много анализов крови
                .WithOne(s => s.Disease) // Каждый анализ крови связан с одной болезнью
                .HasForeignKey(s => s.DiseaseID);

            modelBuilder.Entity<Disease>()
                .HasMany(v => v.UrineAnalises) // Одна болезнь может иметь много анализов мочи
                .WithOne(s => s.Disease) // Каждый анализ мочи связан с одной болезнью
                .HasForeignKey(s => s.DiseaseID);

            modelBuilder.Entity<Drug>()
                .HasMany(v => v.DrugTimes) // Одно лекарство может иметь несколько времени приёма
                .WithOne(s => s.Drug) // Каждое время приёма связано с одним лекарством
                .HasForeignKey(s => s.DrugId);

            modelBuilder.Entity<Symptom>()
                .HasMany(v => v.SymptomSeverities) // Одно лекарство может иметь несколько времени приёма
                .WithOne(s => s.Symptom) // Каждое время приёма связано с одним лекарством
                .HasForeignKey(s => s.SymptomId);

            modelBuilder.Entity<MealProduct>()
                .HasKey(mp => new { mp.MealID, mp.ProductId }); // Композитный ключ

            modelBuilder.Entity<MealProduct>()
                .HasOne(mp => mp.Meal)
                .WithMany(m => m.MealProducts)
                .HasForeignKey(mp => mp.MealID);

            modelBuilder.Entity<MealProduct>()
                .HasOne(mp => mp.Product)
                .WithMany(p => p.MealProducts)
                .HasForeignKey(mp => mp.ProductId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
