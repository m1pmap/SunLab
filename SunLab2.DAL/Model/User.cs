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

        public virtual ICollection<VirusDisease> VirusDiseases { get; set; }
    }
}