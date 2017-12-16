var gce = (function ()
{
    var containerElem = "divGuestCrudContainer";

    return {
        init: init,
        addNewGuest: addNewGuest,
        editGuest: editGuest
    };

    function init(response)
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
                if (!cu.isNullOrBlank(ddlVal))
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
            dataSource: cu.loadStateDropDown(),
            filter: "contains",
            optionLabel: {
                Description: "Select A State",
                Value: null
            }
        });

        $("#txtCity").on("keydown", function (e)
        {
            if (e.keyCode === 9)
            {
                $("#ddlState").data("kendoDropDownList").open();
            }
        });

        //$("#btnResetAllConfirmCodes").click(function ()
        //{
        //    resetConfirmationCode();
        //});

        $("#btnCancel").click(function ()
        {
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
                if (!cu.isNullOrBlank($("#ddlAttachToGuest").data("kendoDropDownList").value()))
                {
                    attachGuestToHeader({ GuestHeaderId: guestHeaderId, GuestDetailId: guestDetailId });
                }
                else
                {
                    if (!cu.isNullOrBlank(guestDetailId) && !cu.isNullOrBlank(guestHeaderId))
                    {
                        var guestHeaderData = gb.getGuestHeaderData();

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

                    cu.showHideSpinner(true, "divGuestCrudContainer")

                    $.when(svc.postGuest(req)).done(function (ret) 
                    {
                        cu.showSaveSuccessNotification();

                        $.when(svc.getGuests()).done(function (response) 
                        {
                            gb.refreshGuestBaseUi(response);
                            
                            showHideCreateEditForm(false)
                                
                            cu.showHideSpinner(false, "divGuestCrudContainer")
                        })
                        .fail(function ()
                        {
                            cu.showAjaxError({ElementId: "divGuestCrudContainer"});
                        });
                    });
                }
            }
        });
    }

    function addNewGuest() 
    {
        $("#createEditGuestPanelTitle").text("Create Guest");

        _resetForm();
            
        showHideCreateEditForm(true);

        $("#txtFirstName").focus();
    }

    function editGuest(guest) 
    {
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
            
        showHideCreateEditForm(true);
    }

    function _validate() 
    {
        //create array of elements to validate
        var req = {
            RequiredFields: [
                { ElementId: "txtFirstName", ErrorType: "Required" },
                { ElementId: "txtLastName", ErrorType: "Required" }
            ],
            ErrorMsgContainer: "divErrorMsgContainer"
        }

        var errorArr = fv.validateFormBase(req);

        if (errorArr.length > 0) 
        {
            fv.showError({ ErrorArr: errorArr, ErrorMsgContainer: "divErrorMsgContainer" });
            cu.showFormValidationErrorNotification();
        }

        return errorArr.length > 0 ? false : true;
    }

    function _resetForm() 
    {
        fv.clearFormValidation({ErrorMsgContainer: "divErrorMsgContainer"});
        $("#ddlAttachToGuest").data("kendoDropDownList").dataSource.data(gb.getGuestHeaderData());
        $("#ddlAttachToGuest").data("kendoDropDownList").value(null);
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

    function attachGuestToHeader(guest)
    {
        var req = {};
        var guestToUpdate = null;
        var guestHeaderData = gb.getGuestHeaderData();

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

        cu.showHideSpinner(true, "divGuestCrudContainer")

        $.when(svc.attachGuestToHeader(req)).done(function (ret) 
        {
            cu.showSaveSuccessNotification();

            $.when(svc.getGuests()).done(function (response) 
            {
                gb.refreshGuestBaseUi(response);

                showHideCreateEditForm(false)

                cu.showHideSpinner(false, "divGuestCrudContainer")
            })
            .fail(function ()
            {
                cu.showAjaxError({ElementId: "divGuestCrudContainer"});
            });
        })
        .fail(function ()
        {
            cu.showSaveErrorNotification();
            cu.showHideSpinner(false, "divGuestCrudContainer")
        });
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

    function createConfirmationCode(lastName) 
    {
        var randomInt = (Math.random() * 20) * 10000;
        randomInt = Math.floor(randomInt);
        var code = lastName.toString() + randomInt.toString();
        return code;
    }

    function showHideCreateEditForm(show) 
    {
        cu.showFormHideGrid({ Show: show, MainPage: "divGuestGridContainer", Form: "divGuestCreateEditForm"});
    }

    //function resetConfirmationCode()
    //{
    //    cu.showHideSpinner(true, "divGuestCrudContainer")

    //    var guestHeaderData = gb.getGuestHeaderData();
    //    for (var i = 0; i < guestHeaderData.length; i++)
    //    {
    //        guestHeaderData[i].ConfirmationCode = createConfirmationCode(guestHeaderData[i].GuestDetails[0].LastName); 
    //        guestHeaderData[i].GuestDetails = [];
    //        console.log(guestHeaderData[i].ConfirmationCode);
    //        console.log(guestHeaderData[i]);
    //        svc.postGuest(guestHeaderData[i]);
    //    }
    //}

})();