﻿using SunLab2.DAL.Model;
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

        int GetUserIdByUsernameAsync(string username);
    }
}