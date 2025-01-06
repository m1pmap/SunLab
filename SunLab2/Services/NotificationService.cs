
using SunLab2.DAL;
using SunLab2.DAL.Repository;
using Telegram.Bot;
using System.Globalization;
using System.Diagnostics;
using SunLab2.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using SunLab2.DAL.Model;


namespace SunLab2.Services
{
    public class NotificationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ITelegramBotClient _botClient;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IServiceProvider serviceProvider, ITelegramBotClient botClient, ILogger<NotificationService> logger)
        {
            _serviceProvider = serviceProvider;
            _botClient = botClient;
            _logger = logger;
        }
        private Timer _timer;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Запускаем таймер только один раз
            _timer = new Timer(CheckTime, stoppingToken, TimeSpan.Zero, TimeSpan.FromMinutes(1));
        }

        private async void CheckTime(object state)
        {
            var stoppingToken = (CancellationToken)state;

            try
            {
                var currentTime = DateTime.Now.ToString("HH:mm");

                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
                    var users = dbContext.Users.ToList();

                    foreach (var user in users)
                    {
                        if (user.sleepTime == currentTime)
                        {
                            // Здесь отправляем сообщение пользователю
                            await _botClient.SendTextMessageAsync(user.ChatID, "Пришло время для сна! Позаботьтесь о себе и отдохните.");
                        }

                        User connectedUser = dbContext.Users
                                            .Include(u => u.Diseases)
                                                .ThenInclude(d => d.Drugs)
                                                    .ThenInclude(dr => dr.DrugTimes)
                                            .Include(u => u.FoodNotes)
                                                .ThenInclude(fn => fn.Meals)
                                                    .ThenInclude(m => m.MealProducts)
                                                        .ThenInclude(mp => mp.Product)
                                            .FirstOrDefault(u => u.UserID == user.UserID);

                        foreach(var disease in connectedUser.Diseases)
                        {
                            foreach(var drug in disease.Drugs)
                            {
                                foreach(var drugTime in drug.DrugTimes)
                                {
                                    if(drugTime.Time == currentTime)
                                    {
                                        await _botClient.SendTextMessageAsync(user.ChatID, $"Время принимать лекарство! Пожалуйста, не забудьте принять {drug.DrugName}");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ОШИБКА: {ex.Message}");
            }
        }
    }
}
