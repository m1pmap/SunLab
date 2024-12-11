using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IUser
    {
        bool Add_User(User user);
        bool UserExists(User user);
        User ConnectUserInformation(User user);
        User GetUserByUsername(string username);
        Disease GetCurrentVirusDisease(User user);
        Disease GetDiseaseByName(User user, string diseaseName, string diseaseType);
        bool UpdateUserSleepTime(int userId, string newSleepTime);
        bool UpdateUserSupportingWeight(int userId, float newSupportingWeight);
    }
}
