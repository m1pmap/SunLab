using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL
{
    public static class ConnectionString_Global
    {
        public static string Value { get; set; } = "|DataDirectory|SunLabDB.mdf";
    }
}
