﻿var et = (function ()
{
    var containerElem = "divEmailCrudContainer";

    return {
        init: init,
        sendTestEmail: sendTestEmail
    };

    function init(emailData)
    {
        $("#taSendTestEmailBody").kendoEditor({
            tools: []
        });

        cu.disableKendoEditor({ ElementId: "taSendTestEmailBody" });

        $("#ddlSendTestEmailEmailAddress").kendoDropDownList({
            dataTextField: "Description",
            dataValueField: "Id",
            dataSource: [
                {
                    Id: "dkm8923@gmail.com",
                    Description: "Dan Mauk"
                }
                ,{
                    Id: "thompsonswartz@gmail.com",
                    Description: "Rachel Thompson"
                }
            ],
            filter: "contains",
            optionLabel: {
                Description: "Select An Email Address",
                Id: null
            }
        });

        $("#btnCancelTestEmail").click(function ()
        {
            showHideEmailForm(false);
        });

        $("#btnSubmitTestEmail").click(function ()
        {
            sendEmail();
        });
    }

    function sendTestEmail(email)
    {
        showHideEmailForm(true); 

        resetForm();

        $("#txtSendTestEmailDesription").val(email.Description);
        $("#txtSendTestEmailSubject").val(email.Subject);
        $("#taSendTestEmailBody").data("kendoEditor").value(email.Body)
    }

    function sendEmail()
    {
        if (validate())
        {
            cu.showHideSpinner(true, containerElem);

            var req = {
                EmailId: 0,
                IsTestEmail: true,
                EmailAddress: $("#ddlSendTestEmailEmailAddress").data("kendoDropDownList").value(),
                EmailSubject: $("#txtSendTestEmailSubject").val()
            };

            if ($("#txtSendTestEmailDesription").val() == "Invitation Email" || $("#txtSendTestEmailDesription").val() == "Re-Send Confirmation Code To Guest")
            {
                req.EmailBody = cu.createEmailBodyWithConfirmCode({ EmailBody: $("#taSendTestEmailBody").data("kendoEditor").value(), ConfirmationCode: "TestCode1234" });
            }
            else
            {
                req.EmailBody = cu.createEmailBody({ EmailBody: $("#taSendTestEmailBody").data("kendoEditor").value() });
            }

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
    }

    function resetForm()
    {
        fv.clearFormValidation({ ErrorMsgContainer: "divSendTestEmailErrorMsgContainer" });
        $("#ddlSendTestEmailEmailAddress").data("kendoDropDownList").value(null);
        $("#txtSendTestEmailDesription").val("");
        $("#txtSendTestEmailSubject").val("");
        $("#taSendTestEmailBody").data("kendoEditor").value(null)
    }

    function validate()
    {
        var req = {
            RequiredFields: [
                { ElementId: "ddlSendTestEmailEmailAddress", ElementType: "kendoDropDownList", ErrorType: "Required" }
            ],
            ErrorMsgContainer: "divSendTestEmailErrorMsgContainer"
        }

        var errorArr = fv.validateFormBase(req);

        if (errorArr.length > 0) 
        {
            fv.showError({ ErrorArr: errorArr, ErrorMsgContainer: "divSendTestEmailErrorMsgContainer" });
            cu.showFormValidationErrorNotification();
        }

        return errorArr.length > 0 ? false : true;
    }

    function showHideEmailForm(show) 
    {
        cu.showFormHideGrid({ Show: show, MainPage: "divEmailGridContainer", Form: "divSendTestEmailForm" });

        if (show)
        {
            $("#emailTabstrip").addClass("hidden");
        }
        else
        {
            $("#emailTabstrip").removeClass("hidden");
        }
    }

})();