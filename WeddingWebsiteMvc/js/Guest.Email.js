var ge = (function ()
{
    var containerElem = "divGuestCrudContainer";

    return {
        init: init,
        sendEmailToGuest: sendEmailToGuest,
        sendEmailToAllGuests: sendEmailToAllGuests
    };

    function init(emailData)
    {
        $("#taEmailBody").kendoEditor({
            tools: []
        });

        $("#ddlEmailTemplate").kendoDropDownList({
            dataTextField: "Description",
            dataValueField: "Id",
            dataSource: emailData,
            filter: "contains",
            optionLabel: {
                Description: "Select An Email Template",
                Id: null
            },
            change: function ()
            {
                var ddlVal = $("#ddlEmailTemplate").data("kendoDropDownList").value();
                if (!cu.isNullOrBlank(ddlVal))
                {
                    $(".hideUnlessEmailSelected").removeClass("hidden");

                    var email = getEmailById(ddlVal);

                    //populate form with email data
                    $("#txtEmailSubject").val(email.Subject);
                    $("#taEmailBody").data("kendoEditor").value(email.Body)
                }
                else
                {
                    $(".hideUnlessEmailSelected").addClass("hidden");
                    resetForm();
                }
            }
        });

        $("#tblSendEmailToAllGuests").kendoGrid({
            dataSource: [],
            //groupable: true,
            sortable: true,
            resizable: true,
            columns: [
                
                {
                    field: "FirstName",
                    title: "First Name",
                    width: 100
                }
                , {

                    field: "LastName",
                    title: "Last name",
                    width: 100
                }
                , {
                    field: "Email",
                    title: "Email",
                    width: 100
                }
            ]
        });

        $("#tblGuestEmailLog").kendoGrid({
            dataSource: [],
            //groupable: true,
            sortable: true,
            resizable: true,
            columns: [
                {
                    field: "EmailDescription",
                    title: "Email Desc",
                    width: 300
                }
                , {
                    field: "SentDate",
                    title: "Sent Date",
                    template: function (data)
                    {
                        return cu.convertDateToMMDDYY(data.SentDate);
                    },
                    width: 100
                }
            ]
        });

        $("#btnCancelEmail").click(function ()
        {
            showHideEmailForm(false);
        });

        $("#btnSubmitEmail").click(function ()
        {
            var guestDetailId = $(this).data("GuestDetailId");
            sendEmail(guestDetailId);
        });

        $(".hideUnlessEmailSelected").addClass("hidden");
    }

    function sendEmailToGuest(guest)
    {
        cu.showHideSpinner(true, containerElem);

        var req = {
            GuestDetailId: guest.GuestDetailId
        };

        $.when(svc.getEmailLog(req)).done(function (logData)
        {
            console.log("logData");
            console.log(logData);
            showHideEmailForm(true); 

            resetForm();

            setSingleEmailForm();

            $("#txtEmailAddress").val(guest.Email);

            $("#btnSubmitEmail").data("GuestDetailId", guest.GuestDetailId);

            //add email log data to grid
            if (logData.length > 0)
            {
                $("#tblGuestEmailLog").data("kendoGrid").dataSource.data(logData);
                $("#divEmailLogGridContainer").removeClass("hidden");
            }
            

            cu.showHideSpinner(false, containerElem);
        });
        
    }

    function sendEmailToAllGuests()
    {
        showHideEmailForm(true); 

        resetForm();

        setBulkEmailForm();

        var guestData = gb.getGuestData();
        var guestsToEmail = [];

        for (var i = 0; i < guestData.length; i++)
        {
            //determine which guests will be emailed and display on screen
            if (guestData[i].Active && !cu.isNullOrBlank(guestData[i].Email))
            {
                guestsToEmail.push(guestData[i]);
            }
        }

        $("#tblSendEmailToAllGuests").data("kendoGrid").dataSource.data(guestsToEmail);
    }

    function sendEmail(guestDetailId)
    {
        if (validate())
        {
            if (!cu.isNullOrBlank(guestDetailId))
            {
                cu.showHideSpinner(true, containerElem);

                var email = getEmailById($("#ddlEmailTemplate").data("kendoDropDownList").value());
                var guest = gb.getGuestByGuestDetailId(gb.getGuestData(), guestDetailId);

                var req = _createEmailObj(guest, email);

                $.when(svc.sendEmail(req)).done(function (ret)
                {
                    showHideEmailForm(false);
                    cu.showHideSpinner(false, containerElem);

                    //show notification that guest was emailed
                    cu.showEmailSuccessNotification();
                })
                .fail(function ()
                {
                    cu.showAjaxError({ElementId: containerElem});
                });
            }
            else
            {
                //send bulk email to all applicable guests
                var email = getEmailById($("#ddlEmailTemplate").data("kendoDropDownList").value());
                var guestsToEmail = $("#tblSendEmailToAllGuests").data("kendoGrid").dataSource.data();
                var req = [];

                for (var i = 0; i < guestsToEmail.length; i++)
                {
                    req.push(_createEmailObj(guestsToEmail[i], email));
                }

                $.when(svc.sendBulkEmail(req)).done(function (ret)
                {
                    showHideEmailForm(false);
                    cu.showHideSpinner(false, containerElem);

                    //show notification that guest was emailed
                    cu.showEmailSuccessNotification();
                })
                .fail(function ()
                {
                    cu.showAjaxError({ElementId: containerElem});
                });
            }

            function _createEmailObj(guest, email)
            {
                var req = {
                    EmailId: $("#ddlEmailTemplate").data("kendoDropDownList").value(),
                    GuestDetailId: guest.GuestDetailId,
                    IsTestEmail: false,
                    EmailAddress: guest.Email,
                    EmailSubject: email.Subject,
                    EmailBody: cu.createEmailBody({EmailBody: email.Body})
                };

                return req;
            }
        }
    }

    function setSingleEmailForm()
    {
        $("#divEmailAddressContainer").removeClass("hidden");
        $("#divEmailAddressGridContainer").addClass("hidden");
    }

    function setBulkEmailForm()
    {
        $("#divEmailAddressContainer").addClass("hidden");
        $("#divEmailAddressGridContainer").removeClass("hidden");
        $("#divEmailLogGridContainer").addClass("hidden");
    }

    function resetForm()
    {
        fv.clearFormValidation({ ErrorMsgContainer: "divEmailErrorMsgContainer" });
        $(".hideUnlessEmailSelected").addClass("hidden");
        $("#ddlEmailTemplate").data("kendoDropDownList").value(null);
        $("#txtEmailSubject").val("");
        $("#taEmailBody").data("kendoEditor").value(null)
        $("#btnSubmitEmail").data("GuestDetailId", null);
    }

    function validate()
    {
        var req = {
            RequiredFields: [
                { ElementId: "ddlEmailTemplate", ElementType: "kendoDropDownList", ErrorType: "Required" }
            ],
            ErrorMsgContainer: "divEmailErrorMsgContainer"
        }

        var errorArr = fv.validateFormBase(req);

        if (errorArr.length > 0) 
        {
            fv.showError({ ErrorArr: errorArr, ErrorMsgContainer: "divEmailErrorMsgContainer" });
            cu.showFormValidationErrorNotification();
        }

        return errorArr.length > 0 ? false : true;
    }

    function showHideEmailForm(show) 
    {
        cu.showFormHideGrid({ Show: show, MainPage: "divGuestGridContainer", Form: "divGuestEmailForm"});
    }

    function getEmailById(id)
    {
        var emailData = gb.getEmailData();
        
        for (var i = 0; i < emailData.length; i++)
        {
            if (emailData[i].Id === parseInt(id))
            {
                return emailData[i];
            }
        }

        return null;
    }

})();