using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class SymptomSeverity
    {
        [Key]
        public int SymptomSeverityID { get; set; }
        [MaxLength(60)]
        public string Severity { get; set; }
        public string Date { get; set; }
        public int SymptomId { get; set; }

        public virtual Symptom Symptom { get; set; }
    }
}
