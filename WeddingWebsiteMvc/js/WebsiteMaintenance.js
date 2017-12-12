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

                showHideSpinner(true, "websiteMaintenanceContainer")

                $.when(_postWeddingDescriptionData(req)).done(function (response)
                {
                    $.when(_getWeddingDescriptionData()).done(function (response)
                    {
                        defaultData = response[0];
                        _setFormData(defaultData);
                        showHideSpinner(false, "websiteMaintenanceContainer")
                    });
                });

            });

            showHideSpinner(true, "websiteMaintenanceContainer")

            $.when(_getWeddingDescriptionData()).done(function (response)
            {
                defaultData = response[0];
                _setFormData(defaultData);
                showHideSpinner(false, "websiteMaintenanceContainer")
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

        function _getWeddingDescriptionData()
        {
            return $.ajax({
                type: "GET",
                url: '/admin/GetWeddingDescriptionData',
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            });
        }

        function _postWeddingDescriptionData(req)
        {
            return $.ajax({
                type: "POST",
                url: '/admin/PostWeddingDescriptionData',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(req)
            });
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
    })();
});