var Cache = require('../component/cache');
var defaultData = require('../../model/defaultData');
// 视图
var mainView = require('../../views/mainView1.tpl');

var App = function (options) {
    this.onRender = options.onRender;
    this.restoreApp = options.restoreApp;
    this.createApp();
}

App.prototype.createApp = function () {
    // 缓存appId
    this.cacheAppId();
    // 获取应用数据
    this.getAppData();
}

// 缓存appid
App.prototype.cacheAppId = function () {
    var href = location.href;
    var appId = href.substring(href.indexOf('/h5/') + 4); // 获取appId
    // 更新模型
    model.appId = appId;
    // 缓存appId
    Cache.save('edit_ppt_appId', appId);
}

App.prototype.getAppData = function () {
    var _this = this;
    $.ajax({
        type: 'GET',
        url: '/h5/api/app/' + model.appId,
        dataType: 'json',
        success: function (state) {
            if (state.retcode == 1) { // 有数据
                // 加载数据
                _this.loadData(state.data, state.favourite);
            } else {  // 无数据
                // 加载数据
                _this.loadData(null, state.favourite);
            }
        },
        error: function () {
            _this.loadData(state.data);
        }
    });
}
// 加载数据
App.prototype.loadData = function (data, favourite) {
    // console.info(favourite);
    if (data) {
        // 复制上次编辑数据到模型中
        $.extend(true, model, data);
        // 渲染页面
        this.renderPage(favourite);
        // 加载应用控制程序
        this.onRender();
        // 恢复应用编辑状态
        this.restoreApp();
    } else {
        // 初始化空白模板数据模型
        model.pages.push({
            background: $.extend(true, {}, defaultData.background),
            component: {}
        });
        // 渲染页面
        this.renderPage(favourite);
        // 加载应用控制程序
        this.onRender();
    }
}

// 渲染页面
App.prototype.renderPage = function (favourite) {
    // template的参数即使没有也要传空对象 否则不会渲染include
    $('.container').html(
        mainView({
            'model': model,
            'default': defaultData,
            'favourite': favourite
        })
    );
}

App.prototype.cacheAppData = function () {}

module.exports = App;