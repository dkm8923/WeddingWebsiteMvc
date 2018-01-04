var cu = (function ()
{
    return {
        isNullOrBlank: isNullOrBlank,
        showHideSpinner: showHideSpinner,
        createNotification: createNotification,
        showSaveSuccessNotification: showSaveSuccessNotification,
        showDeleteSuccessNotification: showDeleteSuccessNotification,
        showFormValidationErrorNotification: showFormValidationErrorNotification,
        showSaveErrorNotification: showSaveErrorNotification,
        showEmailSuccessNotification: showEmailSuccessNotification,
        showWeddingRsvpAcceptMessage: showWeddingRsvpAcceptMessage,
        showWeddingRsvpDeclineMessage: showWeddingRsvpDeclineMessage,
        showAjaxErrorNotification: showAjaxErrorNotification,
        loadStateDropDown: loadStateDropDown,
        showAjaxError: showAjaxError,
        gridSearchLogic: gridSearchLogic,
        bindAndRefreshGrid: bindAndRefreshGrid,
        showFormHideGrid: showFormHideGrid,
        createKendoWindow: createKendoWindow,
        createEmailBody: createEmailBody,
        createEmailBodyWithConfirmCode: createEmailBodyWithConfirmCode,
        disableKendoEditor: disableKendoEditor,
        createKendoGrid: createKendoGrid,
        convertDateToMMDDYY: convertDateToMMDDYY,
        exportGrid: exportGrid
    };

    function isNullOrBlank(value) 
    {
        return value === "undefined" || value === undefined || value === null || value === "" || value === "null";
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

    function createNotification(req) 
    {
        //close previous notifcations
        $.notifyClose();

        var msg = "<div class='divNotification animated slideInDown'><i class='" + req.Icon + "' aria-hidden='true'></i>" + req.Msg + "</div>";

        $.notify({
            // options
            message: msg
        },{
	        // settings
            type: req.Type,
            offset:{x:50, y: 100}
            //,delay: 99000
        });
    }

    function showSaveSuccessNotification() 
    {
        var req = {
            Icon: "fa fa-floppy-o",
            Msg: "Data Saved Successfully!",
            Type: "success"
        };

        createNotification(req);
    };

    function showDeleteSuccessNotification() 
    {
        var req = {
            Icon: "fa fa-trash",
            Msg: "Data Deleted Successfully!",
            Type: "success"
        };

        createNotification(req);
    };

    function showFormValidationErrorNotification() 
    {
        var req = {
            Icon: "fa fa-exclamation-triangle",
            Msg: "Form Validation Error Occurred, Please Try Again!",
            Type: "danger"
        };

        createNotification(req);
    };

    function showSaveErrorNotification() 
    {
        var req = {
            Icon: "fa fa-exclamation-triangle",
            Msg: "Error Occurred While Saving Data, Please Try Again!",
            Type: "danger"
        };

        createNotification(req);
    };

    function showEmailSuccessNotification() 
    {
        var req = {
            Icon: "fa fa-envelope-oe",
            Msg: "Email(s) Sent Successfully! Please Allow A Few Moments For Emails To Be Received!",
            Type: "success"
        };

        createNotification(req);
    };

    function showWeddingRsvpAcceptMessage()
    {
        var req = {
            Icon: "fa fa-smile-o",
            Msg: "Thank You for the RSVP! We look forward to seeing you at the wedding!",
            Type: "success"
        };

        createNotification(req);
    }

    function showWeddingRsvpDeclineMessage()
    {
        var req = {
            Icon: "fa fa-frown-o",
            Msg: "Thank You for letting us know you can not attend! Hope to see you soon!",
            Type: "success"
        };

        createNotification(req);
    }

    function showAjaxErrorNotification()
    {
        var req = {
            Icon: "fa fa-exclamation-triangle",
            Msg: "Error Loading / Saving Data. Please Try Again!",
            Type: "danger"
        };

        createNotification(req);
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

    function showAjaxError(req)
    {
        showAjaxErrorNotification();
        cu.showHideSpinner(false, req.ElementId)
    }

    function gridSearchLogic(req)
    {
        var text = $("#" + req.SearchTextboxId).val();

        if (text) 
        {
            var orFilter = { logic: "or", filters: [] };
            orFilter.filters.push({ field: "GridSearchText", operator: "contains", value: text });

            $("#" + req.GridId).data("kendoGrid").dataSource.filter(orFilter);
        }
        else 
        {
            $("#" + req.GridId).data("kendoGrid").dataSource.filter({});
        }
    }

    function bindAndRefreshGrid(req)
    {
        $("#" + req.GridId).data("kendoGrid").dataSource.data(req.Data);
        $("#" + req.GridId).data("kendoGrid").refresh();
    }

    function showFormHideGrid(req)
    {
        if (req.Show)
        {
            $("#" + req.MainPage).addClass("hidden");
            $("#" + req.Form).removeClass("hidden");
        }
        else
        {
            $("#" + req.MainPage).removeClass("hidden");
            $("#" + req.Form).addClass("hidden");
        }
    }

    function createKendoWindow(req)
    {
        $("#" + req.WindowElement).kendoWindow({
            title: req.WindowTitle,
            actions: ["Close"],
            modal: true
        });

        $("#" + req.WindowElement).data("kendoWindow").wrapper.addClass("defaultWindowTemplate");

        if (req.WindowType === "Delete")
        {
            $("#" + req.WindowElement).data("kendoWindow").wrapper.addClass("deleteWindowTemplate");
        }
    }

    function createEmailBody(req)
    {
        var styledEmailTemplate = Handlebars.compile(document.getElementById("styledEmailTemplate").innerHTML);
        return styledEmailTemplate({ EmailBody: req.EmailBody, ShowConfirmCode: false });
    }

    function createEmailBodyWithConfirmCode(req)
    {
        var styledEmailTemplate = Handlebars.compile(document.getElementById("styledEmailTemplate").innerHTML);
        return styledEmailTemplate({ EmailBody: req.EmailBody, ShowConfirmCode: true, ConfirmationCode: req.ConfirmationCode });
    }

    function disableKendoEditor(req)
    {
        var editor = $("#" + req.ElementId).data().kendoEditor;
        var editorBody = $(editor.body)
        editorBody.attr("contenteditable", false);
    }

    function createKendoGrid(req)
    {
        $("#" + req.GridId).kendoGrid({
            dataSource: req.Data,
            //groupable: req.Groupable ? true : false,
            sortable: true,
            resizable: true,
            dataBound: cu.isNullOrBlank(req.DataBound) ? null : req.DataBound,
            //columnMenu: true,
            columns: req.Columns
        });
    }

    //convert date string to MM / DD / YYYY
    function convertDateToMMDDYY(dateString)
    {
        return kendo.toString(kendo.parseDate(dateString), "MM/dd/yyyy");
    };

    //Exports a given Kendo Grid to Excel
    function exportGrid(gridname, fileName, dateStamp, filterable)
    {
        if ($("#" + gridname).data("kendoGrid"))
        {
            var grid = $("#" + gridname).data("kendoGrid");

            if (fileName)
            {
                if (dateStamp)
                {
                    grid.options.excel.fileName = fileName + kendo.toString(new Date(), " yyyy-MM-dd HH.mm.ss") + ".xlsx";
                }
                else
                {
                    grid.options.excel.fileName = fileName + ".xlsx";
                }
            }

            grid.options.excel.filterable = filterable;
            grid.saveAsExcel();
        }
    }

})();

var fv = (function ()
{
    return {
        validateFormBase: validateFormBase,
        showError: showError,
        clearFormValidation: clearFormValidation
    };

    function validateFormBase(req)
    {
        var errorArr = [];

        $(".borderRed").removeClass("borderRed");
        $("#" + req.ErrorMsgContainer).addClass("hidden");
        $("#" + req.ErrorMsgContainer).empty();

        _checkRequiredField(req.RequiredFields);

        return errorArr;

        function _checkRequiredField(req) 
        {
            var error = false;
            for (var i = 0; i < req.length; i++) 
            {
                var element = $("#" + req[i].ElementId);

                if (req[i].ErrorType === "Required") 
                {
                    if (req[i].ElementType)
                    {
                        if (cu.isNullOrBlank(element.data(req[i].ElementType).value())) 
                        {
                            var elemClass = null;

                            if (req[i].ElementType === "kendoDropDownList")
                            {
                                elemClass = ".k-dropdown";
                            }
                            else if (req[i].ElementType === "kendoEditor")
                            {
                                elemClass = ".k-editor";
                            }

                            element.closest(elemClass).addClass("borderRed");
                            
                            error = true;
                        }
                    }
                    else
                    {
                        if (cu.isNullOrBlank(element.val())) 
                        {
                            element.addClass("borderRed");
                            error = true;
                        }
                    }
                }
            }

            if (error) 
            {
                errorArr.push({ Msg: "Please Fill Out All Required Fields!" });
            }
        }
    }

    function showError(req)
    {
        for (var i = 0; i < req.ErrorArr.length; i++) 
        {
            var errorMsg = "<div class='alert alert-danger errorMsg iconBounce'><i class='fa fa-exclamation-circle' aria-hidden='true'></i><span>" + req.ErrorArr[i].Msg + "</span></div>";
            $("#" + req.ErrorMsgContainer).append(errorMsg);
        }

        $("#" + req.ErrorMsgContainer).removeClass("hidden")
    }

    function clearFormValidation(req)
    {
        $(".borderRed").removeClass("borderRed");
        $("#" + req.ErrorMsgContainer).addClass("hidden");
        $("#" + req.ErrorMsgContainer).empty();
        $.notifyClose();
    }
})();