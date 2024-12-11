
using SunLab2.DAL;
using SunLab2.DAL.Repository;
using Telegram.Bot;
using System.Globalization;


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

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _botClient.SendTextMessageAsync(1220910705, "Привет");
            //User currentUser = _userRepository.GetUserByUsername(username);

            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
                    // Получаем список уникальных Twitch-имен
                    //var twitchUsers = dbContext.Twitch_Subscriptions
                    //    .Select(s => s.TwitchChannel)
                    //    .Distinct()
                    //    .ToList();

                    //foreach (var twitchChannel in twitchUsers)
                    //{
                    //    try
                    //    {
                    //        var accessToken = await _twitchService.GetAccessToken();
                    //        var stream = await _twitchService.CheckStreamStatus(twitchChannel, accessToken);

                    //        if (stream.startedAt != null)
                    //        {
                    //            DateTime nowUtc = DateTime.UtcNow;

                    //            if ((nowUtc - stream.startedAt.Value).TotalMinutes <= 5)
                    //            {
                    //                var subscribers = dbContext.Twitch_Subscriptions
                    //                    .Where(s => s.TwitchChannel == twitchChannel)
                    //                    .Select(s => s.User.ChatId)
                    //                    .ToList();

                    //                foreach (var chatId in subscribers)
                    //                {
                    //                    await _botClient.SendTextMessageAsync(
                    //                    chatId,
                    //                        $"📣 Стрим начался:\n{stream.streamInfo}\n🔗 <a href=\"https://www.twitch.tv/{twitchChannel}\">Ссылка на стрим</a>",
                    //                        parseMode: Telegram.Bot.Types.Enums.ParseMode.Html
                    //                    );
                    //                }
                    //            }
                    //        }
                    //    }
                    //    catch (Exception ex)
                    //    {
                    //        _logger.LogError(ex, $"Ошибка при обработке Twitch пользователя {twitchChannel}");
                    //    }
                    //}
                }
            }
        }
    }
}
