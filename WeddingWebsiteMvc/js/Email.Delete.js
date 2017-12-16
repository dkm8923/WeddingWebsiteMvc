var ed = (function ()
{
    var containerElem = "divEmailCrudContainer";
    var headerTitleTemplate = Handlebars.compile(document.getElementById("headerTitleTemplate").innerHTML);
    var emailWindowTemplate = Handlebars.compile(document.getElementById("emailWindowTemplate").innerHTML);

    return {
        deleteEmail: deleteEmail
    };

    function deleteEmail(email)
    {
        if (!$("#divEmailDeleteWindow").data("kendoWindow"))
        {
            cu.createKendoWindow({
                WindowElement: "divEmailDeleteWindow",
                WindowTitle: headerTitleTemplate({ IconClass: "fa-trash", HeaderTitle: "Delete Email"}),
                WindowType: "Delete"
            });
        }

        $("#divEmailDeleteWindow").data("kendoWindow").content(emailWindowTemplate({ EmailDescription: email.Description }));

        $("#btnCancelEmailDelete").unbind();
        $("#btnCancelEmailDelete").click(function () {
            $("#divEmailDeleteWindow").data("kendoWindow").close();
        });

        $("#btnSaveEmailDelete").unbind();
        $("#btnSaveEmailDelete").data("Id", email.Id);
        $("#btnSaveEmailDelete").click(function ()
        {
            cu.showHideSpinner(true, "divEmailDeleteWindow")

            var id = parseInt($(this).data("Id"));

            var req = {};

            var emailData = eb.getEmailData();

            for (var i = 0; i < emailData.length; i++) 
            {
                if (parseInt(emailData[i].Id) === id) 
                {
                    req = emailData[i];
                    break;
                }
            }

            //Delete Email
            $.when(svc.deleteEmailData(req)).done(function ()
            {
                //update grid
                $.when(svc.getEmailData()).done(function (response)
                {
                    eb.refreshEmailBaseUi(response);

                    $("#divEmailDeleteWindow").data("kendoWindow").close();

                    cu.showHideSpinner(false, "divEmailDeleteWindow")

                    cu.showDeleteSuccessNotification();
                })
                .fail(function ()
                {
                    cu.showAjaxError({ ElementId: containerElem });
                    cu.showHideSpinner(false, "divEmailDeleteWindow");
                });
            })
            .fail(function ()
            {
                cu.showAjaxError({ ElementId: containerElem });
                cu.showHideSpinner(false, "divEmailDeleteWindow");
            });
        });

        $("#divEmailDeleteWindow").data("kendoWindow").center().open();
    }
})();