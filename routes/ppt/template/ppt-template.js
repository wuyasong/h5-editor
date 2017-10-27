var express = require('express');
var router = express.Router();
var fs = require('fs');
var DB = require('../../common/database.js');

/* GET /h5/page/xxx */
router.get('/:appId', function(req, res, next) {
    // res.end(req.params.appid);
    
    // 读取jsonPath
    DB.query(res, {sql: 'SELECT storePath, likesCount, readCount from edit_ppt_data WHERE appId="' + req.params.appId + '"'}, function(result){
        if (!result[0]) 
            res.render('404/404');
        else
            readJsonFile(result[0].storePath, result[0].likesCount, result[0].readCount);

        // 更新浏览量
        result[0] && updatePageViews(result[0].readCount);
    });
    

    function updatePageViews(readCount) {
        var newReadCount = parseInt(readCount) + 1;
        DB.query(res, {
            sql: 'UPDATE edit_ppt_data SET ? WHERE appId="' + req.params.appId + '"', 
            data: {
                readCount: newReadCount
            } 
        });
    }


    function readJsonFile(filePath, likesCount, readCount){
        fs.readFile('./source' + filePath, function(err, data){
            if (err) {
                res.end('error');
                throw err;
            }
            try {
                // 获取html文本数据
                var results = data.toString();
                var json = JSON.parse(results);
                delete json.currentIndex;
                delete json.currentId;
                delete json.currentPage;
                delete json.currentTools;
                delete json.currentIndex;
                delete json.history;
                // delete json.setOptions;
                json.likesCount = parseInt(likesCount);
                json.readCount = parseInt(readCount);
                // 输出html文件
                res.render('ppt-editor/ppt-template', {
                    title: json.title, 
                    description: json.description,
                    data: JSON.stringify(json)
                });
            } catch (e) {
                res.render('404/404');
            }
        });
    }
});

module.exports = router;