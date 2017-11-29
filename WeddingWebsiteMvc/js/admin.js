$(document).ready(function () {
    console.log("ready!");
    (function ($) {
        console.log("admin.js loaded...");
        var guestData = [];
        var guestWindowTemplate = Handlebars.compile(document.getElementById("guestWindowTemplate").innerHTML);

        _init();

        function _init() {

            showHideSpinner(true, "divGuestCrudContainer")

            //load guest data
            $.when(_getGuests()).done(function (response) {

                console.log("load guest data");
                console.log(response);
                guestData = [];
                _formatGridData(response);
                
                console.log("formatted data");
                console.log(guestData);

                $("#btnAddNewGuest").click(function () {
                    _addNewGuest();
                });

                _initGrid(guestData);
                _initGuestCreateEditForm(response);

                showHideSpinner(false, "divGuestCrudContainer")
            });
        }

        function _initGrid(data) {
            $("#tblGuestList").kendoGrid({
                dataSource: data,
                //groupable: true,
                sortable: true,
                resizable: true,
                dataBound: function () {
                    var gridData = $("#tblGuestList").data("kendoGrid").dataSource.data();
                    for (var i = 0; i < gridData.length; i++) {
                        
                        $("#btnEditGuest" + gridData[i].GuestDetailId).click(function () {
                            var guestDetailId = parseInt($(this).data("guestdetailid"));
                            for (var i = 0; i < guestData.length; i++) {
                                if (parseInt(guestData[i].GuestDetailId) === guestDetailId) {
                                    _editGuest(guestData[i]);
                                    break;
                                } 
                            }
                        });

                        $("#btnDeleteGuest" + gridData[i].GuestDetailId).click(function () {
                            var guestDetailId = parseInt($(this).data("guestdetailid"));
                            for (var i = 0; i < guestData.length; i++) {
                                if (parseInt(guestData[i].GuestDetailId) === guestDetailId) {
                                    _deleteGuestLogic(guestData[i]);
                                    break;
                                }
                            }
                        });

                    }
                },
                columns: [
                    {
                        title: "Actions",
                        template: function (data) {
                            return "<div class='gridBtnContainer'><button id='btnEditGuest" + data.GuestDetailId + "' data-guestdetailid='" + data.GuestDetailId + "' class='btn btn-warning'><i class='fa fa-pencil' aria-hidden='true'></i></button><button id='btnDeleteGuest" + data.GuestDetailId + "' data-guestdetailid='" + data.GuestDetailId + "' class='btn btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button><div>";
                        }
                    },
                    {
                        field: "FirstName",
                        title: "FIrst Name"
                    }
                    , {

                        field: "LastName",
                        title: "Last name"
                    }
                    , {
                        field: "Email",
                        title: "Email"
                    }
                    , {
                        field: "Attending",
                        title: "Attending"
                    }
                    , {
                        field: "CheckedIn",
                        title: "Checked In"
                    }
                    //, {
                    //    field: "Address1",
                    //    title: "Address 1"
                    //}
                    //, {
                    //    field: "Address2",
                    //    title: "Address 2"
                    //}
                    //, {
                    //    field: "City",
                    //    title: "City"
                    //}
                    //, {
                    //    field: "State",
                    //    title: "State"
                    //}
                    //, {
                    //    field: "Zip",
                    //    title: "Zip"
                    //}
                ]
            });
        }

        function _formatGridData(response) {

            for (var i = 0; i < response.length; i++) {
                var nameString = "";
                for (var x = 0; x < response[i].GuestDetails.length; x++) {
                    var guest = response[i].GuestDetails[x];
                    guest.Address1 = response[i].Address1;
                    guest.Address2 = response[i].Address2;
                    guest.City = response[i].City;
                    guest.State = response[i].State;
                    guest.Zip = response[i].Zip;
                    guest.CheckedIn = response[i].CheckedIn;
                    guest.Attending = response[i].Attending;
                    guest.ConfirmationCode = response[i].ConfirmationCode
                    guestData.push(guest);
                    nameString += guest.FirstName + " " + guest.LastName + " ";
                }

                response[i].NameString = nameString;
            }
            return response;
        }

        function _initGuestCreateEditForm(response) {

            $("#ddlAttachToGuest").kendoDropDownList({
                dataTextField: "NameString",
                dataValueField: "GuestHeaderId",
                dataSource: response
            })

            $("#btnCancel").click(function () {
                showHideGrid(true);
                showHideCreateEditForm(false);
            });

            $("#btnSubmit").click(function () {
                console.log("submit");
                if (_validate()) {
                    //guestData
                    var req = {
                        ConfirmationCode: "Test Confirm Code",
                        Address1: $("#txtAddress1").val(),
                        Address2: $("#txtAddress2").val(),
                        City: $("#txtCity").val(),
                        State: $("#txtState").val(),
                        Zip: $("#txtZip").val(),
                        GuestDetails: [
                            {
                                FirstName: $("#txtFirstName").val(),
                                LastName: $("#txtLastName").val(),
                                Email: $("#txtEmail").val()
                            }
                        ]
                    };

                    //if (!isNullOrBlank($("#ddlAttachToGuest").data("kendoDropDownList").value())) {
                    //    req.GuestHeaderId = $("#ddlAttachToGuest").data("kendoDropDownList").value();
                    //}

                    $.when(_postGuest(req)).done(function (ret) {
                        console.log("Post Guest Success");
                    });
                }
            });
        }

        function _addNewGuest() {
            $("#createEditGuestPanelTitle").text("Create Guest");
            _resetForm();
            showHideGrid(false);
            showHideCreateEditForm(true);
        }

        function _editGuest(guest) {
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
            $("#txtState").val(guest.State);
            $("#txtZip").val(guest.Zip);
            $("#txtConfirmationCode").val(guest.ConfirmationCode);

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

            if (errorArr.length > 0) {
                for (var i = 0; i < errorArr.length; i++) {
                    var errorMsg = "<div class='alert alert-danger errorMsg iconBounce'><i class='fa fa-exclamation-circle' aria-hidden='true'></i><span>" + errorArr[i].Msg + "</span></div>";
                    $("#divErrorMsgContainer").append(errorMsg);
                }

                $("#divErrorMsgContainer").removeClass("hidden")
            }

            return errorArr.length > 0 ? false : true;

            function _checkRequiredField(req) {
                var error = false;
                for (var i = 0; i < req.length; i++) {
                    var element = $("#" + req[i].ElementId);
                    if (req[i].ErrorType === "Required") {
                        if (isNullOrBlank(element.val())) {
                            element.addClass("borderRed");
                            error = true;
                        }
                    }
                }

                if (error) {
                    errorArr.push({ Msg: "Please Fill Out All Required Fields!" });
                }
            }
        }

        function _resetForm() {
            $("#txtFirstName").val("");
            $("#txtLastName").val("");
            $("#txtEmail").val("");
            $("#txtAddress1").val("");
            $("#txtAddress2").val("");
            $("#txtCity").val("");
            $("#txtState").val("");
            $("#txtZip").val("");
            $("#txtConfirmationCode").val("");
        }

        function _deleteGuestLogic(guest) {
            console.log("delete guest ");
            console.log(guest);

            if (!$("#divGuestDeleteWindow").data("kendoWindow")) {
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
            $("#btnSaveGuestDelete").click(function () {

                console.log("delete guest");
                
                showHideSpinner(true, "divGuestDeleteWindow")

                var guestDetailId = parseInt($(this).data("GuestDetailId"));

                var req = {};

                for (var i = 0; i < guestData.length; i++) {
                    if (parseInt(guestData[i].GuestDetailId) === guestDetailId) {
                        req = guestData[i];
                        break;
                    }
                }

                //set guest to inactive...
                console.log("delete request");
                console.log(req);
                $.when(_deleteGuest(req)).done(function () {
                    console.log("guest deleted");
                    //update grid
                    $.when(_getGuests()).done(function (response) {
                        guestData = [];
                        _formatGridData(response);
                        $("#divGuestDeleteWindow").data("kendoWindow").close();
                        showHideSpinner(false, "divGuestDeleteWindow")
                    });
                });
            });

            $("#divGuestDeleteWindow").data("kendoWindow").center().open();
        }

        //ajax
        function _getGuests() {
            return $.ajax({
                type: "GET",
                url: 'admin/GetGuests',
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            });
        }

        function _postGuest(req) {
            return $.ajax({
                type: "POST",
                url: 'admin/PostGuest',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
        }

        function _deleteGuest(req) {
            return $.ajax({
                type: "POST",
                url: 'admin/DeleteGuest',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
        }

        //utility
        function isNullOrBlank(value) {
            return value === "undefined" || value === undefined || value === null || value === "" || value === "null";
        }

        function showHideGrid(show) {
            if (show) {
                $("#divGuestGridContainer").removeClass("hidden");
            }
            else {
                $("#divGuestGridContainer").addClass("hidden");
            }
        }

        function showHideCreateEditForm(show) {
            if (show) {
                $("#divGuestCreateEditForm").removeClass("hidden");
            }
            else {
                $("#divGuestCreateEditForm").addClass("hidden");
            }
        }

        function showHideSpinner(show, element) {
            if (show) {
                kendo.ui.progress($("#" + element), true);
            }
            else {
                kendo.ui.progress($("#" + element), false);
            }
        }

        $(window).resize(function () {
            if ($("#divGuestDeleteWindow").data("kendoWindow")) {
                $("#divGuestDeleteWindow").data("kendoWindow").center();
            }
        });
    }
    )(jQuery);
});

