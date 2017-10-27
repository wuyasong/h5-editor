var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
// var gm = require('gm').subClass({ imageMagick : true });
var DB = require('../../../common/database.js');
var moment = require('moment');
var crypto = require('crypto');
var ejs = require('ejs');
var domain = require('../../../../config/domain');

/* POST store. */
router.post('/', function(req, res, next) {
    // 获取保存数据对象
    var data = JSON.parse(req.body.data);
    var mStore = data;
    // 将store数据写入json文件，存到source文件夹中
    createJsonFile(function(jsonPath){
        // 数据信息保存至DB
        saveDBData(jsonPath, function(){
            // 生成html文件，写入store数据渲染为css样式（写入时转化单位 px->rem）
            createExportFile({
                sessionId: data.sessionid, 
                body: data.preview, 
                title: data.title, 
                elements: data.elements
            });
            // 保存成功返回json
            res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
        });
    });

    /**
     * 创建导出文件（html，css）
     * 步骤：
     * 读取模板引擎文件export.html
     * 使用handlebars模板渲染内容后
     * 写入新创建的html文件
     */
    function createExportFile(store){
        // 转换单位px —> rem
        formatStyle(store);
        // 读取html模板文件
        fs.readFile('./views/m-editor/export/export.html', function(err, data){
            if (err) {
                res.end(JSON.stringify({ retcode: -4, errorMsg: '读取html模板文件失败' }));
                throw err;
            }
            // 获取html文本数据
            var resultStr = ejs.render(data.toString(), store);
            // 创建html文件
            createHTMLFile(resultStr.replace(/\n|\r/g, ''));
        });
        // 读取css模板文件
        fs.readFile('./views/m-editor/export/exportTpl.css', function(err, data){
            if (err) {
                res.end(JSON.stringify({ retcode: -5, errorMsg: '读取css模板文件失败' }));
                throw err;
            }
            // console.info(store);
            // 获取css文本数据
            var resultStr = ejs.render(data.toString(), store);
            // console.info(resultStr);
            // 创建css文件
            createCSSFile(resultStr.replace(/\n|\r/g, ''));
        });
    }

    function createHTMLFile(dataStr){
        var exists_1, exists_2;
        // 路径格式： /source/webpage/(sessionId)/index.html
        var path_1 = './source/webpage';
        var path_2 = path_1 + '/' + mStore.sessionid;
        var filename = path_2 + '/index.html';
        exists_1 = fs.existsSync(path_1);
        // 判断文件夹是否存在 没有则创建
        if (!exists_1) {
            fs.mkdirSync(path_1);
        }
        exists_2 = fs.existsSync(path_2);
        if (!exists_2) {
            fs.mkdirSync(path_2);
        }
        // 写入html文件
        fs.writeFile(filename, dataStr, function(err){
            if (err) {
                console.info(err);
                res.end(JSON.stringify({ retcode: -6, errorMsg: '写入html文件失败' }));
            } else {
                console.info('写入html成功');
                // 存储到数据库
                // callback(filename.replace(/\.\/source/g, ''))
            }
        });
    }

    function createCSSFile(dataStr){
        var exists_1, exists_2;
        // 路径格式： /source/webpage/(sessionId)/style.css
        var path_1 = './source/webpage';
        var path_2 = path_1 + '/' + mStore.sessionid;
        var filename = path_2 + '/style.css';
        exists_1 = fs.existsSync(path_1);
        // 判断文件夹是否存在 没有则创建
        if (!exists_1) {
            fs.mkdirSync(path_1);
        }
        exists_2 = fs.existsSync(path_2);
        if (!exists_2) {
            fs.mkdirSync(path_2);
        }
        // 写入css文件
        fs.writeFile(filename, dataStr, function(err){
            if (err) {
                console.info(err);
                res.end(JSON.stringify({ retcode: -7, errorMsg: '写入css文件失败' }));
            } else {
                console.info('写入css成功');
                // 存储到数据库
                // callback(filename.replace(/\.\/source/g, ''))
            }
        });
    }

    function createJsonFile(callback){
        // 路径格式： /source/data/public/edit_m_(md5码).json
        var path = './source/data/public';
        var path_2 = path + '/m';
        // 使用sessionId加密MD5码验证是否与上次文件名相同
        var sessionIdToMD5 = crypto.createHash('md5').update(data.sessionid).digest('hex');
        // 使用sessionId加密MD5码为文件名 确保每次写入为同一文件
        var filename = path_2 + '/edit_m_' + sessionIdToMD5 + '.json';
        var exists = fs.existsSync(path);
        // 判断文件夹是否存在 没有则创建
        if (!exists) {
            fs.mkdirSync(path);
        }
        var exists_2 = fs.existsSync(path_2);
        if (!exists_2) {
            fs.mkdirSync(path_2);
        }
        // 写入json文件
        fs.writeFile(filename, req.body.data, function(err){
            if (err) {
                console.info(err);
                res.end(JSON.stringify({ retcode: -3, errorMsg: '写入json文件失败' }));
            } else {
                // 存储到数据库
                callback(filename.replace(/\.\/source/g, ''))
            }
        });
    }

    function saveDBData(jsonPath, callback){
        // 查询DB中是否含有本次编辑数据
        selectSessionId(data.sessionid, function(data){
            if (data.count == 0) {
                insertRow(jsonPath, callback); // 存储基本信息
            } else {
                updateRow(jsonPath, callback); // 存储基本信息
            }
        });
    }

    // 查询DB中是否存在sessionId
    function selectSessionId(id, callback){
        // 存储到数据库
        DB.query(res, {sql: 'SELECT COUNT(*) as count from edit_m_data WHERE sessionId="' + id + '"'}, function(result){
            callback(result[0]);
        });
    }

    // 存储基本信息 执行insert命令 存储createTime
    function insertRow(jsonPath, callback){
        var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            // console.info(data)
        // 存储到数据库
        DB.query(res, {
            sql: 'INSERT INTO edit_m_data SET ?', 
            data: {
                sessionId: data.sessionid,
                title: data.title,
                description: data.description,
                imgUrl: data.shareImg,
                storePath: jsonPath,
                createTime: dateTime,
                updateTime: dateTime
            } 
        }, function(result){
            callback();
        });
    }
    // 存储基本信息 执行update命令 不存储createTime
    function updateRow(jsonPath, callback){
        var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            // console.info(data)
        // 存储到数据库
        DB.query(res, {
            sql: 'UPDATE edit_m_data SET ? WHERE sessionId="' + data.sessionid + '"', 
            data: {
                title: data.title,
                description: data.description,
                imgUrl: data.shareImg,
                storePath: jsonPath,
                updateTime: dateTime
            } 
        }, function(result){
            callback();
        });
    }
    
    function formatStyle(store){
        var body = store.body;
        var elements = store.elements;
        for (var key in body) {
            var element = body[key];
            if (key === 'width' || key === 'height') {
                if (key === 'width' && element == 320) {
                    body[key] = '100%';
                } else {
                    body[key] = element * 2 / 100 + 'rem';
                }
            }
        }

        key = null;

        for (var key in elements) {
            var styles = elements[key].style;
            if (elements[key].type === 'image') {
                elements[key].src = 'http://' + domain + elements[key].src;
            }
            if (elements[key].type === 'audio') {
                if (elements[key].image.play) {
                    elements[key].image.play = 'http://' + domain + elements[key].image.play;
                }
                if (elements[key].image.pause) {
                    elements[key].image.pause = 'http://' + domain + elements[key].image.pause;
                }
            }
            if (elements[key].type === 'video') {
                if (elements[key].poster) {
                    elements[key].poster = 'http://' + domain + elements[key].poster;
                }
            }
            for (var p in styles) {
                var style = styles[p];
                if (p === 'width' || p === 'height' || p === 'left' || p === 'top' || p === 'right' || p === 'bottom') {
                    if (style) {
                        if (p === 'width' && style == 320) {
                            styles[p] = '100%';
                        } else {
                            styles[p] = style * 2 / 100 + 'rem';
                        }
                    }
                } else if (p === 'backgroundImage') {
                    styles[p] = 'url(http://' + domain + style + ')';
                } else if (p === 'borderWidth') {
                    styles[p] = style + 'px';
                }
            }
        }
    }
});

module.exports = router;