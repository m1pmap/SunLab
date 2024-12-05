using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Disease
    {
        [Key]
        public int DiseaseId { get; set; }
        [MaxLength(60)]
        public string DiseaseName { get; set; } = "";
        public string DiseaseType { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }


        public virtual ICollection<Symptom> Symptoms { get; set; } = new List<Symptom>();
        public virtual ICollection<Therapy> Therapies{ get; set; } = new List<Therapy>();
        public virtual ICollection<Drug> Drugs { get; set; } = new List<Drug>();
        public virtual ICollection<BloodAnalise> BloodAnalises { get; set; } = new List<BloodAnalise>();
        public virtual ICollection<UrineAnalise> UrineAnalises { get; set; } = new List<UrineAnalise>();
    }
}
