var et = (function ()
{
    var containerElem = "divEmailCrudContainer";

    return {
        init: init,
        sendTestEmail: sendTestEmail
    };

    function init(emailData)
    {
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
        $("#taSendTestEmailBody").val(email.Body);
    }

    function sendEmail()
    {
        if (validate())
        {
            cu.showHideSpinner(true, containerElem);

            var req = {
                EmailAddress: $("#ddlSendTestEmailEmailAddress").data("kendoDropDownList").value(),
                EmailSubject: $("#txtSendTestEmailSubject").val(),
                EmailBody: $("#taSendTestEmailBody").val()
            };

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
        $("#taSendTestEmailBody").val("");
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
        cu.showFormHideGrid({ Show: show, MainPage: "divEmailGridContainer", Form: "divSendTestEmailForm"});
    }

})();