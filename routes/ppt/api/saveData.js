var express = require('express');
var router = express.Router();
var saveApp = require('../lib/save');
// var log = require('../../../config/log'); 

// 使用日志中间件
// log.use(express());
/* POST store. */
router.post('/', function(req, res, next) {
    
    /**
     * 编辑数据写入json文件
     * json文件路径存至DB
     * 返回前台消息
     */
    new saveApp(req.body.data, res);
});

module.exports = router;