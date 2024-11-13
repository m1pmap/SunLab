using Microsoft.AspNetCore.Mvc;
using SunLab2.Models;
using System.Diagnostics;
using SunLab2.DAL;
using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using Microsoft.EntityFrameworkCore;

namespace SunLab2.Controllers
{
    public class MainController : Controller
    {
        private readonly ILogger<MainController> _logger;
        private readonly IUser _userRepository;
        private readonly IVirusDisease _virusDiseaseRepository;

        public MainController(ILogger<MainController> logger, IUser userRepository, IVirusDisease virusDiseaseRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
            _virusDiseaseRepository = virusDiseaseRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public void AddUser(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
            var user = new User {UserName = userName}; // Создание нового пользователя
            if (_userRepository.UserExists(user))
            {
                Debug.WriteLine("User already exists");
            }
            else
            {
                bool result = _userRepository.Add_User(user); // Вызов метода добавления
                if (result)
                {
                    Debug.WriteLine($"User added succesfully: {userName}");
                }
                else
                {
                    Debug.WriteLine($"Error added user: {userName}");
                }
            }
        }

        [HttpPost]
        public void AddVirusDisease(string virusDiseaseName)
        {
            string userName = HttpContext.Session.GetString("UserName");
            Debug.WriteLine(userName);
            Debug.WriteLine(_userRepository.GetUserIdByUsernameAsync(userName).ToString());
            var virusDisease = new VirusDisease { VirusDiseaseName = virusDiseaseName, UserID = _userRepository.GetUserIdByUsernameAsync(userName) }; // Создание нового пользователя
            bool result = _virusDiseaseRepository.Add_VirusDisease(virusDisease); // Вызов метода добавления

            if (result)
            {
                Debug.WriteLine($"Virus added succesfully: {virusDiseaseName}");
            }
            else
            {
                Debug.WriteLine($"Error added virus: {virusDiseaseName}");
            }
        }
    }
}
