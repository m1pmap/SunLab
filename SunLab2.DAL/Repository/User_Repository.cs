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
        public User ConnectUserDiseases(User user)
        {
            try
            {
                User connectedUser = new User();

                using (ApplicationContext db = new ApplicationContext())
                {
                    connectedUser = db.Users
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Symptoms)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Therapies)
                        .Include(u => u.Diseases)
                            .ThenInclude(d => d.Drugs)
                        .FirstOrDefault(u => u.UserID == user.UserID);
                }

                return connectedUser;
            }
            catch (Exception ex)
            {
                var innerEx = ex.InnerException;
                Debug.WriteLine(innerEx?.Message); // Используем оператор null-условного доступа
                return null;
            }
        }
    }
}
