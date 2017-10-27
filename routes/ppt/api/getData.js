var express = require('express');
var router = express.Router();
var getApp = require('../lib/getAppData');

/* GET store. */
router.get('/:appId', function(req, res, next) {
    /**
     * 获取响应json数据
     */
    new getApp(req.params.appId, res);
});

module.exports = router;