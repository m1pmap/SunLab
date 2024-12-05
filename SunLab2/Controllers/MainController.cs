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
        private readonly IDrugTime _drugTimeRepository;
        private readonly ISymptomSeverity _symptomSeverityRepository;
        private readonly IMentalEmotion _mentalEmotionRepository;
        private readonly IBloodAnalise _bloodAnaliseRepository;
        private readonly IUrineAnalise _urineAnaliseRepository;
        private readonly IStep _stepRepository;
        private readonly IWeight _weightRepository;
        private readonly IHeight _heightRepository;

        public MainController(ILogger<MainController> logger, IUser userRepository, IDisease DiseaseRepository, ISymptom SymptomRepository, ITherapy TherapyRepository, IDrug DrugRepository, IDrugTime DrugTimeRepository, ISymptomSeverity SymptomSeverityRepository, IMentalEmotion mentalEmotionRepository, IBloodAnalise BloodAnaliseRepository, IUrineAnalise UrineAnaliseRepository, IStep StepRepository, IWeight WeightRepository, IHeight HeightRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
            _diseaseRepository = DiseaseRepository;
            _therapyRepository = TherapyRepository;
            _drugRepository = DrugRepository;
            _symptomRepository = SymptomRepository;
            _symptomSeverityRepository = SymptomSeverityRepository;
            _drugTimeRepository = DrugTimeRepository;
            _mentalEmotionRepository = mentalEmotionRepository;
            _bloodAnaliseRepository = BloodAnaliseRepository;
            _urineAnaliseRepository = UrineAnaliseRepository;
            _stepRepository = StepRepository;
            _weightRepository = WeightRepository;
            _heightRepository = HeightRepository;
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
            User currentUser;
            if (_userRepository.UserExists(user))
            {
                Debug.WriteLine("User already exists");
                currentUser = _userRepository.GetUserByUsername(userName);
            }
            else
            {
                bool result = _userRepository.Add_User(user);
                if (result)
                {
                    Debug.WriteLine($"User added succesfully: {userName}");
                    for(int i = 0; i < 7; i++)
                    {
                        _stepRepository.Add_Step(new Step { Day = i, StepsNum = 0, UserID = user.UserID });
                    }
                    return null;
                }
                else
                {
                    Debug.WriteLine($"Error added user: {userName}");
                    return null;
                }
            }

            string username = HttpContext.Session.GetString("UserName");


            // Получаем пользователя по имени
            User returnedUser = _userRepository.ConnectUserInformation(currentUser);

            if (returnedUser == null)
            {
                return NotFound();
            }

            var maxDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            List<Disease> userChronicDiseases = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username)).Diseases.Where(cd => cd.DiseaseType == "Chronic").ToList();
            List<Disease> userMentalDiseases = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username)).Diseases.Where(md => md.DiseaseType == "Mental").ToList();
            if (maxDisease == null)
            {
                maxDisease = new Disease();
            }

            // Возвращаем данные в формате JSON
            return Json(new
            {
                userSleepTime = returnedUser.sleepTime,
                virusDisease = new
                {
                    diseaseName = maxDisease.DiseaseName,
                    symptoms = maxDisease.Symptoms.Select(s => new
                    {
                        symptomName = s.SymptomName, // Имя симптома
                        symptomSeverities = s.SymptomSeverities.Select(ss => new
                        {
                            severity = ss.Severity, // Тяжесть
                            date = ss.Date // Дата
                        })
                    }),
                    therapies = maxDisease.Therapies.Select(t => t.TherapyName),
                    drugs = maxDisease.Drugs.Select(dr => new
                    {
                        DrugName = dr.DrugName,
                        DrugTimes = dr.DrugTimes.Select(dt => dt.Time)
                    }),
                    bloodAnalises = maxDisease.BloodAnalises.Select(ba => new
                    {
                        data = ba.Date,
                        analiseParameters = _bloodAnaliseRepository.GetBloodAnalisesParameters(ba)
                    }),
                    urineAnalises = maxDisease.UrineAnalises.Select(ua => new
                    {
                        data = ua.Date,
                        analiseParameters = _urineAnaliseRepository.GetUrineAnalisesParameters(ua)
                    })
                },

                chronicDiseases = userChronicDiseases.Select(cd => new
                {
                    diseaseName = cd.DiseaseName,
                    symptoms = cd.Symptoms.Select(s => new
                    {
                        symptomName = s.SymptomName,
                        symptomSeverities = s.SymptomSeverities.Select(ss => new
                        {
                            severity = ss.Severity,
                            date = ss.Date
                        })
                    }),
                    therapies = cd.Therapies.Select(t => t.TherapyName),
                    drugs = cd.Drugs.Select(dr => new
                    {
                        DrugName = dr.DrugName,
                        DrugTimes = dr.DrugTimes.Select(dt => dt.Time)
                    }),
                    bloodAnalises = cd.BloodAnalises.Select(ba => new
                    {
                        data = ba.Date,
                        analiseParameters = _bloodAnaliseRepository.GetBloodAnalisesParameters(ba)
                    }),
                    urineAnalises = cd.UrineAnalises.Select(ua => new
                    {
                        data = ua.Date,
                        analiseParameters = _urineAnaliseRepository.GetUrineAnalisesParameters(ua)
                    })
                }),

                mentalDiseases = userMentalDiseases.Select(md => new
                {
                    diseaseName = md.DiseaseName,
                    symptoms = md.Symptoms.Select(s => new
                    {
                        symptomName = s.SymptomName,
                        symptomSeverities = s.SymptomSeverities.Select(ss => new
                        {
                            severity = ss.Severity,
                            date = ss.Date
                        })
                    }),
                    therapies = md.Therapies.Select(t => t.TherapyName),
                    drugs = md.Drugs.Select(dr => new
                    {
                        DrugName = dr.DrugName,
                        DrugTimes = dr.DrugTimes.Select(dt => dt.Time)
                    }),
                    bloodAnalises = md.BloodAnalises.Select(ba => new
                    {
                        data = ba.Date,
                        analiseParameters = _bloodAnaliseRepository.GetBloodAnalisesParameters(ba)
                    }),
                    urineAnalises = md.UrineAnalises.Select(ua => new
                    {
                        data = ua.Date,
                        analiseParameters = _urineAnaliseRepository.GetUrineAnalisesParameters(ua)
                    })
                }),
                mentalEmotions = returnedUser.MentalEmotions.Select(me => new
                {
                    emotion = me.Emotion,
                    dayNum = me.DayNum
                }),
                userSteps = returnedUser.Steps.Select(s => new
                {
                    steps = s.StepsNum,
                    day = s.Day
                }),
                userWeight = returnedUser.Weights.Select(w => new
                {
                    weight = w.WeightValue,
                    data = w.Data
                }),
                userHeight = returnedUser.Heights.Select(h => new
                {
                    height = h.HeightValue,
                    data = h.Data
                })
            }) ;
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
                Symptom symptom = new Symptom { SymptomName = symptomsList[i], DiseaseId = disease.DiseaseId };
                _symptomRepository.Add_Symptom(symptom);
                SymptomSeverity symptomSeverity = new SymptomSeverity { Severity = symptomSeveritiesList[i], SymptomId = symptom.SymptomID, Date = DateTime.Now.ToString("dd.MM.yyyy")};
                _symptomSeverityRepository.Add_SymptomSeverity(symptomSeverity);

            }

            for (int i = 0; i < therapiesList.Count; i++) 
            {
                Therapy therapy = new Therapy { TherapyName = therapiesList[i], DiseaseId = disease.DiseaseId };
                _therapyRepository.Add_Therapy(therapy);
            }

            for(int i = 0; i < drugsList.Count; i++)
            {
                Drug drug = new Drug { DrugName = drugsList[i], DiseaseId = disease.DiseaseId };
                _drugRepository.Add_Drug(drug);
                DrugTime drugTime = new DrugTime { DrugId = drug.DrugID, Time = "05:08" };
                _drugTimeRepository.Add_DrugTime(drugTime);
            }
        }

        [HttpPost]
        public void AddSymptom(string symptomName, string newSymptomSeverity, string diseaseType, string diseaseName = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if (diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if(diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if(diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            Symptom symptom = new Symptom { SymptomName = symptomName, DiseaseId = currentDisease.DiseaseId };
            _symptomRepository.Add_Symptom(symptom);
            SymptomSeverity symptomSeverity = new SymptomSeverity { Severity = newSymptomSeverity, SymptomId = symptom.SymptomID, Date = DateTime.Now.ToString("dd.MM.yyyy") };
            _symptomSeverityRepository.Add_SymptomSeverity(symptomSeverity);
        }

        [HttpPost]
        public void AddTherapy(string therapyName, string diseaseType, string diseaseName = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if(diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if(diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            Therapy therapy = new Therapy { TherapyName = therapyName, DiseaseId = currentDisease.DiseaseId };
            _therapyRepository.Add_Therapy(therapy);
        }

        [HttpPost]
        public void Drug(string drugName, string diseaseType, string diseaseName = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if(diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if(diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            Drug drug = new Drug { DrugName = drugName, DiseaseId = currentDisease.DiseaseId };
            _drugRepository.Add_Drug(drug);
            DrugTime drugTime = new DrugTime { DrugId = drug.DrugID, Time = "05:08" };
            _drugTimeRepository.Add_DrugTime(drugTime);
        }

        [HttpPost]
        public void CUDDrugTime(string drugName, string drugTime, string diseaseType, string updateDrugTime = null, string diseaseName = null)
        {
            Debug.WriteLine(diseaseType);
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if(diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if(diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            Drug currentDrug = currentDisease.Drugs.FirstOrDefault(d => d.DrugName == drugName);
            DrugTime findDrugTime = currentDrug.DrugTimes.FirstOrDefault(dt => dt.Time == drugTime);

            if (updateDrugTime == null) 
            {
                if (findDrugTime == null)
                {
                    DrugTime newdrugTime = new DrugTime { DrugId = currentDrug.DrugID, Time = drugTime };
                    _drugTimeRepository.Add_DrugTime(newdrugTime);
                }
                else
                {
                    _drugTimeRepository.Remove_DrugTime(findDrugTime);
                }
            }
            else
            {
                _drugTimeRepository.Update_DrugTime(findDrugTime.DrugId, drugTime, updateDrugTime);
            }
        }

        [HttpPost]
        public void CUSymptomSeverities(string symptomName, string symptomSeverity, string diseaseType, string updateSymptomSeverity = null, string diseaseName = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if (diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if(diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            Symptom currentSymptom = currentDisease.Symptoms.FirstOrDefault(s => s.SymptomName == symptomName);

            if (updateSymptomSeverity == null)
            {
                SymptomSeverity newSymptomSeverity = new SymptomSeverity { SymptomId = currentSymptom.SymptomID, Severity = symptomSeverity, Date = DateTime.Now.ToString("dd.MM.yyyy") };
                _symptomSeverityRepository.Add_SymptomSeverity(newSymptomSeverity);
            }
            else
            {
                SymptomSeverity findSymptomSeverity = currentSymptom.SymptomSeverities.ToList()[currentSymptom.SymptomSeverities.Count - 1];
                _symptomSeverityRepository.Update_SymptomSeverity(findSymptomSeverity.SymptomSeverityID, updateSymptomSeverity);
            }
        }

        [HttpPost]
        public void CUMentalEmotion(string mentalEmotion = null, string updateMentalEmotion = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User connectedUser = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username));

            if (updateMentalEmotion == null)
            {
                MentalEmotion newMentalEmotion = new MentalEmotion { Emotion = mentalEmotion, DayNum = DateTime.Now.Day - 1, UserID = connectedUser.UserID};
                _mentalEmotionRepository.Add_MentalEmotion(newMentalEmotion);
            }
            else
            {
                MentalEmotion findMentalEmotion = connectedUser.MentalEmotions.ToList()[connectedUser.MentalEmotions.Count - 1];
                _mentalEmotionRepository.Update_MentalEmotion(findMentalEmotion.MentalEmotionID, updateMentalEmotion);
            }
        }

        [HttpPost]
        public void CUBloodAnalise(string diseaseType, string diseaseName = null, string bloodAnaliseParameters = null, string updatebloodAnaliseParameters = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if (diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if (diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            if (bloodAnaliseParameters !=  null) 
            {
                List<float> bloodAnaliseParametersList = JsonSerializer.Deserialize<List<float>>(bloodAnaliseParameters);
                BloodAnalise newBloodAnalise = new BloodAnalise 
                { 
                    DiseaseID = currentDisease.DiseaseId,
                    Date = DateTime.Now.ToString("dd.MM.yyyy"),
                    RBC = bloodAnaliseParametersList[0],
                    HGB = bloodAnaliseParametersList[1],
                    WBC = bloodAnaliseParametersList[2],
                    CP = bloodAnaliseParametersList[3],
                    HCT = bloodAnaliseParametersList[4],
                    RET = bloodAnaliseParametersList[5],
                    PLT = bloodAnaliseParametersList[6],
                    ESR = bloodAnaliseParametersList[7]
                };
                _bloodAnaliseRepository.Add_BloodAnalise(newBloodAnalise);

            }
            else
            {
                List<float> updateBloodAnaliseParametersList = JsonSerializer.Deserialize<List<float>>(updatebloodAnaliseParameters);
                BloodAnalise findBloodAnalise = currentDisease.BloodAnalises.ToList()[currentDisease.BloodAnalises.Count - 1];
                _bloodAnaliseRepository.Update_BloodAnalise(findBloodAnalise.BloodAnaliseID, updateBloodAnaliseParametersList);
            }
        }

        [HttpPost]
        public void CUUrineAnalise(string diseaseType, string diseaseName = null, string urineAnaliseParameters = null, string updateUrineAnaliseParameters = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            Disease currentDisease = new Disease();
            if (diseaseType == "virus")
            {
                currentDisease = _userRepository.GetCurrentVirusDisease(currentUser);
            }
            else if (diseaseType == "chronic")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Chronic");
            }
            else if (diseaseType == "mental")
            {
                currentDisease = _userRepository.GetDiseaseByName(currentUser, diseaseName, "Mental");
            }

            if (urineAnaliseParameters != null)
            {
                List<float> urineAnaliseParametersList = JsonSerializer.Deserialize<List<float>>(urineAnaliseParameters);
                UrineAnalise newUrineAnalise = new UrineAnalise
                {
                    DiseaseID = currentDisease.DiseaseId,
                    Date = DateTime.Now.ToString("dd.MM.yyyy"),
                    ph = urineAnaliseParametersList[0],
                    OP = urineAnaliseParametersList[1],
                    PRO = urineAnaliseParametersList[2],
                    GLU = urineAnaliseParametersList[3],
                    BIL = urineAnaliseParametersList[4],
                    UBG = urineAnaliseParametersList[5],
                    KET = urineAnaliseParametersList[6],
                    GEM = urineAnaliseParametersList[7],
                    ER = urineAnaliseParametersList[8],
                    LE = urineAnaliseParametersList[9],
                    EC = urineAnaliseParametersList[10],
                    BACT = urineAnaliseParametersList[11]
                };
                _urineAnaliseRepository.Add_UrineAnalise(newUrineAnalise);

            }
            else
            {
                List<float> updateUrineAnaliseParametersList = JsonSerializer.Deserialize<List<float>>(updateUrineAnaliseParameters);
                UrineAnalise findUrineAnalise = currentDisease.UrineAnalises.ToList()[currentDisease.UrineAnalises.Count - 1];
                _urineAnaliseRepository.Update_UrineAnalise(findUrineAnalise.UrineAnaliseID, updateUrineAnaliseParametersList);
            }
        }

        [HttpPost]
        public void USleepTime(string newSleepTime)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.GetUserByUsername(username);
            _userRepository.UpdateUserSleepTime(currentUser.UserID, newSleepTime);
        }

        [HttpPost]
        public void USteps(string updateStep)
        {
            string username = HttpContext.Session.GetString("UserName");
            User currentUser = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username));
            int day = ((int)DateTime.Now.DayOfWeek + 6) % 7;
            Step currentStep = currentUser.Steps.FirstOrDefault(s => s.Day == day);
            _stepRepository.Update_Step(currentStep.StepID, Convert.ToInt32(updateStep));
        }

        [HttpPost]
        public void CUWeight(string weight = null, string updateWeight = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User connectedUser = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username));

            if (weight != null)
            {
                Weight newWeight = new Weight { WeightValue = Convert.ToInt32(weight), Data = DateTime.Now.ToString("dd.MM.yyyy"), UserID = connectedUser.UserID };
                _weightRepository.Add_Weight(newWeight);
            }
            else
            {
                Weight findWeight = connectedUser.Weights.ToList()[connectedUser.Weights.Count - 1];
                _weightRepository.Update_Weight(findWeight.WeightId, Convert.ToInt32(updateWeight));
            }
        }

        [HttpPost]
        public void CUHeight(string height = null, string updateHeight = null)
        {
            string username = HttpContext.Session.GetString("UserName");
            User connectedUser = _userRepository.ConnectUserInformation(_userRepository.GetUserByUsername(username));

            if (height != null)
            {
                Height newHeight = new Height { HeightValue = Convert.ToInt32(height), Data = DateTime.Now.ToString("dd.MM.yyyy"), UserID = connectedUser.UserID };
                _heightRepository.Add_Height(newHeight);
            }
            else
            {
                Height findHeight = connectedUser.Heights.ToList()[connectedUser.Heights.Count - 1];
                _heightRepository.Update_Height(findHeight.HeightId, Convert.ToInt32(updateHeight));
            }
        }
    }
}
