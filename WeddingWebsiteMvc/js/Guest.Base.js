var gb = (function ()
{
    var containerElem = "divGuestCrudContainer";
    var guestGridActionsTemplate = Handlebars.compile(document.getElementById("guestGridActionsTemplate").innerHTML);
    var guestHeaderData = [];
    var guestData = [];
    var emailData = [];
    var emailLogData = [];

    _init();

    return {
        refreshGuestBaseUi: refreshGuestBaseUi,
        getGuestHeaderData: getGuestHeaderData,
        getGuestData: getGuestData,
        getEmailData: getEmailData,
        getGuestByGuestDetailId: getGuestByGuestDetailId
    };

    function _init() 
    {
        cu.showHideSpinner(true, containerElem)

        //load guest data
        $.when(svc.getGuests()).done(function (response) 
        {
            $.when(svc.getEmailData()).done(function (emailResponse)
            {
                emailData = emailResponse;

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

                $("#btnSendMassEmail").click(function ()
                {
                    ge.sendEmailToAllGuests();
                });

                $("#txtSearchGuestGrid").keyup(function (e) 
                {
                    cu.gridSearchLogic({SearchTextboxId: "txtSearchGuestGrid", GridId: "tblGuestList"});
                });

                setGuestTotalData(guestHeaderData);
                
                _initGrid(guestData);
                gce.init(response); //init guest create edit
                ge.init(emailData); //init guest email

                cu.showHideSpinner(false, containerElem);
                
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

    function getGuestHeaderData()
    {
        return guestHeaderData;
    }

    function getGuestData(refresh)
    {
        return guestData;
    }

    function getEmailData()
    {
        return emailData;
    }

    function refreshGuestBaseUi(req)
    {
        guestHeaderData = formatGuestHeaderData(req);
                            
        guestData = formatGuestData(guestHeaderData);

        setGuestTotalData(guestHeaderData);
        
        cu.bindAndRefreshGrid({GridId: "tblGuestList", Data: guestData});

        $("#txtSearchGuestGrid").val("");
        $("#tblGuestList").data("kendoGrid").dataSource.filter({});
    }

    function _initGrid(data) 
    {
        setGridHeight();
        cu.createKendoGrid({
            GridId: "tblGuestList",
            Data: data,
            DataBound: function () 
            {
                $("[data-editGuestButton]").click(function ()
                {
                    var guestDetailId = parseInt($(this).data("guestdetailid"));
                    gce.editGuest(getGuestByGuestDetailId(guestData, guestDetailId));
                });

                $("[data-deleteGuestButton]").click(function ()
                {
                    var guestDetailId = parseInt($(this).data("guestdetailid"));
                    gd.deleteGuestLogic(getGuestByGuestDetailId(guestData, guestDetailId));
                });

                $("[data-sendRsvpEmailGuestButton]").click(function ()
                {
                    var guestDetailId = parseInt($(this).data("guestdetailid"));
                    ge.sendEmailToGuest(getGuestByGuestDetailId(guestData, guestDetailId));
                });

                var gridData = $("#tblGuestList").data("kendoGrid").dataSource.data();
                for (var i = 0; i < gridData.length; i++)
                {
                    if (gridData[i].UnknownGuest)
                    {
                        //console.log("Unknown Guest");
                        //console.log(gridData[i]);
                        $("#divGuestGridActions" + gridData[i].GuestDetailId).parent().parent().addClass("gridColumnWarning");
                    }
                }
            },
            Columns: [
                {
                    title: "Actions",
                    template: function (data) 
                    {
                        return guestGridActionsTemplate({ GuestDetailId: data.GuestDetailId, EmailDisabled: cu.isNullOrBlank(data.Email) ? true : false});
                    },
                    width: 170
                }
                , {
                    field: "ConfirmationCode",
                    title: "Code",
                    width: 150
                }
                ,{
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
                    template: function (data)
                    {
                        if (cu.isNullOrBlank(data.State))
                        {
                            return "";
                        }

                        return data.State;
                    },
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

            guestHeaderData[i].UnknownGuest = false;

            if ((parseInt(guestHeaderData[i].GuestCount) != guestHeaderData[i].GuestDetails.length) && guestHeaderData[i].CheckedIn && guestHeaderData[i].Attending)
            {
                guestHeaderData[i].UnknownGuest = true;
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
                guest.GuestCount = guestHeaderData[i].GuestCount
                guest.ConfirmationCode = guestHeaderData[i].ConfirmationCode
                guest.UnknownGuest = guestHeaderData[i].UnknownGuest
                guest.GridSearchText = guest.FirstName + " " + guest.LastName + " " + guest.Email;

                guestData.push(guest);
            }
        }

        return guestData;
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
                totalBrideGuestCt += data[i].GuestDetails.length;
            }
            else
            {
                totalGroomGuestCt += data[i].GuestDetails.length;
            }

            if (data[i].CheckedIn == true)
            {
                totalCheckedInCt += data[i].GuestDetails.length;
            }

            if (data[i].Attending == true)
            {
                totalAttendingCt += data[i].GuestCount;
            }
        }

        $("#spnTotalGuests").text(parseInt(totalBrideGuestCt) + parseInt(totalGroomGuestCt));
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
