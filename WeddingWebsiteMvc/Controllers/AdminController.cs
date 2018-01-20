using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using WeddingWebsiteMvc.Models;
using System.Data.Entity.Migrations;
using System.Net;
using System.Net.Mail;

namespace WeddingWebsiteMvc.Controllers
{
    public class AdminController : Controller
    {
        public const string createdBy = "dmauk";

        // GET: Admin
        public ActionResult Index()
        {
            if (Request.IsAuthenticated)
            {
                return View("GuestMaintenance");
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

        public ActionResult WebsiteMaintenance()
        {
            if (Request.IsAuthenticated)
            {
                return View("WebsiteMaintenance");
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

        public ActionResult EmailMaintenance()
        {
            if (Request.IsAuthenticated)
            {
                return View("EmailMaintenance");
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }

        #region Get

        public string GetWeddingDescriptionData()
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        var descData = context.WeddingDescriptions.Where(q => q.Id == 1).ToList();
                        return JsonConvert.SerializeObject(descData, Formatting.None);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetWeddingInitData()
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var descData = context.WeddingDescriptions.Where(q => q.Id == 1).FirstOrDefault();
                    var emailData = context.Emails.Where(q => q.Id == 11 || q.Id == 12).ToList();
                    var ret = new WeddingInitData { WeddingDescriptionData = descData, EmailData = emailData };
                    //return JsonConvert.SerializeObject(ret, Formatting.None);
                    return JsonConvert.SerializeObject(ret, Formatting.None,
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

        public string GetEmailData()
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        return JsonConvert.SerializeObject(context.Emails.ToList(), Formatting.None);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetGuests()
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        var guestHdr = context.GuestHeaders.Where(q => q.Active == true).ToList();
                        if (guestHdr.Count() > 0)
                        {
                            foreach (var hdr in guestHdr)
                            {
                                var activeGuests = hdr.GuestDetails.Where(q => q.Active == true).ToList();
                                hdr.GuestDetails = activeGuests;
                            }
                        }

                        return JsonConvert.SerializeObject(guestHdr, Formatting.None,
                            new JsonSerializerSettings()
                            {
                                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                            });
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetEmailLog(EmailLog req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        List<EmailLog> emailLogData;
                        List<GuestDetail> guestDetailData;

                        if (req.GuestDetailId == 0)
                        {
                            //entire email log
                            emailLogData = context.EmailLogs.ToList();
                            guestDetailData = context.GuestDetails.Where(q => q.Active == true).ToList();
                        }
                        else
                        {
                            //email log for specific guest
                            emailLogData = context.EmailLogs.Where(q => q.GuestDetailId == req.GuestDetailId).ToList();
                            guestDetailData = context.GuestDetails.Where(q => q.Active == true && q.GuestDetailId == req.GuestDetailId).ToList();
                        }

                        var ret = new List<EmailLogData>();

                        if (emailLogData.Count() > 0)
                        {
                            var emailData = context.Emails.ToList();

                            foreach (var log in emailLogData)
                            {
                                log.SentDate = log.SentDate.ToLocalTime();

                                var email = emailData.Where(q => q.Id == log.EmailId).FirstOrDefault();
                                var guestDetail = guestDetailData.Where(q => q.GuestDetailId == log.GuestDetailId).ToList();

                                ret.Add(new EmailLogData
                                {
                                    GuestName = guestDetail[0].FirstName + " " + guestDetail[0].LastName,
                                    GuestEmailAddress = guestDetail[0].Email,
                                    EmailDescription = email.Description,
                                    EmailSubject = email.Subject,
                                    EmailBody = email.Body,
                                    SentDate = log.SentDate,
                                    GuestDetailId = log.GuestDetailId,
                                    EmailId = log.EmailId,
                                    Id = log.Id
                                });
                            }
                        }

                        return JsonConvert.SerializeObject(ret, Formatting.None);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetUsStates()
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        return JsonConvert.SerializeObject(context.UsaStates.ToList(), Formatting.None);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetAddressDataByZip(ZipCodeSearchReq req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        return JsonConvert.SerializeObject(context.UsaZipCodes.Where(q => q.Zip == req.ZipCode).ToList(), Formatting.None);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region Post

        public string PostWeddingDescriptionData(WeddingDescription req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        req.Id = 1;
                        context.WeddingDescriptions.AddOrUpdate(req);
                        context.SaveChanges();
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string PostEmailData(Email req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        context.Emails.AddOrUpdate(req);
                        context.SaveChanges();
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
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
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        if (req.GuestHeaderId != 0)
                        {
                            //update
                            req.UpdatedBy = createdBy;
                            req.UpdatedOn = DateTime.Now;

                            foreach (var guest in req.GuestDetails)
                            {
                                guest.UpdatedBy = createdBy;
                                guest.UpdatedOn = DateTime.Now;
                                context.GuestDetails.AddOrUpdate(guest);
                            }
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
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string PostEmailLog(EmailLogReq req)
        {
            try
            {
                if (req.RsvpConfimationEmail || Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        var logReq = new EmailLog
                        {
                            EmailId = req.EmailId,
                            GuestDetailId = req.GuestDetailId,
                            SentDate = DateTime.UtcNow.ToUniversalTime(),
                            SentBy = createdBy
                        };

                        context.EmailLogs.AddOrUpdate(logReq);
                        context.SaveChanges();
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AttachGuestToHeader(GuestHeader req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        //delete Guest Header / Detail records
                        req.Active = false;

                        foreach (var guest in req.GuestDetails)
                        {
                            if (guest.GuestHeaderId != 0 && guest.GuestDetailId != 0)
                            {
                                guest.Active = false;
                                this.DeleteGuest(guest);
                            }

                            //get data ready for post
                            guest.GuestHeaderId = 0;
                            guest.GuestDetailId = 0;
                            guest.Active = true;
                        }

                        //clear Guest Header / Detail Id's and set data to active to post
                        req.Active = true;
                        req.GuestHeaderId = 0;

                        this.PostGuest(req);
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return "true";
        }

        #endregion

        #region Delete

        public string DeleteGuest(GuestDetail req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        //check if the guest detail record is the only record related to the header
                        var guestHdr = context.GuestHeaders.Where(q => q.GuestHeaderId == req.GuestHeaderId).ToList();
                        var guestDetails = guestHdr[0].GuestDetails.Where(q => q.Active == true).ToList();

                        if (guestDetails.Count > 0)
                        {
                            //only one guest attached to hdr, set hdr to inactive
                            if (guestDetails.Count == 1)
                            {
                                guestHdr[0].Active = false;
                            }
                            else
                            {
                                int count = 0;
                                foreach (var guest in guestDetails)
                                {
                                    if (guest.Active && guest.GuestDetailId != req.GuestDetailId)
                                    {
                                        count += 1;
                                    }
                                }

                                //guestHdr[0].GuestDetails = guestDetails;

                                if (count == 0)
                                {
                                    guestHdr[0].Active = false;
                                    guestHdr[0].UpdatedBy = createdBy;
                                    guestHdr[0].UpdatedOn = DateTime.Now;
                                    context.GuestHeaders.AddOrUpdate(guestHdr[0]);
                                }
                            }
                        }

                        req.Active = false;
                        req.UpdatedBy = createdBy;
                        req.UpdatedOn = DateTime.Now;

                        context.GuestDetails.AddOrUpdate(req);
                        context.SaveChanges();
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string DeleteEmailData(Email req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    using (WeddingEntities context = new WeddingEntities())
                    {
                        context.Emails.Attach(req);
                        context.Emails.Remove(req);
                        context.SaveChanges();
                        return "true";
                    }
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        public string SendEmail(SendEmail req)
        {
            try
            {
                if ((req.RsvpConfimationEmail || Request.IsAuthenticated) && req.EmailAddress != null && req.EmailAddress != "")
                {
                    SmtpClient smtpClient = new SmtpClient("wedding.danielkevinmauk.com", 25);

                    smtpClient.Credentials = new System.Net.NetworkCredential("donotreply@danielkevinmauk.com", "E8su?s63");
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                    MailMessage mailMessage = new MailMessage("DoNotReply@Wedding.DanielKevinMauk.com", req.EmailAddress);
                    mailMessage.Subject = req.EmailSubject;
                    mailMessage.IsBodyHtml = true;
                    mailMessage.Body = req.EmailBody;

                    smtpClient.Send(mailMessage);

                    if (!req.IsTestEmail)
                    {
                        this.PostEmailLog(new EmailLogReq { EmailId = req.EmailId, GuestDetailId = req.GuestDetailId, RsvpConfimationEmail = req.RsvpConfimationEmail });
                    }

                    return "true";
                }
                else
                {
                    throw new Exception();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string SendBulkEmail(List<SendEmail> req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    foreach (var email in req)
                    {
                        this.SendEmail(email);
                    }

                    return "true";
                }
                else
                {
                    throw new Exception();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

public class SendEmail
{
    public int EmailId { get; set; }
    public int GuestDetailId { get; set; }
    public bool IsTestEmail { get; set; }
    public string EmailAddress { get; set; }
    public string EmailSubject { get; set; }
    public string EmailBody { get; set; }
    public bool RsvpConfimationEmail { get; set; }
}

public class EmailLogData : EmailLog
{
    public string GuestName { get; set; }
    public string GuestEmailAddress { get; set; }
    public string EmailDescription { get; set; }
    public string EmailSubject { get; set; }
    public string EmailBody { get; set; }
}

public class EmailLogReq : EmailLog
{
    public bool RsvpConfimationEmail { get; set; }
}

public class WeddingInitData
{
    public WeddingDescription WeddingDescriptionData { get; set; }
    public List<Email> EmailData { get; set; }
}

public class ZipCodeSearchReq
{
    public int ZipCode { get; set; }
}
