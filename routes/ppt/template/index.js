var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
// var log = require('../../../app');
var log = require('../../../config/log');

/* GET /h5/ */
router.get('/', function(req, res, next) {
    res.redirect('/h5/' + uuid.v4());
});

/* GET /h5/xxx */
router.get('/:appid', function(req, res, next) {
    res.render('ppt-editor/index', {
        sessionid: req.params.appid,
    });
});

module.exports = router;