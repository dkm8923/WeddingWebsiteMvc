var ece = (function ()
{
    var containerElem = "divEmailCrudContainer";

    return {
        init: init,
        addNewEmail: addNewEmail,
        editEmail: editEmail
    };

    function init(data)
    {
        $("#taEmailBody").kendoEditor({
            resizable: {
                        content: true,
                        toolbar: true
            }
        });

        $("#btnCancelEmail").click(function ()
        {
            showHideCreateEditEmailForm(false);
        });

        $("#btnSubmitEmail").click(function ()
        {
            var id = $(this).data("EmailId");
            submitEmail(id);
        });
    }

    function submitEmail(id)
    {
        if (_validate())
        {
            cu.showHideSpinner(true, containerElem)

            var req = {
                Description: $("#txtEmailDescription").val(),
                Subject: $("#txtEmailSubject").val(),
                Body: $("#taEmailBody").data("kendoEditor").value()
            }
            
            if (!cu.isNullOrBlank(id))
            {
                req.Id = parseInt(id);
            }

            $.when(svc.postEmailData(req)).done(function (ret) 
            {
                cu.showSaveSuccessNotification();

                $.when(svc.getEmailData()).done(function (response) 
                {
                    eb.refreshEmailBaseUi(response);
                            
                    showHideCreateEditEmailForm(false)
                                
                    cu.showHideSpinner(false, containerElem)
                })
                .fail(function ()
                {
                    cu.showAjaxError({ElementId: containerElem});
                });
            })
            .fail(function ()
            {
                cu.showAjaxError({ElementId: containerElem});
            });
        }
    }

    function addNewEmail() 
    {
        $("#createEditEmailPanelTitle").text("Create Email");

        _resetForm();
            
        showHideCreateEditEmailForm(true);

        $("#txtEmailDescription").focus();
    }

    function editEmail(email) 
    {
        $("#createEditemailPanelTitle").text("Update email");

        _resetForm();

        $("#txtEmailDescription").val(email.Description);
        $("#txtEmailSubject").val(email.Subject);
        $("#taEmailBody").data("kendoEditor").value(email.Body);

        $("#btnSubmitEmail").data("EmailId", email.Id);
       
        showHideCreateEditEmailForm(true);
    }

    function _validate() 
    {
        var req = {
            RequiredFields: [
                { ElementId: "txtEmailDescription", ErrorType: "Required" },
                { ElementId: "txtEmailSubject", ErrorType: "Required" },
                { ElementId: "taEmailBody", ElementType: "kendoEditor", ErrorType: "Required" }
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

    function _resetForm() 
    {
        fv.clearFormValidation({ErrorMsgContainer: "divEmailErrorMsgContainer"});
        $("#txtEmailDescription").val("");
        $("#txtEmailSubject").val("");
        $("#taEmailBody").data("kendoEditor").value(null);

        $("#btnSubmitEmail").data("EmailId", null);
    }

    function showHideCreateEditEmailForm(show) 
    {
        cu.showFormHideGrid({ Show: show, MainPage: "divEmailGridContainer", Form: "divEmailCreateEditForm"});
    }

})();