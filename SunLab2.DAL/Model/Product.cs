using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductType { get; set; }
        public float Protein { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }
        public float Calories { get; set; }

        public virtual ICollection<MealProduct> MealProducts { get; set; } = new List<MealProduct>();
    }
}
