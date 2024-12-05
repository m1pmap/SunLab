using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IUrineAnalise
    {
        bool Add_UrineAnalise(UrineAnalise urineAnalise);
        bool Update_UrineAnalise(int urineAnaliseId, List<float> newUrineAnaliseParameters);
        double[] GetUrineAnalisesParameters(UrineAnalise urineAnalise);
    }
}
