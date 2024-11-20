using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Therapy
    {
        [Key]
        public int TherapyID { get; set; }
        [MaxLength(60)]
        public string TherapyName { get; set; }
        public int DiseaseId { get; set; }


        public virtual Disease Disease { get; set; }
    }
}
