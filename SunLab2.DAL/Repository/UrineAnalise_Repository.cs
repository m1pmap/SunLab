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
    public class UrineAnalise_Repository : IUrineAnalise
    {
        public bool Add_UrineAnalise(UrineAnalise urineAnalise)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.UrineAnalises.Add(urineAnalise);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of urine analise.");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a urine analise.");
                return false;
            }
        }

        public bool Update_UrineAnalise(int urineAnaliseId, List<float> newUrineAnaliseParameters)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateUrineAnalise = db.UrineAnalises.FirstOrDefault(f => f.UrineAnaliseID == urineAnaliseId);

                    if (updateUrineAnalise != null)
                    {
                        updateUrineAnalise.ph = newUrineAnaliseParameters[0];
                        updateUrineAnalise.OP = newUrineAnaliseParameters[1];
                        updateUrineAnalise.PRO = newUrineAnaliseParameters[2];
                        updateUrineAnalise.GLU = newUrineAnaliseParameters[3];
                        updateUrineAnalise.BIL = newUrineAnaliseParameters[4];
                        updateUrineAnalise.UBG = newUrineAnaliseParameters[5];
                        updateUrineAnalise.KET = newUrineAnaliseParameters[6];
                        updateUrineAnalise.GEM = newUrineAnaliseParameters[7];
                        updateUrineAnalise.ER = newUrineAnaliseParameters[8];
                        updateUrineAnalise.LE = newUrineAnaliseParameters[9];
                        updateUrineAnalise.EC = newUrineAnaliseParameters[10];
                        updateUrineAnalise.BACT = newUrineAnaliseParameters[11];
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a urine analise.");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a urine analise.");
                return false;
            }
        }

        public double[] GetUrineAnalisesParameters(UrineAnalise urineAnalise)
        {
            return [
                urineAnalise.ph,
                urineAnalise.OP,
                urineAnalise.PRO,
                urineAnalise.GLU,
                urineAnalise.BIL,
                urineAnalise.UBG,
                urineAnalise.KET,
                urineAnalise.GEM,
                urineAnalise.ER,
                urineAnalise.LE,
                urineAnalise.EC,
                urineAnalise.BACT
            ];
        }
    }
}
