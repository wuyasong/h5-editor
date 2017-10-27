var express = require('express');
var router = express.Router();
var DB = require('../../../common/database.js');
router.get('/', function(req, res, next) {
    // 从数据库读取点赞次数
    // 次数+1
    // 修改表
    DB.query(res, {sql: 'SELECT likesCount FROM edit_m_data WHERE sessionId="' + escape(req.query.id) + '"'}, function(result){
        var newLikeCount = parseInt(result[0].likesCount) + 1;
        DB.query(res, {sql: 'UPDATE edit_m_data SET ? WHERE sessionId="' + escape(req.query.id) + '"', data: {likesCount: newLikeCount}}, function(result){
            res.end(JSON.stringify({
                retcode: 1,
                count: parseInt(newLikeCount)
            }));
        });
    });
});

module.exports = router;