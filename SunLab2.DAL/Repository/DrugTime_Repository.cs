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
    public class DrugTime_Repository : IDrugTime
    {
        public bool Add_DrugTime(DrugTime drugTime)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.DrugTimes.Add(drugTime);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of a drugTime: {drugTime.Time}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a drugTime: {drugTime.Time}");
                return false;
            }
        }

        public bool Remove_DrugTime(DrugTime drugTime)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.DrugTimes.Remove(drugTime);
                    db.SaveChanges();

                    Debug.WriteLine($"Successful remove of a drugTime: {drugTime.Time}");
                    return true;
                }
            }
            catch (Exception ex)
            { 
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error remove of a drugTime: {drugTime.Time}");
                return false;
            }
        }

        public bool Update_DrugTime(int drugId, string oldTime, string newTime)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateDrugTime = db.DrugTimes.FirstOrDefault(f => f.Time == oldTime && f.DrugId == drugId);

                    if (updateDrugTime != null)
                    {
                        updateDrugTime.Time = newTime;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a drugTime: {oldTime} on {newTime}");
                    return true;
                }
            }
            catch(Exception ex) 
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a drugTime: {oldTime} on {newTime}");
                return false;
            }
        }
    }
}
