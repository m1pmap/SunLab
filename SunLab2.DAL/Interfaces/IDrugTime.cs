using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IDrugTime
    {
        bool Add_DrugTime(DrugTime drugTime);
        bool Remove_DrugTime(DrugTime drugTime);

        bool Update_DrugTime(int drugId, string oldTime, string newTime);
    }
}
