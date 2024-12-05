using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IBloodAnalise
    {
        bool Add_BloodAnalise(BloodAnalise bloodAnalise);
        bool Update_BloodAnalise(int bloodAnaliseId, List<float> newbloodAnaliseParameters);

        double[] GetBloodAnalisesParameters(BloodAnalise bloodAnalise);
    }
}
