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
    public class Disease_Repository : IDisease
    {
        public bool Add_Disease(Disease disease)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Diseases.Add(disease);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of a disease: {disease.DiseaseName}");
                return true;
            }
            catch(Exception ex) 
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a disease: {disease.DiseaseName}");
                return false;
            }
        }

        Disease IDisease.GetCurrentDisease(User user)
        {
            throw new NotImplementedException();
        }
    }
}
