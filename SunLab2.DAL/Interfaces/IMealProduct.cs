using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IMealProduct
    {
        public bool Add_MealProduct(MealProduct mealProduct);
        public bool DeleteMealProductsByMealId(int mealId);
    }
}
