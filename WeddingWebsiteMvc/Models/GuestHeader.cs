//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WeddingWebsiteMvc.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class GuestHeader
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GuestHeader()
        {
            this.GuestDetails = new HashSet<GuestDetail>();
        }
    
        public int GuestHeaderId { get; set; }
        public string ConfirmationCode { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public Nullable<bool> Attending { get; set; }
        public string CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public System.DateTime UpdatedOn { get; set; }
        public Nullable<bool> CheckedIn { get; set; }
        public bool Active { get; set; }
        public int GuestCount { get; set; }
        public byte Family { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<GuestDetail> GuestDetails { get; set; }
    }
}
