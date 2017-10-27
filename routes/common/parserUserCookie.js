function parserCookie(Cookie) {
    var crypto = require('crypto');
    for (var i = 0; i < Cookie.length; i++) {
        var params = Cookie[i].split('=');  //key-value
        if (params[0].trim() == 'vvaccount') {
            var decipher = crypto.createDecipher('blowfish','mwebm.com');
            var dec = decipher.update(params[1].trim(),'hex','utf8');
            dec += decipher.final('utf8');
            var cookieArr = dec.split('&');
            return {
                username: (cookieArr[0].split('='))[1],
                usertype: (cookieArr[1].split('='))[1],
                review: (cookieArr[2].split('='))[1]
            };
            // return (dec.split('&'))[2].split('=')[1];
        }
    }
}

module.exports = parserCookie;