using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class Step
    {
        [Key]
        public int StepID { get; set; }
        public int Day { get; set; }
        public int StepsNum{  get; set; }
        public int UserID { get; set; }
        public virtual User User { get; set; }

    }
}
