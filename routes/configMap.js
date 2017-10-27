var express = require('express');
var router = express.Router();

// 首页任务处理
router.get('/', function(req, res, next) {
    
    // 重定向到作品列表页
    res.redirect('/manage');
});

module.exports = router;