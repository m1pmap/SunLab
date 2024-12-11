using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Interfaces
{
    public interface IProduct
    {
        public List<Product> GetAllProducts();
        public Product SearchProductByProductName(string productName);
    }
}
