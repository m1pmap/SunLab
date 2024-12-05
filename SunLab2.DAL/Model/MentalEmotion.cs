using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class MentalEmotion
    {
        [Key]
        public int MentalEmotionID { get; set; }
        [MaxLength(60)]
        public string Emotion { get; set; }
        public int DayNum { get; set; }
        public int UserID { get; set; }
        public virtual User User { get; set; }
    }
}
