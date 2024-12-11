using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Repository
{
    public class Meal_Repository : IMeal
    {
        public bool Add_Meal(Meal meal)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Meals.Add(meal);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition meal: {meal.MealName}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition meal: {meal.MealName}");
                return false;
            }
        }
    }
}
