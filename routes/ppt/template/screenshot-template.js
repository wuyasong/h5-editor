var express = require('express');
var router = express.Router();
var fs = require('fs');
var DB = require('../../common/database.js');

/* GET /h5/screenshot */
router.get('/:appId', function(req, res, next) {
    // res.end(req.params.appid);
    
    // 读取jsonPath
    DB.query(res, {sql: 'SELECT storePath from edit_ppt_data WHERE appId="' + req.params.appId + '"'}, function(result){
        if (!result[0]) 
            res.render('404/404');
        else
            readJsonFile(result[0].storePath);

    });
    
    function readJsonFile(filePath){
        fs.readFile('./source' + filePath, function(err, data){
            if (err) {
                res.end('error');
                throw err;
            }
            // 获取html文本数据
            var results = data.toString();
            var json = JSON.parse(results);
            delete json.currentIndex;
            delete json.currentId;
            delete json.currentPage;
            delete json.currentTools;
            delete json.currentIndex;
            delete json.history;
            // 输出截屏html文件
            res.render('ppt-editor/ppt-template-screenshot', {
                title: json.title, 
                description: json.description,
                data: (json)
            });
        });
    }
});

module.exports = router;