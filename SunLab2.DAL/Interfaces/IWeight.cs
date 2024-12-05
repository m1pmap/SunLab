using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IWeight
    {
        bool Add_Weight(Weight weight);
        bool Update_Weight(int weightID, int newWeight);
    }
}
