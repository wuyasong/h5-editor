var express = require('express');
var router = express.Router();
var DB = require('../../common/database.js');

// 点赞记录
router.get('/', function(req, res, next) {
    // 存储到数据库
    DB.query(res, {
        sql: 'UPDATE edit_ppt_data SET ? WHERE appId="' + req.query.appId + '"', 
        data: {
            likesCount: req.query.likesCount
        } 
    }, function(result){
        // 保存成功返回json
        res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
    });
});

module.exports = router;