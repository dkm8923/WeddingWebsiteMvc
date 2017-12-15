﻿var ece = (function ()
{
    var containerElem = "divEmailCrudContainer";

    return {
        init: init,
        addNewEmail: addNewEmail,
        editEmail: editEmail
    };

    function init(data)
    {
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
                Body: $("#taEmailBody").val()
            }
            
            if (!cu.isNullOrBlank(id))
            {
                req.Id = parseInt(id);
            }

            $.when(svc.postEmailData(req)).done(function (ret) 
            {
                cu.createNotification("Data Saved Successfully!", "success");

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
    }

    function editEmail(email) 
    {
        $("#createEditemailPanelTitle").text("Update email");

        _resetForm();

        $("#txtEmailDescription").val(email.Description);
        $("#txtEmailSubject").val(email.Subject);
        $("#taEmailBody").val(email.Body);
        
        $("#btnSubmitEmail").data("EmailId", email.Id);
       
        showHideCreateEditEmailForm(true);
    }

    function _validate() 
    {
        var req = {
            RequiredFields: [
                { ElementId: "txtEmailDescription", ErrorType: "Required" },
                { ElementId: "txtEmailSubject", ErrorType: "Required" },
                { ElementId: "taEmailBody", ErrorType: "Required" }
            ],
            ErrorMsgContainer: "divEmailErrorMsgContainer"
        }

        var errorArr = fv.validateFormBase(req);

        if (errorArr.length > 0) 
        {
            fv.showError({ErrorArr: errorArr, ErrorMsgContainer: "divEmailErrorMsgContainer"});
        }

        return errorArr.length > 0 ? false : true;
    }

    function _resetForm() 
    {
        fv.clearFormValidation({ErrorMsgContainer: "divEmailErrorMsgContainer"});
        $("#txtEmailDescription").val("");
        $("#txtEmailSubject").val("");
        $("#taEmailBody").val("");

        $("#btnSubmitEmail").data("EmailId", null);
    }

    function showHideCreateEditEmailForm(show) 
    {
        if (show) 
        {
            $("#divEmailGridContainer").addClass("hidden");
            $("#divEmailCreateEditForm").removeClass("hidden");
            $("#txtEmailDescription").focus();
        }
        else 
        {
            $("#divEmailGridContainer").removeClass("hidden");
            $("#divEmailCreateEditForm").addClass("hidden");
        }
    }

})();