var fs = require('fs');
var DB = require('../../common/database.js');

/**
 * 查询数据库是否有数据
 * 有数据则获取文件路径
 * 读取文件内容返回给页面
 * 无数据则直接返回
 */
var getApp = function (appId, res) {
    this.appId = appId;
    this.res = res;
    this.getdata();
}

// 查询数据库获取数据文件地址
getApp.prototype.getdata = function () {
    var _this = this;
    // 查询表中的storePath
    DB.query(this.res, {sql: 'SELECT storePath from edit_ppt_data WHERE appId="' + this.appId + '"'}, function(result){
        if (!result[0]) {  // 无appId
            // 获取收藏数据
            _this.getFavourite(function (favourite_data) {
                // 输出数据
                _this.res.end(JSON.stringify({ retcode: -1, data: null, favourite: favourite_data, errorMsg: '没有数据' }));
            });
        } else {  // 有appId
            _this.readJson(result[0].storePath);
        }
    });
}

// 读取json文件并输出
getApp.prototype.readJson = function (filePath) {
    var _this = this;
    fs.readFile('./source' + filePath, function(err, data){
        if (err) {
            _this.res.end(JSON.stringify({ retcode: -2, errorMsg: '读取json文件失败' }));
            throw err;
        }
        // 获取html文本数据
        var results = data.toString();
        var json = JSON.parse(results);
        // 获取收藏数据
        _this.getFavourite(function (favourite_data) {
            // 输出数据
            _this.res.end(JSON.stringify({ retcode: 1, data: json, favourite: favourite_data, errorMsg: '' }));
        });
    });
}

// 获取收藏数据
getApp.prototype.getFavourite = function (callback) {
    DB.query(this.res, {sql: 'SELECT appId,title,imgUrl from edit_ppt_data_singel'}, function(result){
        callback(result);
    });
}

module.exports = getApp;