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
    public class BloodAnalise_Repository : IBloodAnalise
    {
        public bool Add_BloodAnalise(BloodAnalise bloodAnalise)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.BloodAnalises.Add(bloodAnalise);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of blood analise.");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a blood analise.");
                return false;
            }
        }

        public bool Update_BloodAnalise(int bloodAnaliseId, List<float> newbloodAnaliseParameters)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateBloodAnalise = db.BloodAnalises.FirstOrDefault(f => f.BloodAnaliseID == bloodAnaliseId);

                    if (updateBloodAnalise != null)
                    {
                        updateBloodAnalise.RBC = newbloodAnaliseParameters[0];
                        updateBloodAnalise.HGB = newbloodAnaliseParameters[1];
                        updateBloodAnalise.WBC = newbloodAnaliseParameters[2];
                        updateBloodAnalise.CP = newbloodAnaliseParameters[3];
                        updateBloodAnalise.HCT = newbloodAnaliseParameters[4];
                        updateBloodAnalise.RET = newbloodAnaliseParameters[5];
                        updateBloodAnalise.PLT = newbloodAnaliseParameters[6];
                        updateBloodAnalise.ESR = newbloodAnaliseParameters[7];
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a blood analise.");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a blood analise.");
                return false;
            }
        }

        public double[] GetBloodAnalisesParameters(BloodAnalise bloodAnalise)
        {
            return [ 
                bloodAnalise.RBC, 
                bloodAnalise.HGB, 
                bloodAnalise.WBC, 
                bloodAnalise.CP, 
                bloodAnalise.HCT,
                bloodAnalise.RET,
                bloodAnalise.PLT,
                bloodAnalise.ESR ];
        }
    }
}
