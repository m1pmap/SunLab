using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class MealProduct
    {
        [Key]
        public int MealProductId { get; set; }
        public int MealID { get; set; }
        public int ProductId { get; set; }
        public float Gramms { get; set; } 
        public virtual Product Product { get; set; }
        public virtual Meal Meal { get; set; }
    }
}
