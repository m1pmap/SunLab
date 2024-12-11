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
    public class FoodNote_Repository : IFoodNote
    {
        public bool Add_FoodNote(FoodNote foodNote)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.FoodNotes.Add(foodNote);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition foodNote: {foodNote.Date}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition foodNote: {foodNote.Date}");
                return false;
            }
        }
    }
}
