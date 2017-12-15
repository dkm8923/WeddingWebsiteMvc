var svc = (function ()
{
    return {
        getGuests: getGuests,
        postGuest: postGuest,
        getEmailData: getEmailData,
        postEmailData: postEmailData,
        sendEmail: sendEmail,
        deleteGuest: deleteGuest,
        attachGuestToHeader: attachGuestToHeader,
        getWeddingDescriptionData: getWeddingDescriptionData,
        postWeddingDescriptionData: postWeddingDescriptionData
    };

    function getGuests() 
    {
        return $.ajax({
            type: "GET",
            url: 'admin/GetGuests',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        });
    }

    function postGuest(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/PostGuest',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function getEmailData() 
    {
        return $.ajax({
            type: "GET",
            url: 'admin/GetEmailData',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        });
    }

    function postEmailData(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/PostEmailData',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function deleteEmailData(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/DeleteEmailData',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function sendEmail(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/SendEmail',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function deleteGuest(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/DeleteGuest',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function attachGuestToHeader(req) 
    {
        return $.ajax({
            type: "POST",
            url: 'admin/AttachGuestToHeader',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

    function getWeddingDescriptionData()
    {
        return $.ajax({
            type: "GET",
            url: '/admin/GetWeddingDescriptionData',
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        });
    }

    function postWeddingDescriptionData(req)
    {
        return $.ajax({
            type: "POST",
            url: '/admin/PostWeddingDescriptionData',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(req)
        });
    }

})();