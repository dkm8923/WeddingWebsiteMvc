//globals....GROSS...I KNOW
var g = {};

var gb = (function ()
{
    console.log("admin.js loaded...");
    var guestHeaderData = [];
    var guestData = [];

    _init();

    return {
        refreshGuestBaseUi: refreshGuestBaseUi,
        getGuestHeaderData: getGuestHeaderData,
        getGuestData: getGuestData
    };

    function _init() 
    {
        cu.showHideSpinner(true, "divGuestCrudContainer")

        //load guest data
        $.when(svc.getGuests()).done(function (response) 
        {
            guestHeaderData = formatGuestHeaderData(response);
            guestData = formatGuestData(response);

            console.log("load guest header data");
            console.log(guestHeaderData);

            console.log("formatted data");
            console.log(guestData);

            $("#btnAddNewGuest").click(function ()
            {
                gce.addNewGuest();
            });

            $("#txtSearchGuestGrid").keyup(function (e) 
            {
                cu.gridSearchLogic({SearchTextboxId: "txtSearchGuestGrid", GridId: "tblGuestList"});
            });

            setGuestTotalData(guestData);
            _initGrid(guestData);
            gce.init(response);
            ge.init();

            cu.showHideSpinner(false, "divGuestCrudContainer")
        });
    }

    function getGuestHeaderData()
    {
        return guestHeaderData;
    }

    function getGuestData(refresh)
    {
        return guestData;
    }

    function refreshGuestBaseUi(req)
    {
        guestHeaderData = formatGuestHeaderData(req);
                            
        guestData = formatGuestData(guestHeaderData);

        setGuestTotalData(guestData);

        bindAndRefreshGrid(guestData);

        $("#txtSearchGuestGrid").val("");
        $("#tblGuestList").data("kendoGrid").dataSource.filter({});
    }

    function _initGrid(data) 
    {
        setGridHeight();
        $("#tblGuestList").kendoGrid({
            dataSource: data,
            //groupable: true,
            sortable: true,
            resizable: true,
            dataBound: function () 
            {
                var gridData = $("#tblGuestList").data("kendoGrid").dataSource.data();
                for (var i = 0; i < gridData.length; i++) 
                {
                        
                    $("#btnEditGuest" + gridData[i].GuestDetailId).click(function () 
                    {
                        var guestDetailId = parseInt($(this).data("guestdetailid"));
                        gce.editGuest(getGuestByGuestDetailId(guestData, guestDetailId));
                    });

                    $("#btnDeleteGuest" + gridData[i].GuestDetailId).click(function () 
                    {
                        var guestDetailId = parseInt($(this).data("guestdetailid"));
                        gd.deleteGuestLogic(getGuestByGuestDetailId(guestData, guestDetailId));
                    });

                    $("#btnSendRsvpEmailToGuest" + gridData[i].GuestDetailId).click(function () 
                    {
                        var guestDetailId = parseInt($(this).data("guestdetailid"));
                        ge.sendEmailToGuest(getGuestByGuestDetailId(guestData, guestDetailId));
                    });

                    if (cu.isNullOrBlank(guestData[i].Email))
                    {
                        $("#btnSendRsvpEmailToGuest" + gridData[i].GuestDetailId).prop("disabled", true);
                    }

                }
            },
            columns: [
                {
                    title: "Actions",
                    template: function (data) {
                        return "<div class='gridBtnContainer'><button id='btnEditGuest" + data.GuestDetailId + "' data-guestdetailid='" + data.GuestDetailId + "' class='btn btn-warning'><i class='fa fa-pencil' aria-hidden='true'></i></button><button id='btnDeleteGuest" + data.GuestDetailId + "' data-guestdetailid='" + data.GuestDetailId + "' class='btn btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button><button id='btnSendRsvpEmailToGuest" + data.GuestDetailId + "' data-guestdetailid='" + data.GuestDetailId + "' class='btn btn-info'><i class='fa fa-envelope-o' aria-hidden='true'></i></button><div>";
                    },
                    width: 170
                },
                {
                    field: "FirstName",
                    title: "FIrst Name",
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
                , {
                    field: "Attending",
                    title: "Attending",
                    width: 80
                }
                , {
                    field: "CheckedIn",
                    title: "Checked In",
                    width: 90
                }
                , {
                    field: "Address1",
                    title: "Address 1",
                    width: 160
                }
                , {
                    field: "Address2",
                    title: "Address 2",
                    width: 120
                }
                , {
                    field: "City",
                    title: "City",
                    width: 140
                }
                , {
                    field: "State",
                    title: "State",
                    width: 80
                }
                , {
                    field: "Zip",
                    title: "Zip",
                    width: 80
                }
            ]
        });
    }

    function formatGuestHeaderData(guestHeaderData)
    {
        for (var i = 0; i < guestHeaderData.length; i++)
        {
            var nameString = "";

            for (var x = 0; x < guestHeaderData[i].GuestDetails.length; x++)
            {
                var guest = guestHeaderData[i].GuestDetails[x];
                nameString += guest.FirstName + " " + guest.LastName + " ";
            }

            guestHeaderData[i].NameString = nameString;
        }

        return guestHeaderData;
    }

    function formatGuestData(guestHeaderData)
    {
        var guestData = [];

        for (var i = 0; i < guestHeaderData.length; i++)
        {
            for (var x = 0; x < guestHeaderData[i].GuestDetails.length; x++)
            {
                var guest = guestHeaderData[i].GuestDetails[x];

                guest.Address1 = guestHeaderData[i].Address1;
                guest.Address2 = guestHeaderData[i].Address2;
                guest.City = guestHeaderData[i].City;
                guest.State = guestHeaderData[i].State;
                guest.Zip = guestHeaderData[i].Zip;
                guest.CheckedIn = guestHeaderData[i].CheckedIn;
                guest.Attending = guestHeaderData[i].Attending;
                guest.Family = guestHeaderData[i].Family;
                guest.ConfirmationCode = guestHeaderData[i].ConfirmationCode
                guest.GridSearchText = guest.FirstName + " " + guest.LastName + " " + guest.Email;

                guestData.push(guest);
            }
        }

        return guestData;
    }

    function bindAndRefreshGrid(data)
    {
        $("#tblGuestList").data("kendoGrid").dataSource.data(data);
        $("#tblGuestList").data("kendoGrid").refresh();
    }

    function setGuestTotalData(data)
    {
        var totalBrideGuestCt = 0;
        var totalGroomGuestCt = 0;
        var totalCheckedInCt = 0;
        var totalAttendingCt = 0;

        for (var i = 0; i < data.length; i++)
        {
            if (data[i].Family === 1)
            {
                totalBrideGuestCt += 1;
            }
            else
            {
                totalGroomGuestCt += 1;
            }

            if (data[i].CheckedIn == true)
            {
                totalCheckedInCt += 1;
            }

            if (data[i].Attending == true)
            {
                totalAttendingCt += 1;
            }
        }

        $("#spnTotalGuests").text(data.length);
        $("#spnTotalBrideGuests").text(totalBrideGuestCt);
        $("#spnTotalGroomGuests").text(totalGroomGuestCt);
        $("#spnTotalCheckedIn").text(totalCheckedInCt);
        $("#spnTotalAttending").text(totalAttendingCt);
    }

    function getGuestByGuestDetailId(guestData, guestDetailId)
    {
        for (var i = 0; i < guestData.length; i++) 
        {
            if (parseInt(guestData[i].GuestDetailId) === guestDetailId) 
            {
                return guestData[i];
                break;
            } 
        }
    }

    function setGridHeight()
    {
        if ($(window).width() <= 720)
        {
            $("#tblGuestList").height($(window).height() - 300 + "px");
        }
        else
        {
            $("#tblGuestList").height($(window).height() - 200 + "px");
        }
    }

    $(window).resize(function () 
    {
        if ($("#divGuestDeleteWindow").data("kendoWindow"))
        {
            $("#divGuestDeleteWindow").data("kendoWindow").center();
        }

        setGridHeight();
        $("#tblGuestList").data("kendoGrid").resize(true);
    });
})();
