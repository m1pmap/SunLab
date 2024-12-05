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
    public class MentalEmotion_Repository : IMentalEmotion
    {
        public bool Add_MentalEmotion(MentalEmotion mentalEmotion)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.MentalEmotions.Add(mentalEmotion);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of mentalEmotin: {mentalEmotion.Emotion} day: {mentalEmotion.DayNum}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of mentalEmotin: {mentalEmotion.Emotion} day: {mentalEmotion.DayNum}");
                return false;
            }
        }

        public bool Update_MentalEmotion(int mentalEmotionId, string newEmotion)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateMentalEmotion = db.MentalEmotions.FirstOrDefault(me => me.MentalEmotionID == mentalEmotionId);

                    if (updateMentalEmotion != null)
                    {
                        updateMentalEmotion.Emotion = newEmotion;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a mentalEmotion on {newEmotion}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a mentalEmotion on {newEmotion}");
                return false;
            }
        }
    }
}
