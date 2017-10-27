var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var compress = require('compression');  // gzip
var fs = require('fs');
var log = require('./config/log');


var app = express();
var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.info('web-editor listening at http://%s:%s', host, port);
});

// 使用日志中间件
log.use(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view options', { pretty: true });
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(compress());

app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'edit_m_page',
    keys: ['sid'],
    // maxAge: 10 * 1000 // 缓存过期时间10s
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'source')));

// 首页
app.use('/', require('./routes/configMap')); // 首页

// 管理服务
// app.use('/manage', require('./routes/manage/publish')); // 管理后台分布
app.use('/manage', require('./routes/manage/template/index')); // 管理后台首页
app.use('/manage/m', require('./routes/manage/template/spa')); // 管理后台单页
// app.use('/manage/imglist', require('./routes/manage/template/imglist')); // 图片管理
app.use('/manage/api/getAppList', require('./routes/manage/api/getAppList')); // 获取作品列表接口
// app.use('/manage/api/getImgList', require('./routes/manage/api/getImgList')); // 获取图片列表接口
app.use('/manage/js-monitor', require('./routes/manage/api/monitor')); // 前端异常监控接口


// 微信sdk服务
app.use('/wechat_signs', require('./routes/common/wechatSigns')); // 获取微信签名信息

// 滑屏网页编辑器url
// app.use('/h5', require('./routes/h5-switch/index'));  // 滑屏页
// app.use('/h5/uploadImg', require('./routes/h5-switch/uploadImg')); // 上传图片接口
// app.use('/h5/uploadShareImg', require('./routes/h5-switch/uploadShareImg'));
// app.use('/h5/uploadBg', require('./routes/h5-switch/uploadBg')); // 上传背景接口
// app.use('/h5/uploadSong', require('./routes/h5-switch/uploadSong')); // 上传歌曲接口
// app.use('/h5/toSave', require('./routes/h5-switch/saveStore')); // 保存store接口
app.use('/expand', require('./routes/h5-switch/h5-templates')); //模板页
// app.use('/h5/qrcode', require('./routes/h5-switch/qrcode')); //二维码图片地址
// app.use('/h5/insertImageLib', require('./routes/h5-switch/insertImageLib')); //插入图片库接口
// app.use('/h5/getImageLib', require('./routes/h5-switch/getImageLib')); //获取图片库数据接口
// app.use('/h5/getapplist', require('./routes/h5-switch/getapplist')); //获取历史列表接口
// app.use('/h5/clicklikes', require('./routes/h5-switch/clicklikes')); //点赞接口
// app.use('/h5/searchSongInfo', require('./routes/h5-switch/searchSongInfo')); //查询VV音乐歌曲信息接口


// ppt网页编辑器
app.use('/h5', require('./routes/ppt/template/index'));  // ppt编辑器主页面
app.use('/h5/page', require('./routes/ppt/template/ppt-template'));  // 展示页
app.use('/h5/screenshot', require('./routes/ppt/template/screenshot-template'));  // 截屏模板页
// app.use('/h5a', require('./routes/ppt/template/index1'));  // ppt编辑器主页面(静态)
app.use('/h5/api/uploadImg', require('./routes/ppt/api/uploadImg'));  // 上传图片接口
app.use('/h5/api/uploadAudio', require('./routes/ppt/api/uploadAudio'));  // 上传图片接口
app.use('/h5/api/saveData', require('./routes/ppt/api/saveData'));  // 保存网页接口
app.use('/h5/api/app', require('./routes/ppt/api/getData'));  // 获取编辑数据接口
app.use('/h5/api/toPraise', require('./routes/ppt/api/toPraise'));  // 点赞接口
app.use('/h5/api/qrcode', require('./routes/ppt/api/qrcode')); //二维码图片地址
app.use('/h5/api/favourite', require('./routes/ppt/api/favPage')); // 收藏功能接口
app.use('/h5/api/getFavourite', require('./routes/ppt/api/getFavourite')); // 获取收藏页数据接口


// 单页网页编辑器
app.use('/m', require('./routes/m/index'));  // 编辑器首页
app.use('/m/page', require('./routes/m/m-template'));  // 模板页
// app.use('/m', require('./routes/m/index-default'));  // 编辑器首页
app.use('/m/uploadImg', require('./routes/m/api/upload/uploadImg'));  // 上传图片接口
app.use('/m/saveData', require('./routes/m/api/save/saveData'));  // 保存网页接口
app.use('/m/qrcode', require('./routes/m/api/preview/qrcode'));  // 生成二维码接口
app.use('/m/download', require('./routes/m/api/preview/download'));  // 下载文件接口
app.use('/m/toPraise', require('./routes/m/api/likes/toPraise'));  // 点赞接口

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    // next(err);
    res.render('404/404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            // message: err.message,
            message: err,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        // message: err.message,
        message: err,
        error: {}
    });
});

module.exports = app;