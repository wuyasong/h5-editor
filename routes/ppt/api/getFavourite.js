var express = require('express');
var router = express.Router();
var DB = require('../../common/database.js');
var fs = require('fs');
// var publicImgKey = require('../lib/publicImgKey');

/* GET /getFavourite. */
router.get('/', function(req, res, next) {
    var publicKey = req.query.key;
    var _this = this;
    // 查询表中storePath
    DB.query(this.res, {sql: 'SELECT storePath from edit_ppt_data_singel WHERE imgUrl="' + publicKey + '"'}, function(result){
        if (!result[0]) return;
        // 读取json文件中的页数据
        readJsonFile(result[0].storePath);
    });

    // 读取json文件中的页数据
    function readJsonFile(storePath){
        fs.readFile('./source' + storePath, function(err, data){
            if (err) {
                res.end(JSON.stringify({ retcode: -2, errorMsg: '读取json文件失败' }));
                throw err;
            }
            // 获取html文本数据
            var results = data.toString();
            var json = JSON.parse(results);
            // 输出收藏数据
            res.end(JSON.stringify({ retcode: 1, data: json, errorMsg: '' }));
        });
    }
});

module.exports = router;