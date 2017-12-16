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

        public string GetWeddingDescriptionData()
        {
            try
            {
                using (WeddingEntities context = new WeddingEntities())
                {
                    var descData = context.WeddingDescriptions.Where(q => q.Id == 1).ToList();
                    return JsonConvert.SerializeObject(descData, Formatting.None);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

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
                            var activeGuests = guestHdr[0].GuestDetails.Where(q => q.Active == true).ToList();
                            guestHdr[0].GuestDetails = activeGuests;
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

        public string SendEmail(SendEmail req)
        {
            try
            {
                if (Request.IsAuthenticated)
                {
                    SmtpClient smtpClient = new SmtpClient("wedding.danielkevinmauk.com", 25);

                    smtpClient.Credentials = new System.Net.NetworkCredential("donotreply@danielkevinmauk.com", "bYn5y0@1");
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                    MailMessage mailMessage = new MailMessage("DoNotReply@Wedding.DanielKevinMauk.com", req.EmailAddress);
                    mailMessage.Subject = req.EmailSubject;
                    mailMessage.IsBodyHtml = true;
                    mailMessage.Body = req.EmailBody;

                    smtpClient.Send(mailMessage);
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
                foreach (var email in req)
                {
                    this.SendEmail(email);
                }

                return "true";
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
    public string EmailAddress { get; set; }
    public string EmailSubject { get; set; }
    public string EmailBody { get; set; }
}
