var ge = (function ()
{
    return {
        init: init,
        sendEmailToGuest: sendEmailToGuest
    };

    function init()
    {
        $("#ddlEmailTemplate").kendoDropDownList({
            dataTextField: "Description",
            dataValueField: "Id",
            dataSource: [],
            filter: "contains",
            optionLabel: {
                Description: "Select An Email Template",
                Id: null
            }//,
            //change: function ()
            //{
            //    //var ddlVal = $("#ddlAttachToGuest").data("kendoDropDownList").value();
            //    //if (!cu.isNullOrBlank(ddlVal))
            //    //{
            //    //    $(".attachToGuestHide").addClass("hidden");
            //    //}
            //    //else
            //    //{
            //    //    $(".attachToGuestHide").removeClass("hidden");
            //    //}
            //}
        });

        $("#btnCancelEmail").click(function ()
        {
            showHideEmailForm(false);
        });

        $("#btnSubmitEmail").click(function ()
        {
            showHideEmailForm(false);
        });
    }

    function sendEmailToGuest(guest)
    {
        showHideEmailForm(true); 

        //var req = {
        //    EmailAddress: "dkm8923@gmail.com",
        //    EmailSubject: "this is the subject of the email",
        //    EmailBody: "this is the body of the email"
        //};

        //$.when(_sendEmail(req)).done(function (ret)
        //{
        //    //show notification that guest was emailed
        //    cu.createNotification("<i class='fa fa-envelope-o' aria-hidden='true'></i>Guest Was Emailed successfully! YAYYYY!", "success");
        //});
    }

    function showHideEmailForm(show) 
    {
        if (show) 
        {
            $("#divGuestEmailForm").removeClass("hidden");
            $("#divGuestGridContainer").addClass("hidden");
        }
        else 
        {
            $("#divGuestEmailForm").addClass("hidden");
            $("#divGuestGridContainer").removeClass("hidden");
        }
    }

})();