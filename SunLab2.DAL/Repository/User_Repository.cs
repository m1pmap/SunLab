using SunLab2.DAL.Model;
using SunLab2.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SunLab2.DAL;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace SunLab2.DAL.Repository
{
    public class User_Repository : IUser
    {
        public bool Add_User(User user)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Users.Add(user);
                    db.SaveChanges();
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UserExists(User user) 
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.Users.ToList().Any(u => u.UserName == user.UserName);
            }
        }

        public User GetUserByUsername(string username)
        {
            // Проверяем, не является ли имя пустым или null
            if (string.IsNullOrEmpty(username))
            {
                return null; // Или выбросьте исключение, если это необходимо
            }
            else
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    return db.Users.FirstOrDefault(u => u.UserName == username);
                }
            }
        }
        public User ConnectUserInformation(User user)
        {
            try
            {
                User connectedUser = new User();

                using (ApplicationContext db = new ApplicationContext())
                {
                    connectedUser = db.Users
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Symptoms)
                                .ThenInclude(ss => ss.SymptomSeverities)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Therapies)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Drugs)
                                .ThenInclude(dr => dr.DrugTimes)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.BloodAnalises)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.UrineAnalises)
                        .Include(u => u.FoodNotes)
                            .ThenInclude(fn => fn.Meals)
                                .ThenInclude(m => m.MealProducts)
                                    .ThenInclude(mp => mp.Product)
                        .Include(u => u.MentalEmotions)
                        .Include(u => u.Steps)
                        .Include(u => u.Weights)
                        .Include(u => u.Heights)
                        .FirstOrDefault(u => u.UserID == user.UserID);
                }

                return connectedUser;
            }
            catch (Exception ex)
            {
                var innerEx = ex.InnerException;
                Debug.WriteLine(innerEx?.Message);
                return null;
            }
        }

        public Disease GetCurrentVirusDisease(User _user)
        {
            try
            {
                User connectedUser = ConnectUserInformation(_user);
                var currentDisease = connectedUser.Diseases
                    .Where(d => d.DiseaseType == "Virus") 
                    .OrderByDescending(d => d.DiseaseId)
                    .FirstOrDefault();

                return currentDisease;
            }
            catch (Exception ex)
            {
                var innerEx = ex.InnerException;
                Debug.WriteLine(innerEx?.Message); // Используем оператор null-условного доступа
                return null;
            }
        }

        public Disease GetDiseaseByName(User user, string diseaseName, string diseaseType)
        {
            try
            {
                User connectedUser = ConnectUserInformation(user);
                var chronicDisease = connectedUser.Diseases
                    .FirstOrDefault(d => d.DiseaseType == diseaseType && d.DiseaseName == diseaseName);

                return chronicDisease;
            }
            catch (Exception ex)
            {
                var innerEx = ex.InnerException;
                Debug.WriteLine(innerEx?.Message); // Используем оператор null-условного доступа
                return null;
            }
        }

        public bool UpdateUserSleepTime(int userId, string newSleepTime)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateUser = db.Users.FirstOrDefault(u => u.UserID == userId );

                    if (updateUser != null)
                    {
                        updateUser.sleepTime = newSleepTime;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a sleepTime on {newSleepTime}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a sleepTime on {newSleepTime}");
                return false;
            }
        }

        public bool UpdateUserSupportingWeight(int userId, float newSupportingWeight)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateUser = db.Users.FirstOrDefault(u => u.UserID == userId);

                    if (updateUser != null)
                    {
                        updateUser.supportingWeight = newSupportingWeight;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating supportingWeight on {newSupportingWeight}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating supportingWeight on {newSupportingWeight}");
                return false;
            }
        }
    }
}
