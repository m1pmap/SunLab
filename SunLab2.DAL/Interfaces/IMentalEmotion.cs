using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IMentalEmotion
    {
        bool Add_MentalEmotion(MentalEmotion mentalEmotion);
        bool Update_MentalEmotion(int mentalEmotionId, string newEmotion);
    }
}
