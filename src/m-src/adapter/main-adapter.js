var mainView = require('../view/frame/mainView.hbs'); // 左侧主视图
var editView = require('../view/frame/editView.hbs'); // 右侧编辑项视图
var spinnerView = require('../view/frame/spinner.hbs'); // 等待视图
var linkWindowView = require('../view/layer/linkWindow.hbs'); // 链接弹窗视图
var maskWindowView = require('../view/layer/maskWindow.hbs'); // 遮罩层弹窗视图
var contextmenuView = require('../view/layer/contextmenu.hbs'); // 右键菜单视图

var store = require('../store/dataSet');
var defaultStore = require('../store/defaultData');
var toolsProgram = require('./toolbar/toolbarCtrls');
var pageProgram = require('./page/pageCtrls');

var dataSet = {};

// 主适配器类
var Adapter = function(){
    this.init();
};

Adapter.prototype = {
    init: function(){
        this.renderPageView();
        // 初始化工具栏程序
        this.initToolsProgram();
        // 初始化页面操作
        this.initPageProgram();
    },
    // 渲染页面视图
    renderPageView: function(){
        // 如果状态为上次修改 加载上次修改数据
        if (window.edit_m.modify)
            dataSet = $.extend(true, store, window.edit_m.store);
        else
            dataSet = defaultStore;

        // 继承store中的一些属性
        defaultStore.sessionid = window.edit_m.sid;
        defaultStore.title = store.title;
        defaultStore.preview.height = store.preview.height;
        defaultStore.preview.backgroundColor = store.preview.backgroundColor;
        defaultStore.fullScreen = store.fullScreen;
        dataSet.host = window.location.host;    // 获取主机IP
        dataSet.setOptions = store.setOptions;  // 获取设置项
        // console.info(dataSet);

        // 渲染界面
        $('.container').html(
            mainView(dataSet) + 
            editView(defaultStore) +
            spinnerView() +
            maskWindowView() +
            linkWindowView() +
            '<div class="gallery-window" style="display:none;"></div>' +
            '<div class="audio-window" style="display:none;"></div>' +
            '<div class="video-window" style="display:none;"></div>' +
            '<div class="shareInfo-window" style="display:none;"></div>' +
            '<div class="set-edit-window" style="display:none;"></div>' +
            contextmenuView()
        );
    },
    initToolsProgram: function(){
        toolsProgram.init();
    },
    initPageProgram: function(){
        pageProgram.init();
    }
};

module.exports = Adapter;