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
    public class Drug_Repository : IDrug
    {
        public bool Add_Drug(Drug drug)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Drugs.Add(drug);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of a drug: {drug.DrugName}");
                return true;
            }
            catch(Exception ex) 
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a drug: {drug.DrugName}");
                return false;
            }
        }
    }
}
