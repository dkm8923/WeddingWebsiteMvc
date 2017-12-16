(function ()
{
    var defaultData = null;

    _init();

    function _init()
    {
        $("#btnCancel").click(function ()
        {
            _setFormData(defaultData);
            fv.clearFormValidation({ ErrorMsgContainer: "divErrorMsgContainer" });
        });

        $("#btnSubmit").click(function ()
        {
            if (validate())
            {
                var req = {
                    Id: 1,
                    GroomDescription: $("#taGroomDesc").val(),
                    BrideDescription: $("#taBrideDesc").val(),
                    CeremonyDateTimeLocation: $("#taCeremonyDateTimeLoc").val(),
                    CeremonyDescription: $("#taCeremonyDesc").val(),
                    ReceptionDateTimeLocation: $("#taReceptionDateTimeLoc").val(),
                    ReceptionDescription: $("#taReceptionDesc").val(),
                };

                cu.showHideSpinner(true, "websiteMaintenanceContainer")

                $.when(svc.postWeddingDescriptionData(req)).done(function (response)
                {
                    $.when(svc.getWeddingDescriptionData()).done(function (response)
                    {
                        defaultData = response[0];
                        _setFormData(defaultData);
                        cu.showHideSpinner(false, "websiteMaintenanceContainer")
                        cu.showSaveSuccessNotification();
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
        });

        cu.showHideSpinner(true, "websiteMaintenanceContainer")

        $.when(svc.getWeddingDescriptionData()).done(function (response)
        {
            defaultData = response[0];
            _setFormData(defaultData);
            cu.showHideSpinner(false, "websiteMaintenanceContainer")
        })
        .fail(function ()
        {
            cu.showAjaxError({ElementId: containerElem});
        });

        function _setFormData(defaultData)
        {
            $("#taGroomDesc").val(defaultData.GroomDescription);
            $("#taBrideDesc").val(defaultData.BrideDescription);
            $("#taCeremonyDateTimeLoc").val(defaultData.CeremonyDateTimeLocation);
            $("#taCeremonyDesc").val(defaultData.CeremonyDescription);
            $("#taReceptionDateTimeLoc").val(defaultData.ReceptionDateTimeLocation);
            $("#taReceptionDesc").val(defaultData.ReceptionDescription);
        }

        function validate()
        {
            //create array of elements to validate
            var req = {
                RequiredFields: [
                    { ElementId: "taGroomDesc", ErrorType: "Required" },
                    { ElementId: "taBrideDesc", ErrorType: "Required" },
                    { ElementId: "taCeremonyDateTimeLoc", ErrorType: "Required" },
                    { ElementId: "taCeremonyDesc", ErrorType: "Required" },
                    { ElementId: "taReceptionDateTimeLoc", ErrorType: "Required" },
                    { ElementId: "taReceptionDesc", ErrorType: "Required" }
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
    }
})();