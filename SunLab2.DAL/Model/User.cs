using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        
        [MaxLength(60)]
        public string UserName { get; set; }
        public string sleepTime { get; set; } = "0";

        public virtual ICollection<Disease> Diseases { get; set; } = new List<Disease>();
        public virtual ICollection<MentalEmotion> MentalEmotions { get; set; } = new List<MentalEmotion>();
        public virtual ICollection<Step> Steps { get; set; } = new List<Step>();
        public virtual ICollection<Weight> Weights { get; set; } = new List<Weight>();
        public virtual ICollection<Height> Heights { get; set; } = new List<Height>();

    }
}