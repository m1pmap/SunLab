﻿using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IHeight
    {
        bool Add_Height(Height height);
        bool Update_Height(int heightID, int newHeight);
    }
}
