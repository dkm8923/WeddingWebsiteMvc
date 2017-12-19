using System;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using WeddingWebsiteMvc.Models;
using System.Data.Entity.Migrations;

namespace WeddingWebsiteMvc.Controllers
{
    public class WeddingController : Controller
    {
        // GET: Wedding
        public ActionResult Index()
        {
            return View();
        }

        public string RSVP(RsvpRequest req)
        {
            var ret = false;

            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var guest = context.GuestHeaders.FirstOrDefault(q => q.GuestHeaderId == req.GuestHeaderId);
                    guest.GuestCount = req.GuestCount;
                    guest.Attending = req.Attending;
                    guest.CheckedIn = true;
                    guest.GuestDetails = null;
                    guest.UpdatedOn = DateTime.Now;
                    context.GuestHeaders.AddOrUpdate(guest);
                    context.SaveChanges();
                    ret = true;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }

            return JsonConvert.SerializeObject(ret);
        }

        public string ValidateConfirmationCode(ConfirmCode req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var guest = context.GuestHeaders.Where(q => q.ConfirmationCode == req.ConfirmationCode && q.Active == true).FirstOrDefault();
                    this.logConfirmationAttempt(new ConfirmationCodeLog {ConfirmationCode = req.ConfirmationCode });
                    return JsonConvert.SerializeObject(guest, Formatting.None,
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

        private void logConfirmationAttempt(ConfirmationCodeLog req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    req.AttemptDateTime = DateTime.UtcNow.ToUniversalTime();
                    context.ConfirmationCodeLogs.AddOrUpdate(req);
                    context.SaveChanges();
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
    public int GuestHeaderId { get; set; }
    public int GuestCount { get; set; }
    public bool Attending { get; set; }
}
