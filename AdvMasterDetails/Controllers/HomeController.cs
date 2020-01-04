using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdvMasterDetails.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProductCategories()
        {
            // list of categories
            List<Category> categories = new List<Category>();

            // using entity model to fetch categories from database
            using (MasterDetailsEntities db = new MasterDetailsEntities())
            {
                categories = db.Categories.OrderBy(o => o.CategoryName).ToList();
            }

            // return json
            return new JsonResult { Data = categories, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetProducts(int CategoryId)
        {
            // list of categories
            List<Product> products = new List<Product>();

            // using entity model to fetch categories from database
            using (MasterDetailsEntities db = new MasterDetailsEntities())
            {
                products = db.Products.Where(w => w.CategoryId.Equals(CategoryId)).OrderBy(o => o.ProductName).ToList();
            }

            // return json
            return new JsonResult { Data = products, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public ActionResult Save(OrderMaster order)
        {
            bool status = false;
            DateTime dateOrg;
            var isValidDate = DateTime.TryParseExact(order.OrderDate.ToString(), "mm-dd-yyyy", null, DateTimeStyles.None, out dateOrg);
            if (isValidDate)
            {
                order.OrderDate = dateOrg;
            }

            var isValidModel = TryUpdateModel(order);
            if (isValidModel)
            {
                using (MasterDetailsEntities db = new MasterDetailsEntities())
                {
                    db.OrderMasters.Add(order);
                    db.SaveChanges();
                    status = true;
                }
            }

            return new JsonResult { Data = new { status = status } };
        }
    }
}