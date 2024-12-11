using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class FoodNote
    {
        [Key]
        public int FoodNoteId { get; set; }
        public string Date { get; set; }
        public int UserID { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();
    }
}
