export function getCookieInCSR(name="") {
    const cookieArr = document.cookie.split(";");
   
    for(let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return empty string if not found
    return "";
}

export const setCookieInCSR = (name, value, expires, path, domain, secure) => {
    const today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    const expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + encodeURI(value) +
        ((expires) ? ';expires=' + expires_date.toGMTString() : '') +
        ((path) ? ';path=' + path : '') +
        ((domain) ? ';domain=' + domain : '') +
        ((secure) ? ';secure' : '');
}