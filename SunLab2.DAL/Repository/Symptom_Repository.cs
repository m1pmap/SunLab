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
    public class Symptom_Repository : ISymptom
    {
        public bool Add_Symptom(Symptom symptom)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Symptoms.Add(symptom);
                    db.SaveChanges();
                }
                Debug.WriteLine($"Successful addition of a symptom: {symptom.SymptomName}");
                return true;
            }
            catch(Exception ex) 
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a symptom: {symptom.SymptomName}");
                return false;
            }
        }
    }
}
