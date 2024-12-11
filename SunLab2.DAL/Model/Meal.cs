using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Meal
    {
        [Key]
        public int MealID { get; set; }
        [MaxLength(60)]
        public string MealName { get; set; }
        public int FoodNoteId { get; set; }

        public virtual FoodNote FoodNote { get; set; }
        public virtual ICollection<MealProduct> MealProducts { get; set; } = new List<MealProduct>();
    }
}
