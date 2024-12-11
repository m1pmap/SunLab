using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Repository
{
    public class Product_Repository : IProduct
    {
        public List<Product> GetAllProducts()
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.Products.ToList();
            }
        }

        public Product SearchProductByProductName(string productName)
        {
            using (ApplicationContext db = new ApplicationContext())
            {
                return db.Products.FirstOrDefault(p => p.ProductName == productName);
            }
        }
    }
}
