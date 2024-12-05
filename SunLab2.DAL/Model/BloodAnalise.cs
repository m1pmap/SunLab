using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class BloodAnalise
    {
        [Key]
        public int BloodAnaliseID { get; set; }
        public int DiseaseID { get; set; }

        public string Date { get; set; }
        public double RBC { get; set; }
        public double HGB { get; set; }
        public double WBC { get; set; }
        public double CP { get; set; }
        public double HCT { get; set; }
        public double RET { get; set; }
        public double PLT { get; set; }
        public double ESR { get; set; }


        public virtual Disease Disease { get; set; }
    }
}
