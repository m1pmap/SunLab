using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Drug
    {
        [Key]
        public int DrugID { get; set; }
        [MaxLength(60)]
        public string DrugName { get; set; }
        public int DiseaseId { get; set; }

        public virtual Disease Disease { get; set; }
        public virtual ICollection<DrugTime> DrugTimes { get; set; } = new List<DrugTime>();
    }
}
