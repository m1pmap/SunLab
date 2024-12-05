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
    public class SymptomSeverity_Repository : ISymptomSeverity
    {
        bool ISymptomSeverity.Add_SymptomSeverity(SymptomSeverity symptomSeverity)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.SymptomSeverities.Add(symptomSeverity);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of symptomSeverity: {symptomSeverity.Severity}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a symptomSeverity: {symptomSeverity.Severity}");
                return false;
            }
        }

        bool ISymptomSeverity.Update_SymptomSeverity(int symptomSeverityId, string newSeverity)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateSymptomSeverity = db.SymptomSeverities.FirstOrDefault(ss => ss.SymptomSeverityID == symptomSeverityId);

                    if (updateSymptomSeverity != null)
                    {
                        updateSymptomSeverity.Severity = newSeverity;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a symptomSeverity on {newSeverity}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a symptomSeverity on {newSeverity}");
                return false;
            }
        }
    }
}
