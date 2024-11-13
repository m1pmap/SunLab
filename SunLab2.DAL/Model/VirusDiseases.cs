using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Model
{
    public class VirusDisease
    {
        [Key]
        public int VirusDiseaseId { get; set; }
        public string VirusDiseaseName { get; set; }
        public int UserID { get; set; }

        // Навигационное свойство для связи с пользователем
        public virtual User User { get; set; }
    }
}
