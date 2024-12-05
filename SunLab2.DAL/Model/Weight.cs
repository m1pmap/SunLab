using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Weight
    {
        [Key]
        public int WeightId { get; set; }
        [MaxLength(60)]
        public int WeightValue { get; set; }
        public string Data { get; set; }
        public int UserID { get; set; }
        public virtual User User { get; set; }
    }
}
