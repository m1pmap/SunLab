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
    public class MealProduct_Repository : IMealProduct
    {
        public bool Add_MealProduct(MealProduct mealProduct)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.MealProducts.Add(mealProduct);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition a mealProduct: {mealProduct.Gramms}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition a mealProduct: {mealProduct.Gramms}");
                return false;
            }
        }

        public bool DeleteMealProductsByMealId(int mealId)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var mealProducts = db.MealProducts
                        .Where(mp => mp.MealID == mealId);

                    db.MealProducts.RemoveRange(mealProducts);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful remove mealProduct: {mealId}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error remove mealProduct: {mealId}");
                return false;
            }
        }
    }
}
