using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using WeddingWebsiteMvc.Models;

namespace WeddingWebsiteMvc.Controllers
{
    public class WeddingController : Controller
    {
        // GET: Wedding
        public ActionResult Index()
        {
            return View();
        }

        public bool RSVP(RsvpRequest req)
        {
            try
            {

            }
            catch(Exception ex)
            {
                throw ex;
            }

            return true;
        }

        public string ValidateConfirmationCode(ConfirmCode req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var guest = context.GuestHeaders.Where(q => q.ConfirmationCode == req.ConfirmationCode).ToList();

                    //if (guest.Count > 0)
                    //{

                    //}
                    return JsonConvert.SerializeObject(guest);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

public class ConfirmCode
{
    public string ConfirmationCode { get; set; }
}

public class RsvpRequest
{
    public int GuestId { get; set; }
    public int GuestCount { get; set; }
    public bool Attending { get; set; }
}

//Guest Table

//GuestId
//ConfirmCode
//FirstName
//LastName
//Email
//Address1
//Address2
//City
//State
//Zip
//Attending
//GuestCount
//CreatedOn
//CreatedBy
//UpdatedOn
//UpdatedBy