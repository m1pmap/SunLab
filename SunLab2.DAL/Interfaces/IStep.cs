using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IStep
    {
        bool Add_Step(Step step);
        bool Update_Step(int stepID, int newSteps);
    }
}
