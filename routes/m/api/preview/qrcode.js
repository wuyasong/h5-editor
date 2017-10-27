var express = require('express');
var router = express.Router();
var qr = require('qr-image');
var querystring = require('querystring');
var domain = require('../../../../config/domain');

router.get('/', function(req, res, next) {
    // var host = req.headers.host;
    var sessionid = req.query.id;
    try {
        var img = qr.image('http://' + domain + '/m/page/' + sessionid, {
            size: 4
        });
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});

module.exports = router;