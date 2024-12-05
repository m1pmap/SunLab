using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface ISymptomSeverity
    {
        bool Add_SymptomSeverity(SymptomSeverity symptomSeverity);
        bool Update_SymptomSeverity(int symptomSeverityId, string newSeverity);
    }
}
