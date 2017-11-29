using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using WeddingWebsiteMvc.Models;
using System.Data.Entity.Migrations;

namespace WeddingWebsiteMvc.Controllers
{
    public class AdminController : Controller
    {
        public const string createdBy = "dmauk";

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        public string GetGuests()
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var guests = context.GuestHeaders.ToList();
                    return JsonConvert.SerializeObject(guests, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string PostGuest(GuestHeader req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    if (req.GuestHeaderId != null && req.GuestHeaderId != 0)
                    {
                        GuestHeader obj = context.GuestHeaders.FirstOrDefault(q => q.GuestHeaderId == req.GuestHeaderId);

                        //update
                        req.UpdatedBy = createdBy;
                        req.UpdatedOn = DateTime.Now;
                    }
                    else
                    {
                        //insert
                        req.CreatedBy = createdBy;
                        req.UpdatedBy = createdBy;
                        req.CreatedOn = DateTime.Now;
                        req.UpdatedOn = DateTime.Now;

                        foreach (var guest in req.GuestDetails)
                        {
                            guest.CreatedBy = createdBy;
                            guest.UpdatedBy = createdBy;
                            guest.CreatedOn = DateTime.Now;
                            guest.UpdatedOn = DateTime.Now;
                        }
                    }

                    context.GuestHeaders.AddOrUpdate(req);
                    context.SaveChanges();
                    return true.ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return "";
        }

        public string DeleteGuest(GuestDetail req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    req.UpdatedBy = createdBy;
                    req.UpdatedOn = DateTime.Now;

                    context.GuestDetails.AddOrUpdate(req);
                    context.SaveChanges();
                    return true.ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return "";
        }
    }
}