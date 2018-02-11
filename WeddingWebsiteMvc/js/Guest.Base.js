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
                
                //console.log("load guest header data");
                //console.log(guestHeaderData);

                //console.log("formatted data");
                //console.log(guestData);

                $("#btnAddNewGuest").click(function ()
                {
                    gce.addNewGuest();
                });

                $("#btnExportToExcel").click(function ()
                {
                    //loop through data and only provide the needed columns
                    var excelData = [];
                    for (var i = 0; i < guestData.length; i++)
                    {
                        var g = guestData[i];
                        excelData.push({
                            FirstName: g.FirstName,
                            LastName: g.LastName,
                            Email: g.Email,
                            Address1: g.Address1,
                            Address2: g.Address2,
                            City: g.City,
                            State: g.State,
                            Zip: g.Zip,
                            CheckedIn: g.CheckedIn,
                            Attending: g.Attending,
                            Family: g.FamilyDescription,
                            GuestCount: g.GuestCount
                        });
                    }

                    cu.downloadCSV({ data: excelData, filename: "GuestList" });
                });

                $("#btnSendMassEmail").click(function ()
                {
                    ge.sendEmailToAllGuests();
                });

                $("#txtSearchGuestGrid").keyup(function (e) 
                {
                    cu.gridSearchLogic({ SearchTextboxId: "txtSearchGuestGrid", GridId: "tblGuestListHdr"});
                });

                setGuestTotalData(guestHeaderData);

                _initParentGrid(guestHeaderData);
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
        
        cu.bindAndRefreshGrid({ GridId: "tblGuestListHdr", Data: guestHeaderData});

        $("#txtSearchGuestGrid").val("");
        $("#tblGuestListHdr").data("kendoGrid").dataSource.filter({});
    }

    function _initParentGrid(data)
    {
        setGridHeight();
        cu.createKendoGrid({
            GridId: "tblGuestListHdr",
            Data: data,
            DetailInit: function (e)
            {
                //console.log("Detail Init");
                var guestHdrId = e.data.GuestHeaderId;
                var container = "nestedGridContainer" + guestHdrId;
                var gridId = "gridGuestDetails" + guestHdrId;

                $("<div id='" + container + "'>").appendTo(e.detailCell);
                $("#" + container).append("<div id='gridGuestDetails" + guestHdrId + "' class='defaultGrid singleGrid'></div>");

                cu.createKendoGrid({
                    GridId: gridId,
                    Data: e.data.GuestDetails,
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

                        var gridData = $("#" + gridId).data("kendoGrid").dataSource.data();
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
                            //columnMenu: false,
                            template: function (data) 
                            {
                                return guestGridActionsTemplate({ GuestDetailId: data.GuestDetailId, EmailDisabled: cu.isNullOrBlank(data.Email) ? true : false });
                            },
                            width: 60
                        }
                        , {
                            field: "FirstName",
                            title: "First Name",
                            width: 60
                        }
                        , {

                            field: "LastName",
                            title: "Last name",
                            width: 60
                        }
                        , {
                            field: "Email",
                            title: "Email",
                            width: 60
                        }
                    ]
                });

            },
            Columns: [
                {
                    field: "ConfirmationCode",
                    title: "Code",
                    width: 150
                }
                , {
                    field: "FamilyDescription",
                    title: "Family",
                    width: 100
                }
                , {
                    field: "GuestCount",
                    title: "Guest Ct",
                    width: 100
                }
                , {
                    field: "NameString",
                    title: "Members",
                    width: 200
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
            guestHeaderData[i].FamilyDescription = guestHeaderData[i].Family === 1 ? "Bride" : "Groom";

            //create grid search string
            Object.keys(guestHeaderData[i]).forEach(function (key, index)
            {
                // key: the name of the object key
                // index: the ordinal position of the key within the object 
                guestHeaderData[i].GridSearchText += guestHeaderData[i][key] + " "; 
            });
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
                guest.FamilyDescription = guestHeaderData[i].Family === 1 ? "Bride" : "Groom";
                guest.GuestCount = guestHeaderData[i].GuestCount
                guest.ConfirmationCode = guestHeaderData[i].ConfirmationCode
                guest.UnknownGuest = guestHeaderData[i].UnknownGuest
                
                Object.keys(guest).forEach(function (key, index)
                {
                    // key: the name of the object key
                    // index: the ordinal position of the key within the object 
                    guestHeaderData[i].GridSearchText += guest[key] + " ";
                });

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
            $("#tblGuestListHdr").height($(window).height() - 300 + "px");
        }
        else
        {
            $("#tblGuestListHdr").height($(window).height() - 200 + "px");
        }
    }

    $(window).resize(function () 
    {
        if ($("#divGuestDeleteWindow").data("kendoWindow"))
        {
            $("#divGuestDeleteWindow").data("kendoWindow").center();
        }

        setGridHeight();
        $("#tblGuestListHdr").data("kendoGrid").resize(true);
    });
})();
