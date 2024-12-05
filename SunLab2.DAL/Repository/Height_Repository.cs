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
    public class Height_Repository : IHeight
    {
        public bool Add_Height(Height height)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Heights.Add(height);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition height: {height.HeightValue} on {height.Data}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition height: {height.HeightValue} on {height.Data}");
                return false;
            }
        }

        public bool Update_Height(int heightID, int newHeight)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateHeight = db.Heights.FirstOrDefault(u => u.HeightId == heightID);

                    if (updateHeight != null)
                    {
                        updateHeight.HeightValue = newHeight;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating height on: {newHeight}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating height on {newHeight}");
                return false;
            }
        }
    }
}
