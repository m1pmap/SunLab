using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class UrineAnalise
    {
        [Key]
        public int UrineAnaliseID { get; set; }
        public int DiseaseID { get; set; }

        public string Date { get; set; }
        public double ph { get; set; }
        public double OP { get; set; }
        public double PRO { get; set; }
        public double GLU { get; set; }
        public double BIL { get; set; }
        public double UBG { get; set; }
        public double KET { get; set; }
        public double GEM { get; set; }
        public double ER { get; set; }
        public double LE { get; set; }
        public double EC { get; set; }
        public double BACT { get; set; }


        public virtual Disease Disease { get; set; }
    }
}
