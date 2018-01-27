var gb = (function ()
{
    var containerElem = "divGuestBookCrudContainer";
    var guestBookGridActionsTemplate = Handlebars.compile(document.getElementById("guestBookGridActionsTemplate").innerHTML);
    var guestBookData = null;

    init();

    return {
        refreshGuestBookBaseUi: refreshGuestBookBaseUi,
        getGuestBookData: getGuestBookData
    }

    function init()
    {
        cu.showHideSpinner(true, containerElem)

        $("#guestBookTabstrip").kendoTabStrip({ animation: false });

        //load guest data
        $.when(svc.getGuestBookEntry()).done(function (response) 
        {
            $("#txtSearchGuestBookGrid").keyup(function (e) 
            {
                cu.gridSearchLogic({ SearchTextboxId: "txtSearchGuestBookGrid", GridId: "tblGuestBookList" });
            });

            guestBookData = formatGuestBookData(response);
            console.log(guestBookData);
            initGrid(guestBookData);
            setGridHeight();
            cu.showHideSpinner(false, containerElem)
        })
        .fail(function ()
        {
            cu.showAjaxError({ ElementId: containerElem });
        });
    }

    function formatGuestBookData(data)
    {
        for (var i = 0; i < data.length; i++)
        {
            data[i].GridSearchText = data[i].Name + " " + data[i].Entry;
        }

        return data;
    }

    function approveGuestBookEntry(id)
    {
        cu.showHideSpinner(true, containerElem)

        //Delete GuestBook Entry
        $.when(svc.approveGuestBookEntry({Id: id})).done(function ()
        {
            //update grid
            $.when(svc.getGuestBookEntry()).done(function (response)
            {
                gb.refreshGuestBookBaseUi(response);

                var req = {
                    Icon: "fa fa-thumbs-o-up",
                    Msg: "Guest Book Entry Approved!",
                    Type: "success"
                };

                cu.createNotification(req);

                cu.showHideSpinner(false, containerElem);
            })
            .fail(function ()
            {
                cu.showAjaxError({ ElementId: containerElem });
                cu.showHideSpinner(false, containerElem)
            });
        })
        .fail(function ()
        {
            cu.showAjaxError({ ElementId: containerElem });
            cu.showHideSpinner(false, containerElem)
        });
    }

    function getGuestBookData()
    {
        return guestBookData;
    }

    function initGrid(data)
    {
        cu.createKendoGrid({
            GridId: "tblGuestBookList",
            Data: data,
            DataBound: function () 
            {
                $("[data-deleteGuestBookEntryButton]").click(function ()
                {
                    var id = parseInt($(this).data("id"));
                    gd.deleteEntry(getEntryById(guestBookData, id));
                });

                $("[data-approveGuestBookEntryButton]").click(function ()
                {
                    var id = parseInt($(this).data("id"));
                    approveGuestBookEntry(id);
                });
            },
            Columns: [
                {
                    title: "Actions",
                    template: function (data) 
                    {
                        return guestBookGridActionsTemplate({ Id: data.Id });
                    },
                    width: 100
                },
                {
                    field: "Name",
                    title: "Name",
                    width: 150
                }
                , {

                    field: "Entry",
                    title: "Entry",
                    template: function (data)
                    {
                        if (data.Entry.length > 100)
                        {
                            return data.Entry.substring(0, 100) + "...";
                        }

                        return data.Entry;
                    },
                    width: 300
                }
                , {
                    field: "CreatedOn",
                    title: "Created On",
                    width: 100,
                    template: function (data)
                    {
                        return cu.convertDateToMMDDYY(data.CreatedOn);
                    }
                }
                , {
                    field: "Approved",
                    title: "Approved",
                    width: 100
                }
            ]
        });
    }

    function setGridHeight()
    {
        $("#tblGuestBookList").height($(window).height() - 200 + "px");
    }

    function getEntryById(guestBookData, id)
    {
        for (var i = 0; i < guestBookData.length; i++)
        {
            if (guestBookData[i].Id === id)
            {
                return guestBookData[i];
            }
        }

        return null;
    }

    function refreshGuestBookBaseUi(req)
    {
        guestBookData = formatGuestBookData(req);

        cu.bindAndRefreshGrid({ GridId: "tblGuestBookList", Data: guestBookData });

        $("#txtSearchGuestBookGrid").val("");
        $("#tblGuestBookList").data("kendoGrid").dataSource.filter({});
    }

    $(window).resize(function () 
    {
        if ($("#divGuestBookDeleteWindow").data("kendoWindow"))
        {
            $("#divGuestBookDeleteWindow").data("kendoWindow").center();
        }

        setGridHeight();
        $("#tblGuestBookList").data("kendoGrid").resize(true);
    });

})();