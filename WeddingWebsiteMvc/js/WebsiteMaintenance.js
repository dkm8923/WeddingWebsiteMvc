$(document).ready(function ()
{
    (function ()
    {
        var defaultData = null;

        _init();

        function _init()
        {
            $("#btnCancel").click(function ()
            {
                _setFormData(defaultData);
            });

            $("#btnSubmit").click(function ()
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

                $.when(_postWeddingDescriptionData(req)).done(function (response)
                {
                    $.when(svc.getWeddingDescriptionData()).done(function (response)
                    {
                        defaultData = response[0];
                        _setFormData(defaultData);
                        cu.showHideSpinner(false, "websiteMaintenanceContainer")
                    });
                });

            });

            cu.showHideSpinner(true, "websiteMaintenanceContainer")

            $.when(svc.getWeddingDescriptionData()).done(function (response)
            {
                defaultData = response[0];
                _setFormData(defaultData);
                cu.showHideSpinner(false, "websiteMaintenanceContainer")
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
        }
    })();
});