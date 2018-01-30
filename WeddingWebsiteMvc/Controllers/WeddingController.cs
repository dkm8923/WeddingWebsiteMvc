using System;
using System.Collections.Generic;
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

        public string PostGuestBookEntry(GuestBookEntry req)
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    req.Approved = false;
                    req.CreatedOn = DateTime.Now.ToUniversalTime();
                    context.GuestBookEntries.AddOrUpdate(req);
                    context.SaveChanges();

                    AdminController ac = new AdminController();
                    ac.SendGuestBookApproveEmail(req);
                    return "true";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string RSVP(RsvpRequest req)
        {
            var ret = false;

            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var guest = context.GuestHeaders.Where(q => q.GuestHeaderId == req.GuestHeaderId).FirstOrDefault();

                    var sendEmailReq = new List<SendEmail>();
                    var emailId = req.Attending == true ? 11 : 12;
                    var email = context.Emails.Where(q => q.Id == emailId).FirstOrDefault();

                    //set up email data
                    foreach (var gd in guest.GuestDetails)
                    {
                        //only add guests with email addresses to list
                        if (gd.Email != null && gd.Email != "")
                        {
                            sendEmailReq.Add(new SendEmail
                            {
                                EmailId = email.Id,
                                GuestDetailId = gd.GuestDetailId,
                                IsTestEmail = false,
                                EmailAddress = gd.Email,
                                EmailSubject = email.Subject,
                                EmailBody = req.EmailBody,
                                RsvpConfimationEmail = true
                            });
                        }
                    }

                    guest.GuestCount = req.GuestCount;
                    guest.Attending = req.Attending;
                    guest.CheckedIn = true;
                    guest.UpdatedOn = DateTime.UtcNow.ToUniversalTime(); ;
                    context.GuestHeaders.AddOrUpdate(guest);
                    context.SaveChanges();
                    ret = true;

                    AdminController ac = new AdminController();
                    
                    foreach (var emailReq in sendEmailReq)
                    {
                        ac.SendEmail(emailReq);
                    }
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

                    this.LogConfirmationAttempt(new ConfirmationCodeLog {ConfirmationCode = req.ConfirmationCode });
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

        private void LogConfirmationAttempt(ConfirmationCodeLog req)
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
    public string EmailBody { get; set; }
}

