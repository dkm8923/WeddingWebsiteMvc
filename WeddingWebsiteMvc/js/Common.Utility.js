var cu = (function ()
{
    return {
        isNullOrBlank: isNullOrBlank,
        showHideSpinner: showHideSpinner,
        createNotification: createNotification,
        loadStateDropDown: loadStateDropDown,
        showAjaxError: showAjaxError,
        gridSearchLogic: gridSearchLogic
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

    function createNotification(msg, type) 
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

    function showAjaxError(req)
    {
        cu.createNotification("Error Loading Data. Please Try Again!", "danger");
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

})();

var fv = (function ()
{
    return {
        validateFormBase: validateFormBase,
        showError: showError
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
                    if (cu.isNullOrBlank(element.val())) 
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

    function showError(req)
    {
        for (var i = 0; i < req.ErrorArr.length; i++) 
        {
            var errorMsg = "<div class='alert alert-danger errorMsg iconBounce'><i class='fa fa-exclamation-circle' aria-hidden='true'></i><span>" + req.ErrorArr[i].Msg + "</span></div>";
            $("#" + req.ErrorMsgContainer).append(errorMsg);
        }

        $("#" + req.ErrorMsgContainer).removeClass("hidden")
    }

})();