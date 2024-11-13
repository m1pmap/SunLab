using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Repository
{
    public class VirusDisease_Repository : IVirusDisease
    {
        public bool Add_VirusDisease(VirusDisease virusDisease)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.VirusDiseases.Add(virusDisease);
                    db.SaveChanges();
                }

                return true;
            }
            catch(Exception ex) 
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                return false;
            }
        }
    }
}
