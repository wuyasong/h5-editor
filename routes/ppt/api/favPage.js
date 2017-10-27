var express = require('express');
var router = express.Router();
var phantom = require('phantom');
var DB = require('../../common/database.js');
var fs = require('fs');
var moment = require('moment');
var domain = require('../../../config/domain');

router.post('/', function (req, res, next) {
    // 执行截屏命令 并 存储数据
    screenshot(req, res, saveJsonFile);
});

// 截屏命令
function screenshot(req, res, succCallback){
    var appId = req.body.appId;
    var title = req.body.title;
    var pageNumber = req.body.page;
    var pageData = req.body.data;

    if (!appId) {
        res.end(JSON.stringify({ retcode: 2, errorMsg: 'appId参数错误' }));
    }
    if (!pageNumber) {
        res.end(JSON.stringify({ retcode: 2, errorMsg: 'page参数错误' }));
    }

    // 开启子进程
    var spawn = require('child_process').spawn;
    // 执行截屏命令(windows)
    var shot_process = spawn('phantomjs', [
        'routes/ppt/api/screenshot.js',   // 命令
        'http://' + domain + '/h5/screenshot/' + appId,  // 访问页面url
        appId,
        pageNumber,  // 所在第几页(索引 从0开始)
        'source/img/card/'   // 生成图片存放路径
    ]);
    shot_process.stdout.setEncoding('utf8');
    // 监听子进程标准输出流
    shot_process.stdout.on('data', function(data){
        console.info('收到截屏子进程数据' + data.toString());
        var create_img = data.toString().replace(/\s*$/g, '');
        // 存储数据
        succCallback(req, res, appId, title, create_img, pageData);
    });
    shot_process.stderr.on('data', function(data){
        console.info('截屏子进程错误输出流：', data.toString());
    })
    shot_process.on('error', function(err){
        console.info('开启子进程错误：', err);
    })
    // 监听子进程退出
    shot_process.on('close', function(code, singel){
        if(code != 0) {
            console.info('截屏子进程异常退出，退出代码为(' + code + ')', singel);
            console.info('appId=' + appId);
            res.end(JSON.stringify({ retcode: 3, errorMsg: '子进程异常退出' }));
        } else {
            console.info('截屏子进程正常退出，退出代码为(' + code + ')');
            // res.end(JSON.stringify({ retcode: 1, src: '', errorMsg: '' }));
        }
    });

}
/**
 * 存储数据
 * @param {Object} req 
 * @param {Object} res 
 * @param {Number} appId 应用id
 * @param {String} title 应用标题
 * @param {String} img 图片url
 * @param {String} pageData 收藏页数据
 */
function saveJsonFile(req, res, appId, title, img, pageData){
    // 路径格式： /source/data/public/favourite/edit_ppt_xxx.json
    var path = './source/data/public/favourite';
    // 输出文件名
    var filename = path + '/edit_ppt_' + img.replace(/^.+\//gi, '').replace(/\.jpg\s*$/g, '') + '.json';
    // 判断文件夹是否存在 没有则创建
    if (!fs.existsSync(path)) 
        fs.mkdirSync(path);

    // 编辑数据写入json文件
    fs.writeFile(filename, pageData, function(err){
        if (err) {
            console.info(err);
            res.end(JSON.stringify({ retcode: -3, errorMsg: '写入json文件失败' }));
        } else {
            // 存储到数据库
            // 写入json数据
            // 查询表中是否存在该id
            DB.query(this.res, {sql: 'SELECT COUNT(*) as count from edit_ppt_data_singel WHERE imgUrl="' + img + '"'}, function(result){
                if (result[0].count == 0) {  // 无imgUrl
                    insertRow(req, res, appId, title, img, pageData, filename.replace(/\.\/source/g, ''));
                } else {  // 有imgUrl
                    updateRow(req, res, appId, title, img, pageData, filename.replace(/\.\/source/g, ''));
                }
            });
        }
    });
}
/**
 * 增加数据
 * @param {Object} req 
 * @param {Object} res 
 * @param {Number} appId 应用id
 * @param {String} title 应用标题
 * @param {String} img 图片url
 * @param {String} pageData 收藏页数据
 */
function insertRow(req, res, appId, title, img, pageData, filename) {
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // 存储到数据库
    DB.query(res, {
        sql: 'INSERT INTO edit_ppt_data_singel SET ?', 
        data: {
            appId: appId,
            title: title,
            imgUrl: img.replace(/source/g, ''),
            storePath: filename,
            updateTime: dateTime,
        } 
    }, function(result){
        // 保存成功返回json
        res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
    });
}

/**
 * 修改数据
 * @param {Object} req 
 * @param {Object} res 
 * @param {Number} appId 应用id
 * @param {String} title 应用标题
 * @param {String} img 图片url
 * @param {String} pageData 收藏页数据
 */
function updateRow(req, res, appId, title, img, pageData, filename) {
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // 存储到数据库
    DB.query(res, {
        sql: 'UPDATE edit_ppt_data_singel SET ? WHERE appId="' + appId + '"', 
        data: {
            appId: appId,
            title: title,
            imgUrl: img.replace(/source/g, ''),
            storePath: filename,
            updateTime: dateTime,
        } 
    }, function(result){
        // 保存成功返回json
        res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
    });
}

module.exports = router;