var express = require('express');
var router = express.Router();
var fs = require('fs');
var webpack = require('webpack');
// var webpackConfig = require('../../webpack.config.m');
var DB = require('./db/database.js');

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {

    // 模板页
    if (req.query.tid) {
        // // 设置session
        // req.session.sessionId = req.query.id;
        // 查询json文件位置
        DB.query(res, {sql: 'SELECT storePath from edit_m_temp WHERE tid="' + req.query.tid + '"'}, function(result){
            req.session.storePath = './source' + result[0].storePath;
            res.redirect('/m');
        });
    } else {
    
        // 修改编辑页
        if (req.query.id) {
            // 设置session
            req.session.sessionId = req.query.id;
            // 查询json文件位置
            DB.query(res, {sql: 'SELECT storePath from edit_m_data WHERE sessionId="' + req.query.id + '"'}, function(result){
                // 读取文件中数据
                fs.readFile('./source' + result[0].storePath, function(err, data){
                    if (err) {
                        res.end('error');
                        throw err;
                    }
                    // 获取html文本数据
                    var results = data.toString();
                    res.render('m-editor/index', {
                        sessionId: req.query.id,
                        modify: true,
                        store: results
                    });
                });
            });
        }

        // 新建编辑页
        else {
            var sessionId = guid();
            // 设置session
            req.session.sessionId = sessionId;
            if (!req.session.storePath) {
                res.render('m-editor/index', {
                    sessionId: sessionId,
                    modify: false,
                    store: 0
                });
            } else {
                // 读取文件中数据
                fs.readFile(req.session.storePath, function(err, data){
                    if (err) {
                        res.end('error');
                        throw err;
                    }
                    // 渲染完页面 删除session中storePath 防止再访问编辑页仍然加载模板页
                    req.session.storePath = null;
                    // 获取html文本数据
                    var results = data.toString();
                    res.render('m-editor/index', {
                        sessionId: sessionId,
                        modify: true,
                        store: results
                    });
                });
            }
        }
    }

    // webpack(webpackConfig, function(err){
    //     if (err) {
    //         console.info(err);
    //     }
    // });
});

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = router;