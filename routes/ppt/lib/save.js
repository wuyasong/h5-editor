var crypto = require('crypto');
var fs = require('fs');
var DB = require('../../common/database.js');
var moment = require('moment');
// var ejs = require('ejs');
var domain = require('../../../config/domain');

/**
 * 编辑数据写入json文件
 * json文件路径存至DB
 * 返回前台消息
 */
var Save = function (data, res) {
    this.dataString = data;
    this.data = JSON.parse(data);
    this.res = res;
    this.filename = null;
    this.setJsonFile();
    // throw Error('123');
}

// 写入json文件
Save.prototype.setJsonFile = function () {
    var _this = this;
    // 路径格式： /source/data/public/ppt/edit_ppt_(md5码).json
    var path = './source/data/public/ppt';
    // appId转为为MD5码
    var appIdToMD5 = crypto.createHash('md5').update(this.data.appId).digest('hex');
    // 输出文件名
    var filename = path + '/edit_ppt_' + appIdToMD5 + '.json';
    // 判断文件夹是否存在 没有则创建
    if (!fs.existsSync(path)) 
        fs.mkdirSync(path);
    // 编辑数据写入json文件
    fs.writeFile(filename, this.dataString, function(err){
        if (err) {
            console.info(err);
            _this.res.end(JSON.stringify({ retcode: -3, errorMsg: '写入json文件失败' }));
        } else {
            _this.filename = filename.replace(/\.\/source/g, '');
            // 存储到数据库
            _this.saveDB();
        }
    });
}

// 存至数据库
Save.prototype.saveDB = function () {
    // 查询表中是否存在该数据
    this.queryState(this.data.appId);
}

// 查询表中是否已存在当前appId
Save.prototype.queryState = function (appId) {
    var _this = this;
    // 查询表中是否存在该id
    DB.query(this.res, {sql: 'SELECT COUNT(*) as count from edit_ppt_data WHERE appId="' + appId + '"'}, function(result){
        if (result[0].count == 0) {  // 无appId
            _this.insertRow();
        } else {  // 有appId
            _this.updateRow();
        }
    });
}

// 增加数据
Save.prototype.insertRow = function () {
    var _this = this;
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // 存储到数据库
    DB.query(this.res, {
        sql: 'INSERT INTO edit_ppt_data SET ?', 
        data: {
            appId: this.data.appId,
            title: this.data.title,
            pageCount: this.data.pageNumber,
            description: this.data.description,
            imgUrl: this.data.shareImg,
            storePath: this.filename,
            createTime: dateTime,
            updateTime: dateTime
        } 
    }, function(result){
        // 保存成功返回json
        _this.res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
    });
}

// 修改数据
Save.prototype.updateRow = function () {
    var _this = this;
    var dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    // 存储到数据库
    DB.query(this.res, {
        sql: 'UPDATE edit_ppt_data SET ? WHERE appId="' + this.data.appId + '"', 
        data: {
            title: this.data.title,
            pageCount: this.data.pageNumber,
            description: this.data.description,
            imgUrl: this.data.shareImg,
            storePath: this.filename,
            updateTime: dateTime
        } 
    }, function(result){
        // 保存成功返回json
        _this.res.end(JSON.stringify({ retcode: 1, errorMsg: '' }));
    });
}

module.exports = Save;