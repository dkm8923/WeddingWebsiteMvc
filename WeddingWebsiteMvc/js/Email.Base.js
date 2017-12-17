﻿var eb = (function ()
{
    var containerElem = "divEmailCrudContainer";
    var emailGridActionsTemplate = Handlebars.compile(document.getElementById("emailGridActionsTemplate").innerHTML);
    var emailData = null;

    init();

    return {
        refreshEmailBaseUi: refreshEmailBaseUi,
        getEmailData: getEmailData
    }

    function init()
    {
        cu.showHideSpinner(true, containerElem)

        //load guest data
        $.when(svc.getEmailData()).done(function (response) 
        {
            emailData = formatEmailData(response);

            $("#btnAddNewEmail").click(function ()
            {
                ece.addNewEmail();
            });

            $("#txtSearchEmailGrid").keyup(function (e) 
            {
                cu.gridSearchLogic({SearchTextboxId: "txtSearchEmailGrid", GridId: "tblEmailList"});
            });

            initGrid(emailData);

            ece.init(response);

            et.init();

            cu.showHideSpinner(false, containerElem)
        })
        .fail(function ()
        {
            cu.showAjaxError({ElementId: containerElem});
        });
    }

    function formatEmailData(data)
    {
        for (var i = 0; i < data.length; i++)
        {
            data[i].GridSearchText = data[i].Description + " " + data[i].Subject + " " + data[i].Body;
        }

        return data;
    }

    function getEmailData()
    {
        return emailData;
    }

    function initGrid(data)
    {
        setGridHeight();
        cu.createKendoGrid({
            GridId: "tblEmailList",
            Data: data,
            DataBound: function () 
            {
                $("[data-editEmailButton]").click(function ()
                {
                    var id = parseInt($(this).data("id"));
                    ece.editEmail(getEmailById(emailData, id));
                });

                $("[data-deleteEmailButton]").click(function ()
                {
                    var id = parseInt($(this).data("id"));
                    ed.deleteEmail(getEmailById(emailData, id));
                });

                $("[data-sendTestEmailButton]").click(function ()
                {
                    var id = parseInt($(this).data("id"));
                    et.sendTestEmail(getEmailById(emailData, id));
                });
            },
            Columns: [
                {
                    title: "Actions",
                    template: function (data) 
                    {
                        return emailGridActionsTemplate({Id: data.Id});
                    },
                    width: 170
                },
                {
                    field: "Description",
                    title: "Description",
                    width: 200
                }
                , {

                    field: "Subject",
                    title: "Subject",
                    template: function (data)
                    {
                        if (data.Subject.length > 100)
                        {
                            return data.Subject.substring(0, 100) + "...";
                        }

                        return data.Subject;
                    },
                    width: 300
                }
                , {
                    field: "Body",
                    title: "Body",
                    template: function (data)
                    {
                        if (data.Body.length > 100)
                        {
                            return data.Body.substring(0, 100) + "...";
                        }

                        return data.Body;
                    },
                    width: 400
                }
            ]
        });
    }

    function setGridHeight()
    {
        $("#tblEmailList").height($(window).height() - 200 + "px");
    }

    function getEmailById(emailData, id)
    {
        for (var i = 0; i < emailData.length; i++)
        {
            if (emailData[i].Id === id)
            {
                return emailData[i];
            }
        }

        return null;
    }

    function refreshEmailBaseUi(req)
    {
        emailData = formatEmailData(req);

        cu.bindAndRefreshGrid({ GridId: "tblEmailList", Data: emailData });

        $("#txtSearchEmailGrid").val("");
        $("#tblEmailList").data("kendoGrid").dataSource.filter({});
    }

    $(window).resize(function () 
    {
        if ($("#divEmailDeleteWindow").data("kendoWindow"))
        {
            $("#divEmailDeleteWindow").data("kendoWindow").center();
        }

        setGridHeight();
        $("#tblEmailList").data("kendoGrid").resize(true);
    });

})();