var gd = (function ()
{
    var headerTitleTemplate = Handlebars.compile(document.getElementById("headerTitleTemplate").innerHTML);
    var guestWindowTemplate = Handlebars.compile(document.getElementById("guestWindowTemplate").innerHTML);

    return {
        deleteGuestLogic: deleteGuestLogic
    };

    function deleteGuestLogic(guest)
    {
        if (!$("#divGuestDeleteWindow").data("kendoWindow"))
        {
            cu.createKendoWindow({
                WindowElement: "divGuestDeleteWindow",
                WindowTitle: headerTitleTemplate({ IconClass: "fa-trash", HeaderTitle: "Delete Guest"}),
                WindowType: "Delete"
            });
        }

        $("#divGuestDeleteWindow").data("kendoWindow").content(guestWindowTemplate({ GuestName: guest.FirstName + " " + guest.LastName }));

        $("#btnCancelGuestDelete").unbind();
        $("#btnCancelGuestDelete").click(function () {
            $("#divGuestDeleteWindow").data("kendoWindow").close();
        });

        $("#btnSaveGuestDelete").unbind();
        $("#btnSaveGuestDelete").data("GuestDetailId", guest.GuestDetailId);
        $("#btnSaveGuestDelete").click(function ()
        {
            cu.showHideSpinner(true, "divGuestDeleteWindow")

            var guestDetailId = parseInt($(this).data("GuestDetailId"));

            var req = {};

            var gd = gb.getGuestData();

            for (var i = 0; i < gd.length; i++) 
            {
                if (parseInt(gd[i].GuestDetailId) === guestDetailId) 
                {
                    req = gd[i];
                    break;
                }
            }

            //set guest to inactive...
            $.when(svc.deleteGuest(req)).done(function ()
            {
                //update grid
                $.when(svc.getGuests()).done(function (response)
                {
                    gb.refreshGuestBaseUi(response);

                    $("#divGuestDeleteWindow").data("kendoWindow").close();

                    cu.showHideSpinner(false, "divGuestDeleteWindow")

                    cu.showDeleteSuccessNotification();
                })
                .fail(function ()
                {
                    cu.showAjaxError({ElementId: "divGuestCrudContainer"});
                });
            });
        });

        $("#divGuestDeleteWindow").data("kendoWindow").center().open();
    }

})();