function setCookie(name, value, expiry) {
    var expires = "";
    if (expiry) {
        var date = new Date();
        date.setTime(date.getTime() + (expiry * 1000)); // if days: (days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export {
    getCookie,
    setCookie,
    deleteCookie
}