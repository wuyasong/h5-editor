function setCookie(res, key, value, time) {
    var crypto = require('crypto');
    // 加密用户信息存入cookie
    var cipher = crypto.createCipher('blowfish', 'mwebm.com');
    var crypted = cipher.update(value, 'utf8', 'hex');
    crypted += cipher.final('hex');
    res.cookie(key, crypted, {maxAge: time, httpOnly: true, path: '/'}); //单位为毫秒
}

module.exports = setCookie;