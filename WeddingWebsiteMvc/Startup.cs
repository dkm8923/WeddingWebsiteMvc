using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WeddingWebsiteMvc.Startup))]
namespace WeddingWebsiteMvc
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
