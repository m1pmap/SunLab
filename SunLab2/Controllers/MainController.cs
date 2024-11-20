using Microsoft.AspNetCore.Mvc;
using SunLab2.Models;
using System.Diagnostics;
using SunLab2.DAL;
using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using Microsoft.EntityFrameworkCore;
using SunLab2.DAL.Repository;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace SunLab2.Controllers
{
    public class MainController : Controller
    {
        private readonly ILogger<MainController> _logger;
        private readonly IUser _userRepository;
        private readonly IDisease _diseaseRepository;
        private readonly ISymptom _symptomRepository;
        private readonly ITherapy _therapyRepository;
        private readonly IDrug _drugRepository;

        public MainController(ILogger<MainController> logger, IUser userRepository, IDisease DiseaseRepository, ISymptom SymptomRepository, ITherapy TherapyRepository, IDrug DrugRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
            _diseaseRepository = DiseaseRepository;
            _therapyRepository = TherapyRepository;
            _drugRepository = DrugRepository;
            _symptomRepository = SymptomRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult AddUser(string userName)
        {
            HttpContext.Session.SetString("UserName", userName);
            var user = new User { UserName = userName }; // Создание нового пользователя
            if (_userRepository.UserExists(user))
            {
                Debug.WriteLine("User already exists");
                User currentUser = _userRepository.GetUserByUsername(userName);
            }
            else
            {
                bool result = _userRepository.Add_User(user);
                if (result)
                {
                    Debug.WriteLine($"User added succesfully: {userName}");
                }
                else
                {
                    Debug.WriteLine($"Error added user: {userName}");
                }
            }

            string username = HttpContext.Session.GetString("UserName");


            // Получаем пользователя по имени
            User returnedUser = _userRepository.ConnectUserDiseases(_userRepository.GetUserByUsername(username));

            if (returnedUser == null)
            {
                return NotFound();
            }

            var maxDisease = returnedUser.Diseases
                .OrderByDescending(d => d.DiseaseId) // Сортируем по убыванию DiseaseId
                .FirstOrDefault(); // Получаем первую (максимальную)

            if (maxDisease == null)
            {
                return NotFound(); // Если нет болезней, возвращаем 404
            }

            // Возвращаем данные в формате JSON
            return Json(new
            {
                diseaseName = maxDisease.DiseaseName,
                symptoms = maxDisease.Symptoms.Select(s => s.SymptomName),
                symptomSeverities = maxDisease.Symptoms.Select(s => s.SymptomSeverity),
                therapies = maxDisease.Therapies.Select(t => t.TherapyName),
                drugs = maxDisease.Drugs.Select(dr => dr.DrugName)
            });

        }

        [HttpGet]
        public IActionResult GetUserData()
        {
            string username = HttpContext.Session.GetString("UserName");
            User user = _userRepository.ConnectUserDiseases(_userRepository.GetUserByUsername(username));

            if (user == null)
            {
                return NotFound();
            }

            // Возвращаем данные в формате JSON
            return Json(new
            {
                diseases = user.Diseases.Select(d => new
                {
                    diseaseName = d.DiseaseName,
                    symptoms = d.Symptoms.Select(s => s.SymptomName),
                    symptomSeverities = d.Symptoms.Select(s => s.SymptomSeverity),
                    therapies = d.Therapies.Select(t => t.TherapyName),
                    drugs = d.Drugs.Select(dr => dr.DrugName)
                })
            });
        }

        [HttpPost]
        public void AddDisease(string diseaseName, string diseaseType, string symptoms, string symptomSeverities, string therapies, string drugs)
        {
            string username = HttpContext.Session.GetString("UserName");

            List<string> symptomsList = JsonSerializer.Deserialize<List<string>>(symptoms);
            List<string> symptomSeveritiesList = JsonSerializer.Deserialize<List<string>>(symptomSeverities);
            List<string> therapiesList = JsonSerializer.Deserialize<List<string>>(therapies);
            List<string> drugsList = JsonSerializer.Deserialize<List<string>>(drugs);

            Disease disease = new Disease { DiseaseName = diseaseName, DiseaseType = diseaseType, UserID = _userRepository.GetUserByUsername(username).UserID};
            _diseaseRepository.Add_Disease(disease);

            for (int i = 0; i < symptomsList.Count; i++) 
            {
                Symptom symptom = new Symptom { SymptomName = symptomsList[i], SymptomSeverity = symptomSeveritiesList[i], DiseaseId = disease.DiseaseId };
                _symptomRepository.Add_Symptom(symptom);
            }

            for(int i = 0; i < therapiesList.Count; i++) 
            {
                Therapy therapy = new Therapy { TherapyName = therapiesList[i], DiseaseId = disease.DiseaseId };
                _therapyRepository.Add_Therapy(therapy);
            }

            for(int i = 0; i < drugsList.Count; i++)
            {
                Drug drug = new Drug { DrugName = drugsList[i], DiseaseId = disease.DiseaseId };
                _drugRepository.Add_Drug(drug);
            }
        }
    }
}
