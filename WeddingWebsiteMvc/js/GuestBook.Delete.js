var gd = (function ()
{
    var containerElem = "divGuestBookCrudContainer";
    var headerTitleTemplate = Handlebars.compile(document.getElementById("headerTitleTemplate").innerHTML);
    var guestBookWindowTemplate = Handlebars.compile(document.getElementById("guestBookWindowTemplate").innerHTML);

    return {
        deleteEntry: deleteEntry
    };

    function deleteEntry(entry)
    {
        if (!$("#divGuestBookDeleteWindow").data("kendoWindow"))
        {
            cu.createKendoWindow({
                WindowElement: "divGuestBookDeleteWindow",
                WindowTitle: headerTitleTemplate({ IconClass: "fa-trash", HeaderTitle: "Delete GuestBook Entry" }),
                WindowType: "Delete"
            });
        }

        $("#divGuestBookDeleteWindow").data("kendoWindow").content(guestBookWindowTemplate({ Entry: entry.Entry }));

        $("#btnCancelGuestBookDelete").unbind();
        $("#btnCancelGuestBookDelete").click(function ()
        {
            $("#divGuestBookDeleteWindow").data("kendoWindow").close();
        });

        $("#btnSaveGuestBookDelete").unbind();
        $("#btnSaveGuestBookDelete").data("Id", entry.Id);
        $("#btnSaveGuestBookDelete").click(function ()
        {
            cu.showHideSpinner(true, "divGuestBookDeleteWindow")

            var id = parseInt($(this).data("Id"));

            var req = {};

            var guestBookData = gb.getGuestBookData();

            for (var i = 0; i < guestBookData.length; i++) 
            {
                if (parseInt(guestBookData[i].Id) === id) 
                {
                    req = guestBookData[i];
                    break;
                }
            }

            //Delete GuestBook Entry
            $.when(svc.deleteGuestBookEntry(req)).done(function ()
            {
                //update grid
                $.when(svc.getGuestBookEntry()).done(function (response)
                {
                    gb.refreshGuestBookBaseUi(response);

                    $("#divGuestBookDeleteWindow").data("kendoWindow").close();

                    cu.showHideSpinner(false, "divGuestBookDeleteWindow")

                    cu.showDeleteSuccessNotification();
                })
                .fail(function ()
                {
                    cu.showAjaxError({ ElementId: containerElem });
                    cu.showHideSpinner(false, "divGuestBookDeleteWindow");
                });
            })
            .fail(function ()
            {
                cu.showAjaxError({ ElementId: containerElem });
                cu.showHideSpinner(false, "divGuestBookDeleteWindow");
            });
        });

        $("#divGuestBookDeleteWindow").data("kendoWindow").center().open();
    }
})();