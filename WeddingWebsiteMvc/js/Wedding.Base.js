(function () 
{
    var _guestHeaderId = null;
    var defaultData = null;
    var emailData = null;
    var guestBookEntryTemplate = Handlebars.compile(document.getElementById("guestBookEntryTemplate").innerHTML);

    $("#liHome").addClass("active");
    window.location.href.split('#')[0];

    _loadAndSetInitData();
    _initHtmlComponents();
    _initGuestBookForm();
    _initRsvpForm();

    function _loadAndSetInitData()
    {
        $.when(svc.getWeddingInitData()).done(function (response)
        {
            //console.log("init data");
            //console.log(response);
            defaultData = response.WeddingDescriptionData;
            emailData = response.EmailData;
            var html = "";
            for (var i = 0; i < response.GuestBookEntries.length; i++)
            {
                response.GuestBookEntries[i].CreatedOn = cu.jsConvertDateToMMDDYY(new Date(Date.parse(response.GuestBookEntries[i].CreatedOn)));
                html += guestBookEntryTemplate(response.GuestBookEntries[i]);
            }

            $("#divGuestBookMsgContainer").append(html)
            
            //$("#pGroomDesc").html(defaultData.GroomDescription);
            //$("#pBrideDesc").html(defaultData.BrideDescription);
            $("#pCeremonyDateTimeLoc").html(defaultData.CeremonyDateTimeLocation);
            $("#pCeremonyDesc").html(defaultData.CeremonyDescription);
            $("#pReceptionDateTimeLoc").html(defaultData.ReceptionDateTimeLocation);
            //$("#pReceptionDesc").html(defaultData.ReceptionDescription);
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

    function _showError(container, msg) 
    {
        $("#" + container).empty();
        $("#" + container).removeClass("hiddenVisibility");
        $("#" + container).append("<span class='errorMsgWedding iconBounce'>" + msg + "</span>");
    }

    function _initGuestBookForm()
    {
        function _resetGuestBookForm()
        {
            $("#txtGuestBookFrom").val("");
            $("#taGuestBookMsg").val("");
            $("#divGuestBookErrorMsgContainer").empty();
            $(".borderRed").removeClass("borderRed");
        }

        $("#btnAddGuestBookEntry").click(function ()
        {
            _resetGuestBookForm();
            $("#divGuestBookFormContainer").removeClass("hidden");
            $("#btnAddGuestBookEntry").addClass("hidden");
        });

        $("#btnGuestBookCancel").click(function ()
        {
            $("#divGuestBookFormContainer").addClass("hidden");
            $("#btnAddGuestBookEntry").removeClass("hidden");
        });

        $("#btnGuestBookSave").click(function ()
        {
            var errorArr = [];
            $("#divGuestBookErrorMsgContainer").empty();
            $(".borderRed").removeClass("borderRed");

            if ($("#txtGuestBookFrom").val() === "")
            {
                errorArr.push("<span class='errorMsgWedding iconBounce'>Please Enter Your Name In The From Field!</span><br />");
                $("#txtGuestBookFrom").addClass("borderRed");
            }

            if ($("#taGuestBookMsg").val() === "")
            {
                errorArr.push("<span class='errorMsgWedding iconBounce'>Please Enter A Message!</span>");
                $("#taGuestBookMsg").addClass("borderRed");
            }

            if (errorArr.length > 0)
            {
                for (var i = 0; i < errorArr.length; i++)
                {
                    $("#divGuestBookErrorMsgContainer").append(errorArr[i]);
                }

                $("#divGuestBookErrorMsgContainer").removeClass("hiddenVisibility");
            }
            else
            {
                $("#divGuestBookFormContainer").addClass("hidden");

                //add guest book entry
                var postReq = {
                    Name: $("#txtGuestBookFrom").val(),
                    Entry: $("#taGuestBookMsg").val()
                };

                $.when(svc.postGuestBookEntry(postReq)).done(function (response)
                {
                    var req = {
                        Icon: "fa fa-smile-o",
                        Msg: "Thank You for the Guest Book Entry! Your message will be posted shortly!",
                        Type: "success"
                    };

                    cu.createNotification(req);

                    $("#btnAddGuestBookEntry").removeClass("hidden");
                })
                .fail(function ()
                {
                    console.log("Failure Posting Guest Book Entry....");
                    $("#btnAddGuestBookEntry").removeClass("hidden");
                    cu.showSaveErrorNotification(); 
                });
            }
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
                _showError("divErrorMsgContainer", "Please Enter Confirmation Code!");
            }
            else 
            {
                $.when(svc.validateConfirmCode({ ConfirmationCode: code })).done(function (guest) 
                {
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
                        _showError("divErrorMsgContainer", "Incorrect Confirmation Code Entered. Please Try Again!");
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
                _showError("divErrorMsgContainer", "Please Enter valid Guest Ct!");
            }
            else 
            {
                var attending = $("#cbAttending").prop("checked");
                var emailId = cst.confirmEmailSuccessId;
                var emailBody = null;

                if (!attending)
                {
                    emailId = cst.confirmEmailDeclineId;
                }

                for (var i = 0; i < emailData.length; i++)
                {
                    if (emailData[i].Id === emailId)
                    {
                        emailBody = emailData[i].Body;
                        break;
                    }
                }

                var req = {
                    GuestCount: guestCt,
                    Attending: attending,
                    GuestHeaderId: _guestHeaderId,
                    EmailBody: cu.createEmailBody({EmailBody: emailBody})
                };
                
                $.when(svc.rsvp(req)).done(function (ret) 
                {
                    if (ret) 
                    {
                        if (!attending) 
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
