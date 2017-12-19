using System.Web;
using System.Web.Optimization;

namespace WeddingWebsiteMvc
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/cssdefault").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/css/site.css",
                      "~/Content/css/Common.css",
                      "~/Content/font-awesome.min.css"
                      ));

            bundles.Add(new StyleBundle("~/WeddingCss/css").Include(
                      "~/Content/animate.css",
                      "~/Content/icomoon.css",
                      "~/Content/bootstrap.css",
                      "~/Content/superfish.css",
                      "~/Content/magnific-popup.css",
                      "~/Content/css/style.css",
                      "~/Content/css/Common.css",
                      "~/Content/font-awesome.min.css"));

            bundles.Add(new ScriptBundle("~/WeddingScripts/scripts").Include(
                      "~/Scripts/modernizr-2.6.2.min.js",
                      "~/Scripts/wedding.template.js",
                      "~/Scripts/bootstrap-notify.min.js",
                      "~/js/Common.Utility.js",
                      "~/js/Common.Service.js",
                      "~/js/Wedding.Base.js"));

            bundles.Add(new StyleBundle("~/Content/KendoCss").Include(
                      "~/Content/kendo.common.min.css",
                      "~/Content/kendo.rtl.min.css",
                      "~/Content/kendo.default.min.css",
                      "~/Content/kendo.dataviz.min.css",
                      "~/Content/kendo.dataviz.default.min.css",
                      "~/Content/animate.css"));

            bundles.Add(new ScriptBundle("~/KendoScripts/scripts").Include(
                      "~/Scripts/kendo.all.min.js",
                      "~/Scripts/kendo.dataviz.chart.min.js",
                      "~/Scripts/console.js",
                      "~/Scripts/jquery-migrate-3.0.0.min.js",
                      "~/Scripts/handlebars-v4.0.11.js",
                      "~/Scripts/bootstrap-notify.min.js"));

            bundles.Add(new ScriptBundle("~/AppLogic/scripts").Include(
                      "~/js/Common.Constants.js",
                      "~/js/Common.Service.js",
                      "~/js/Common.Utility.js"));

            bundles.Add(new ScriptBundle("~/Guest/scripts").Include(
                      "~/js/Guest.Base.js",
                      "~/js/Guest.CreateEdit.js",
                      "~/js/Guest.Delete.js",
                      "~/js/Guest.Email.js"));

            bundles.Add(new ScriptBundle("~/Email/scripts").Include(
                      "~/js/Email.Base.js",
                      "~/js/Email.CreateEdit.js",
                      "~/js/Email.Delete.js",
                      "~/js/Email.SendTestEmail.js"));
        }
    }
}
