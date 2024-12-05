using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class DrugTime
    {
        [Key]
        public int DrugTimeID { get; set; }
        [MaxLength(60)]
        public string Time { get; set; }
        public int DrugId { get; set; }

        public virtual Drug Drug { get; set; }
    }
}
