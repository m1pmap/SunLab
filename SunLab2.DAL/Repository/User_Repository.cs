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

        public int GetUserIdByUsernameAsync(string username)
        {
            // Проверяем, не является ли имя пустым или null
            if (string.IsNullOrEmpty(username))
            {
                return 0; // Или выбросьте исключение, если это необходимо
            }
            else
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var user = db.Users.FirstOrDefault(u => u.UserName == username);

                    // Возвращаем идентификатор пользователя или null, если пользователь не найден
                    return user.UserID;
                }
            }

            // Ищем пользователя по имени
        }
    }
}
