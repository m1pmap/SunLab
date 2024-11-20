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
    public class Therapy_Repository : ITherapy
    {
        public bool Add_Therapy(Therapy therapy)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Therapies.Add(therapy);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of a therapy: {therapy.TherapyName}");
                return true;
            }
            catch(Exception ex) 
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a therapy: {therapy.TherapyName}");
                return false;
            }
        }
    }
}
