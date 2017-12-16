﻿(function () 
{
    var _guestHeaderId = null;
    var defaultData = null;

    $("#liHome").addClass("active");
    window.location.href.split('#')[0];

    _loadAndSetInitData();
    _initHtmlComponents();
    _initRsvpForm();

    function _loadAndSetInitData()
    {
        $.when(_getWeddingDescriptionData()).done(function (response)
        {
            defaultData = response[0];
            $("#pGroomDesc").text(defaultData.GroomDescription);
            $("#pBrideDesc").text(defaultData.BrideDescription);
            $("#pCeremonyDateTimeLoc").text(defaultData.CeremonyDateTimeLocation);
            $("#pCeremonyDesc").text(defaultData.CeremonyDescription);
            $("#pReceptionDateTimeLoc").text(defaultData.ReceptionDateTimeLocation);
            $("#pReceptionDesc").text(defaultData.ReceptionDescription);
        })
        .fail(function ()
        {
            console.log("Failure Loading Init Data....");
        });
    }

    function _initHtmlComponents() 
    {
        // Smooth scrolling using jQuery easing
        $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () 
        {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) 
            {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) 
                {
                    $('html, body').animate({
                        scrollTop: (target.offset().top - 48)
                    }, 1000, "easeInOutExpo");
                    return false;
                }
            }
        });

        $('.js-scroll-trigger').click(function () 
        {
            var self = $(this);
            var id = self[0].id;

            $(".navLink").removeClass("active");

            if (id === "aCornerHomeLink") 
            {
                $("#liHome").addClass("active");
            }
            else 
            {
                self.parent("li").addClass("active");
            }
        });

        var myLatLng = { lat: 41.384845, lng: -81.606507 };

        // Basic options for a simple Google Map
        var mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 12,
            // The latitude and longitude to center the map (always required)
            center: myLatLng
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'WestFall Event Center'
        });
    }
    
    function _showHideStep1(show) 
    {
        if (show) 
        {
            $("#divFormStep1").removeClass("hidden");
            $("#pStep1").removeClass("hidden");
        }
        else 
        {
            $("#divFormStep1").addClass("hidden");
            $("#pStep1").addClass("hidden");
        }
    }

    function _showHideStep2(show)
    {
        if (show) 
        {
            $("#divFormStep2").removeClass("hidden");
            $("#pStep2").removeClass("hidden");
        }
        else 
        {
            $("#divFormStep2").addClass("hidden");
            $("#pStep2").addClass("hidden");
        }
    }

    function _resetForm1() 
    {
        $("#divErrorMsgContainer").empty();
        $("#divErrorMsgContainer").addClass("hiddenVisibility");
        $("#confirmCode").val("");
    }

    function _resetForm2() 
    {
        $("#divErrorMsgContainer").empty();
        $("#divErrorMsgContainer").addClass("hiddenVisibility");
        $("#guestCt").val("");
    }

    function _showError(msg) 
    {
        $("#divErrorMsgContainer").empty();
        $("#divErrorMsgContainer").removeClass("hiddenVisibility");
        $("#divErrorMsgContainer").append("<span class='errorMsgWedding iconBounce'>" + msg + "</span>");
    }

    function _validateConfirmCode(code) 
    {
        var req = { ConfirmationCode: code };
        return $.ajax({
            type: "POST",
            url: 'Wedding/ValidateConfirmationCode',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function _RSVP(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'Wedding/RSVP',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
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

    function _initRsvpForm() 
    {
        //init RSVP form
        $("#btnSendConfirm").click(function (e) 
        {
            e.preventDefault();
            _guestHeaderId = null;

            //validate form
            $("#divErrorMsgContainer").addClass("hiddenVisibility");
            $("#divErrorMsgContainer").empty();
            var code = $("#confirmCode").val();
            if (code === null || code === "") 
            {
                _showError("Please Enter Confirmation Code!");
            }
            else 
            {
                $.when(_validateConfirmCode(code)).done(function (guest) 
                {
                    console.log(guest);
                    if (guest) 
                    {
                        _guestHeaderId = guest.GuestHeaderId;
                        guest.GuestCount = guest.GuestDetails.length;
                        $("#guestCt").val(guest.GuestCount);
                        _resetForm1();
                        _showHideStep1(false);
                        _showHideStep2(true);
                    }
                    else 
                    {
                        _showError("Incorrect Confirmation Code Entered. Please Try Again!");
                    }
                })
                .fail(function (e) 
                {
                    console.log(e);
                    console.log("Confirm failed");
                });
            }
        });

        $("#btnCancelStep1").click(function (e) 
        {
            e.preventDefault();
            _resetForm1()
            _showHideStep1(true);
            _showHideStep2(false);
        });

        $("#btnCancelStep2").click(function (e) 
        {
            e.preventDefault();
            _resetForm1();
            _resetForm2();
            _showHideStep1(true);
            _showHideStep2(false);
        });

        $("#btnSendRsvp").click(function (e) 
        {
            e.preventDefault();
            //validate form
            var guestCt = $("#guestCt").val();
            if ($("#cbAttending").prop("checked") && (guestCt <= 0 || guestCt > 5 || guestCt === "" || isNaN(guestCt))) 
            {
                _showError("Please Enter valid Guest Ct!");
            }
            else 
            {

                var req = {
                    GuestCount: guestCt,
                    Attending: $("#cbAttending").prop("checked"),
                    GuestHeaderId: _guestHeaderId
                };

                $.when(_RSVP(req)).done(function (ret) 
                {
                    console.log(ret);
                    if (ret) 
                    {
                        if (!$("#cbAttending").prop("checked")) 
                        {
                            cu.showWeddingRsvpDeclineMessage();
                        }
                        else
                        {
                            cu.showWeddingRsvpAcceptMessage();
                        }
                        
                        _resetForm1();
                        _resetForm2();
                        _showHideStep1(true);
                        _showHideStep2(false);
                    }
                    else 
                    {
                        cu.showSaveErrorNotification();
                    }
                })
                .fail(function (e) 
                {
                    console.log(e);
                    console.log("RSVP failed");
                });
            }
        });
    }

})();

(function () 
{

    // Cache selectors
    var lastId;
    var topMenu = $("#top-menu");
    var topMenuHeight = topMenu.outerHeight() + 15;
    // All list items
    var menuItems = topMenu.find("a");
    // Anchors corresponding to menu items
    var scrollItems = menuItems.map(function () {
        var item = $($(this).attr("href"));
        if (item.length) { return item; }
    });

    // Bind to scroll
    $(window).scroll(function () 
    {
        // Get container scroll position
        var fromTop = $(this).scrollTop() + topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function () {
            if ($(this).offset().top < fromTop)
                return this;
        });
        // Get the id of the current element
        cur = cur[cur.length - 1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id)
        {
            $(".navLink").removeClass("active");
            lastId = id;
            // Set/remove active class
            menuItems
                .parent().removeClass("active")
                .end().filter("[href='#" + id + "']").parent().addClass("active");
        }
    });

})();