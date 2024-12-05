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
    public class Weight_Repository : IWeight
    {
        public bool Add_Weight(Weight weight)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Weights.Add(weight);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition weight: {weight.WeightValue} on {weight.Data}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition weight: {weight.WeightValue} on {weight.Data}");
                return false;
            }
        }

        public bool Update_Weight(int weightID, int newWeight)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateWeight = db.Weights.FirstOrDefault(u => u.WeightId == weightID);

                    if (updateWeight != null)
                    {
                        updateWeight.WeightValue = newWeight;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating weight on: {newWeight}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating weight on {newWeight}");
                return false;
            }
        }
    }
}
