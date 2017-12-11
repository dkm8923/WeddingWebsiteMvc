$(document).ready(function () 
{
    console.log("ready!");
    (function ($) 
    {
        console.log("admin.js loaded...");
        var guestHeaderData = [];
        var guestData = [];
        var guestWindowTemplate = Handlebars.compile(document.getElementById("guestWindowTemplate").innerHTML);

        _init();

        function _init() 
        {
            showHideSpinner(true, "divGuestCrudContainer")

            //load guest data
            $.when(_getGuests()).done(function (response) 
            {
                guestHeaderData = response;
                _formatGridData(response);

                console.log("load guest header data");
                console.log(guestHeaderData);

                console.log("formatted data");
                console.log(guestData);

                $("#btnAddNewGuest").click(function ()
                {
                    _addNewGuest();
                });

                $("#txtSearchGuestGrid").keyup(function (e) 
                {
                    gridSearchLogic();
                });

                setGuestTotalData(guestData);
                _initGrid(guestData);
                _initGuestCreateEditForm(response);

                showHideSpinner(false, "divGuestCrudContainer")
            });
        }

        function gridSearchLogic()
        {
            var text = $("#txtSearchGuestGrid").val();

            if (text) 
            {
                var orFilter = { logic: "or", filters: [] };
                orFilter.filters.push({ field: "GridSearchText", operator: "contains", value: text });

                $("#tblGuestList").data("kendoGrid").dataSource.filter(orFilter);
            }
            else 
            {
                $("#tblGuestList").data("kendoGrid").dataSource.filter({});
            }
        }

        function _initGrid(data) 
        {
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
                            for (var i = 0; i < guestData.length; i++) 
                            {
                                if (parseInt(guestData[i].GuestDetailId) === guestDetailId) 
                                {
                                    _editGuest(guestData[i]);
                                    break;
                                } 
                            }
                        });

                        $("#btnDeleteGuest" + gridData[i].GuestDetailId).click(function () 
                        {
                            var guestDetailId = parseInt($(this).data("guestdetailid"));
                            for (var i = 0; i < guestData.length; i++) 
                            {
                                if (parseInt(guestData[i].GuestDetailId) === guestDetailId) 
                                {
                                    _deleteGuestLogic(guestData[i]);
                                    break;
                                }
                            }
                        });

                        $("#btnSendRsvpEmailToGuest" + gridData[i].GuestDetailId).click(function () 
                        {
                            var guestDetailId = parseInt($(this).data("guestdetailid"));
                            var guest = null;
                            for (var i = 0; i < guestData.length; i++) 
                            {
                                if (parseInt(guestData[i].GuestDetailId) === guestDetailId) 
                                {
                                    guest = guestData[i];
                                    break;
                                }
                            }

                            //show notification that guest was emailed
                            _createNotification("<i class='fa fa-envelope-o' aria-hidden='true'></i>Guest Was Emailed successfully! YAYYYY!", "success");
                        });

                        if (isNullOrBlank(guestData[i].Email))
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

        function _formatGridData(response)
        {
            guestData = [];

            for (var i = 0; i < response.length; i++)
            {
                var nameString = "";
                for (var x = 0; x < response[i].GuestDetails.length; x++)
                {
                    var guest = response[i].GuestDetails[x];
                    guest.Address1 = response[i].Address1;
                    guest.Address2 = response[i].Address2;
                    guest.City = response[i].City;
                    guest.State = response[i].State;
                    guest.Zip = response[i].Zip;
                    guest.CheckedIn = response[i].CheckedIn;
                    guest.Attending = response[i].Attending;
                    guest.Family = response[i].Family;
                    guest.ConfirmationCode = response[i].ConfirmationCode
                    guest.GridSearchText = guest.FirstName + " " + guest.LastName + " " + guest.Email;
                    guestData.push(guest);
                    nameString += guest.FirstName + " " + guest.LastName + " ";
                }

                response[i].NameString = nameString;
            }
            return response;
        }

        function _initGuestCreateEditForm(response)
        {

            $("#ddlAttachToGuest").kendoDropDownList({
                dataTextField: "NameString",
                dataValueField: "GuestHeaderId",
                dataSource: response,
                filter: "contains",
                optionLabel: {
                    NameString: "Select A Guest Family To Attach To",
                    GuestHeaderId: null
                },
                change: function ()
                {
                    var ddlVal = $("#ddlAttachToGuest").data("kendoDropDownList").value();
                    if (!isNullOrBlank(ddlVal))
                    {
                        $(".attachToGuestHide").addClass("hidden");
                    }
                    else
                    {
                        $(".attachToGuestHide").removeClass("hidden");
                    }
                }
            });

            $("#ddlState").kendoDropDownList({
                dataTextField: "Description",
                dataValueField: "Value",
                dataSource: loadStateDropDown(),
                filter: "contains",
                optionLabel: {
                    Description: "Select A State",
                    Value: null
                }
            });

            $("#btnCancel").click(function ()
            {
                showHideGrid(true);
                showHideCreateEditForm(false);
            });

            $("#btnSubmit").click(function ()
            {
                var guestDetailId = isNaN(parseInt($(this).data("GuestDetailId"))) ? null : parseInt($(this).data("GuestDetailId"));
                var guestHeaderId = isNaN(parseInt($(this).data("GuestHeaderId"))) ? null : parseInt($(this).data("GuestHeaderId"));

                if (_validate())
                {
                    var req = {};
                    
                    //attach to existing guest header
                    if (!isNullOrBlank($("#ddlAttachToGuest").data("kendoDropDownList").value()))
                    {
                        attachGuestToHeader({ GuestHeaderId: guestHeaderId, GuestDetailId: guestDetailId });
                    }
                    else
                    {
                        if (!isNullOrBlank(guestDetailId) && !isNullOrBlank(guestHeaderId))
                        {
                            //update guest
                            for (var i = 0; i < guestHeaderData.length; i++)
                            {
                                if (guestHeaderData[i].GuestHeaderId === guestHeaderId)
                                {
                                    req = guestHeaderData[i];
                                    var guestDetail = [];
                                    for (var x = 0; x < guestHeaderData[i].GuestDetails.length; x++)
                                    {
                                        if (guestHeaderData[i].GuestDetails[x].GuestDetailId === guestDetailId)
                                        {
                                            guestDetail.push(guestHeaderData[i].GuestDetails[x]);
                                            break;
                                        }
                                    }
                                    req.GuestDetails = guestDetail;
                                    break;
                                }
                            }

                            req = createGuestPostReqObj(req);
                        }
                        else
                        {
                            //new guest
                            req = createGuestPostReqObj();
                        }

                        showHideSpinner(true, "divGuestCrudContainer")

                        $.when(_postGuest(req)).done(function (ret) 
                        {
                            _createNotification("Data Saved Successfully!", "success");

                            $.when(_getGuests()).done(function (response) 
                            {
                                guestHeaderData = response;
                            
                                _formatGridData(response);
                                setGuestTotalData(guestData);
                                bindAndRefreshGrid(guestData);
                                showHideCreateEditForm(false)
                                showHideGrid(true);
                                showHideSpinner(false, "divGuestCrudContainer")
                            })
                            .fail(function ()
                            {
                                _createNotification("Error Loading Data. Please Try Again!", "danger");
                                showHideSpinner(false, "divGuestCrudContainer")
                            });
                        });
                    }
                }
            });
        }

        function bindAndRefreshGrid(data)
        {
            $("#tblGuestList").data("kendoGrid").dataSource.data(data);
            $("#tblGuestList").data("kendoGrid").refresh();
        }

        function attachGuestToHeader(guest)
        {
            var req = {};
            var guestToUpdate = null;

            if (guest.GuestHeaderId != null && guest.GuestDetailId != null)
            {
                for (var i = 0; i < guestHeaderData.length; i++)
                {
                    if (guestHeaderData[i].GuestHeaderId === guest.GuestHeaderId)
                    {
                        for (var x = 0; x < guestHeaderData[i].GuestDetails.length; x++)
                        {
                            if (guestHeaderData[i].GuestDetails[x].GuestDetailId === guest.GuestDetailId)
                            {
                                guestToUpdate = guestHeaderData[i].GuestDetails[x];
                                break;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < guestHeaderData.length; i++)
            {
                //find guest header that guest is being attached to
                if (guestHeaderData[i].GuestHeaderId === parseInt($("#ddlAttachToGuest").data("kendoDropDownList").value()))
                {
                    req = guestHeaderData[i];
                    break;
                }
            }

            if (guestToUpdate === null)
            {
                //add new guest details to array
                req.GuestDetails.push(
                {
                    FirstName: $("#txtFirstName").val(),
                    LastName: $("#txtLastName").val(),
                    Email: $("#txtEmail").val(),
                    Active: true
                });
            }
            else
            {
                //existing guest is being attached to header
                req.GuestDetails.FirstName = $("#txtFirstName").val();
                req.GuestDetails.LastName = $("#txtLastName").val();
                req.GuestDetails.Email = $("#txtEmail").val();
                req.GuestDetails.Active = true;
                req.GuestDetails.push(guestToUpdate);
            }



            showHideSpinner(true, "divGuestCrudContainer")

            $.when(_attachGuestToHeader(req)).done(function (ret) 
            {
                _createNotification("Data Saved Successfully!", "success");

                $.when(_getGuests()).done(function (response) 
                {
                    guestHeaderData = response;

                    _formatGridData(response);
                    setGuestTotalData(guestData);
                    bindAndRefreshGrid(guestData);
                    showHideCreateEditForm(false)
                    showHideGrid(true);
                    showHideSpinner(false, "divGuestCrudContainer")
                })
                .fail(function ()
                {
                    _createNotification("Error Loading Data. Please Try Again!", "danger");
                    showHideSpinner(false, "divGuestCrudContainer")
                });
            })
            .fail(function ()
            {
                _createNotification("Error Saving Data. Please Try Again!", "danger");
                showHideSpinner(false, "divGuestCrudContainer")
            });
        }

        function createConfirmationCode(lastName) 
        {
            var randomInt = Math.random() * 20;
            randomInt = Math.floor(randomInt);
            var code = lastName.toString() + randomInt.toString();
            return code;
        }

        function createGuestPostReqObj(postObj)
        {
            var req = {};
            if (postObj)
            {
                req = postObj;
                req.Address1 = $("#txtAddress1").val();
                req.Address2 = $("#txtAddress2").val();
                req.City = $("#txtCity").val();
                req.State = $("#ddlState").data("kendoDropDownList").value();
                req.Zip = $("#txtZip").val();
                req.Family = $("input[name='rbFamily']:checked").val();
                req.GuestDetails[0].FirstName = $("#txtFirstName").val();
                req.GuestDetails[0].LastName = $("#txtLastName").val();
                req.GuestDetails[0].Email = $("#txtEmail").val();
            }
            else
            {
                req = {
                    ConfirmationCode: createConfirmationCode($("#txtLastName").val()),
                    Address1: $("#txtAddress1").val(),
                    Address2: $("#txtAddress2").val(),
                    City: $("#txtCity").val(),
                    State: $("#ddlState").data("kendoDropDownList").value(),
                    Zip: $("#txtZip").val(),
                    Active: true,
                    Family: $('input[name=rbFamily]:checked').val(),
                    GuestDetails: [
                        {
                            FirstName: $("#txtFirstName").val(),
                            LastName: $("#txtLastName").val(),
                            Email: $("#txtEmail").val(),
                            Active: true
                        }
                    ]
                };
            }
            
            return req;
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

        function _addNewGuest() 
        {
            $("#createEditGuestPanelTitle").text("Create Guest");
            _resetForm();
            showHideGrid(false);
            showHideCreateEditForm(true);
        }

        function _editGuest(guest) 
        {
            console.log("edit guest ");
            console.log(guest);
            $("#createEditGuestPanelTitle").text("Update Guest");
            _resetForm();
            $("#txtFirstName").val(guest.FirstName);
            $("#txtLastName").val(guest.LastName);
            $("#txtEmail").val(guest.Email);
            $("#txtAddress1").val(guest.Address1);
            $("#txtAddress2").val(guest.Address2);
            $("#txtCity").val(guest.City);
            $("#ddlState").data("kendoDropDownList").value(guest.State)
            $("#txtZip").val(guest.Zip);
            $("#txtConfirmationCode").val(guest.ConfirmationCode);
            $("input[name=rbFamily][value=" + guest.Family + "]").prop('checked', true);

            $("#btnSubmit").data("GuestDetailId", guest.GuestDetailId);
            $("#btnSubmit").data("GuestHeaderId", guest.GuestHeaderId);

            //filter attach to guest ddl
            $("#ddlAttachToGuest").data("kendoDropDownList").dataSource.filter([{field: "GuestHeaderId", operator: "neq", value: guest.GuestHeaderId}])
            
            showHideGrid(false);
            showHideCreateEditForm(true);
        }

        function _validate() {
            //create array of elements to validate
            var req = [
                { ElementId: "txtFirstName", ErrorType: "Required" },
                { ElementId: "txtLastName", ErrorType: "Required" }//,
                //{ ElementId: "txtEmail", ErrorType: "Required" }
            ];

            var errorArr = [];

            $(".borderRed").removeClass("borderRed");

            $("#divErrorMsgContainer").addClass("hidden");
            $("#divErrorMsgContainer").empty();

            _checkRequiredField(req);

            if (errorArr.length > 0) 
            {
                for (var i = 0; i < errorArr.length; i++) 
                {
                    var errorMsg = "<div class='alert alert-danger errorMsg iconBounce'><i class='fa fa-exclamation-circle' aria-hidden='true'></i><span>" + errorArr[i].Msg + "</span></div>";
                    $("#divErrorMsgContainer").append(errorMsg);
                }

                $("#divErrorMsgContainer").removeClass("hidden")
            }

            return errorArr.length > 0 ? false : true;

            function _checkRequiredField(req) 
            {
                var error = false;
                for (var i = 0; i < req.length; i++) 
                {
                    var element = $("#" + req[i].ElementId);
                    if (req[i].ErrorType === "Required") 
                    {
                        if (isNullOrBlank(element.val())) 
                        {
                            element.addClass("borderRed");
                            error = true;
                        }
                    }
                }

                if (error) 
                {
                    errorArr.push({ Msg: "Please Fill Out All Required Fields!" });
                }
            }
        }

        function _resetForm() 
        {
            updateGuestDropDown(guestHeaderData);
            $("#ddlAttachToGuest").data("kendoDropDownList").dataSource.filter({});
            $(".attachToGuestHide").removeClass("hidden");
            $("#txtFirstName").val("");
            $("#txtLastName").val("");
            $("#txtEmail").val("");
            $("#txtAddress1").val("");
            $("#txtAddress2").val("");
            $("#txtCity").val("");
            $("#ddlState").data("kendoDropDownList").value(null);
            $("#txtZip").val("");
            $("#txtConfirmationCode").val("");
            $("input[name=rbFamily][value=1]").prop('checked', true);
            $("#btnSubmit").data("GuestDetailId", null);
            $("#btnSubmit").data("GuestHeaderId", null);
        }

        function _deleteGuestLogic(guest)
        {
            console.log("delete guest ");
            console.log(guest);

            if (!$("#divGuestDeleteWindow").data("kendoWindow"))
            {
                $("#divGuestDeleteWindow").kendoWindow({
                    title: "Delete Guest",
                    actions: ["Close"],
                    modal: true
                });

                $("#divGuestDeleteWindow").data("kendoWindow").wrapper.addClass("guestDeleteWindow");
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

                console.log("delete guest");
                
                showHideSpinner(true, "divGuestDeleteWindow")

                var guestDetailId = parseInt($(this).data("GuestDetailId"));

                var req = {};

                for (var i = 0; i < guestData.length; i++) 
                {
                    if (parseInt(guestData[i].GuestDetailId) === guestDetailId) 
                    {
                        req = guestData[i];
                        break;
                    }
                }

                //set guest to inactive...
                console.log("delete request");
                console.log(req);
                $.when(_deleteGuest(req)).done(function ()
                {
                    console.log("guest deleted");
                    //update grid
                    $.when(_getGuests()).done(function (response)
                    {
                        _formatGridData(response);

                        bindAndRefreshGrid(guestData);

                        $("#divGuestDeleteWindow").data("kendoWindow").close();

                        showHideSpinner(false, "divGuestDeleteWindow")
                    })
                    .fail(function ()
                    {
                        _createNotification("Error Loading Data. Please Try Again!", "danger");
                        showHideSpinner(false, "divGuestCrudContainer")
                    });
                });
            });

            $("#divGuestDeleteWindow").data("kendoWindow").center().open();
        }

        function updateGuestDropDown(data) 
        {
            $("#ddlAttachToGuest").data("kendoDropDownList").dataSource.data(data);
            $("#ddlAttachToGuest").data("kendoDropDownList").value(null);
        }

        //ajax
        function _getGuests() 
        {
            return $.ajax({
                type: "GET",
                url: 'admin/GetGuests',
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            });
        }

        function _postGuest(req) 
        {
            return $.ajax({
                type: "POST",
                url: 'admin/PostGuest',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
        }

        function _deleteGuest(req) 
        {
            return $.ajax({
                type: "POST",
                url: 'admin/DeleteGuest',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
        }

        function _attachGuestToHeader(req) 
        {
            return $.ajax({
                type: "POST",
                url: 'admin/AttachGuestToHeader',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
        }

        //utility
        function isNullOrBlank(value) 
        {
            return value === "undefined" || value === undefined || value === null || value === "" || value === "null";
        }

        function showHideGrid(show) 
        {
            if (show) 
            {
                $("#divGuestGridContainer").removeClass("hidden");
            }
            else 
            {
                $("#divGuestGridContainer").addClass("hidden");
            }
        }

        function showHideCreateEditForm(show) 
        {
            if (show) 
            {
                $("#divGuestCreateEditForm").removeClass("hidden");
            }
            else 
            {
                $("#divGuestCreateEditForm").addClass("hidden");
            }
        }

        function showHideSpinner(show, element) 
        {
            if (show) 
            {
                kendo.ui.progress($("#" + element), true);
            }
            else 
            {
                kendo.ui.progress($("#" + element), false);
            }
        }

        function _createNotification(msg, type) 
        {
            $.notify({
                // options
                message: msg,
            }, {
                    // settings
                    type: type,
                    placement: {
                        from: "top",
                        align: "right"
                    }//,
                    //delay: 9999999
                });
        }

        function loadStateDropDown()
        {
            var states = [
                { Value: "AL", Description: "Alabama" },
                { Value: "AK", Description: "Alaska" },
                { Value: "AS", Description: "American Samoa" },
                { Value: "AZ", Description: "Arizona" },
                { Value: "AR", Description: "Arkansas" },
                { Value: "CA", Description: "California" },
                { Value: "CO", Description: "Colorado" },
                { Value: "CT", Description: "Connecticut" },
                { Value: "DE", Description: "Delaware" },
                { Value: "DC", Description: "District Of Columbia" },
                { Value: "FM", Description: "Federated States Of Micronesia" },
                { Value: "FL", Description: "Florida" },
                { Value: "GA", Description: "Georgia" },
                { Value: "GU", Description: "Guam" },
                { Value: "HI", Description: "Hawaii" },
                { Value: "ID", Description: "Idaho" },
                { Value: "IL", Description: "Illinois" },
                { Value: "IN", Description: "Indiana" },
                { Value: "IA", Description: "Iowa" },
                { Value: "KS", Description: "Kansas" },
                { Value: "KY", Description: "Kentucky" },
                { Value: "LA", Description: "Louisiana" },
                { Value: "ME", Description: "Maine" },
                { Value: "MH", Description: "Marshall Islands" },
                { Value: "MD", Description: "Maryland" },
                { Value: "MA", Description: "Massachusetts" },
                { Value: "MI", Description: "Michigan" },
                { Value: "MN", Description: "Minnesota" },
                { Value: "MS", Description: "Mississippi" },
                { Value: "MO", Description: "Missouri" },
                { Value: "MT", Description: "Montana" },
                { Value: "NE", Description: "Nebraska" },
                { Value: "NV", Description: "Nevada" },
                { Value: "NH", Description: "New Hampshire" },
                { Value: "NJ", Description: "New Jersey" },
                { Value: "NM", Description: "New Mexico" },
                { Value: "NY", Description: "New York" },
                { Value: "NC", Description: "North Carolina" },
                { Value: "ND", Description: "North Dakota" },
                { Value: "MP", Description: "Northern Mariana Islands" },
                { Value: "OH", Description: "Ohio" },
                { Value: "OK", Description: "Oklahoma" },
                { Value: "OR", Description: "Oregon" },
                { Value: "PW", Description: "Palau" },
                { Value: "PA", Description: "Pennsylvania" },
                { Value: "PR", Description: "Puerto Rico" },
                { Value: "RI", Description: "Rhode Island" },
                { Value: "SC", Description: "South Carolina" },
                { Value: "SD", Description: "South Dakota" },
                { Value: "TN", Description: "Tennessee" },
                { Value: "TX", Description: "Texas" },
                { Value: "UT", Description: "Utah" },
                { Value: "VT", Description: "Vermont" },
                { Value: "VI", Description: "Virgin Islands" },
                { Value: "VA", Description: "Virginia" },
                { Value: "WA", Description: "Washington" },
                { Value: "WV", Description: "West Virginia" },
                { Value: "WI", Description: "Wisconsin" },
                { Value: "WY", Description: "Wyoming" }
            ];

            return states;
        }

        $(window).resize(function () 
        {
            if ($("#divGuestDeleteWindow").data("kendoWindow"))
            {
                $("#divGuestDeleteWindow").data("kendoWindow").center();
            }
            
            if ($("#tblGuestList").data("kendoGrid")) 
            {
                $("#tblGuestList").data("kendoGrid").resize();
            }
        });
    }
    )(jQuery);
});

