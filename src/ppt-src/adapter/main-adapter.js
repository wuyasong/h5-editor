var template = require('../lib/template');
var getApp = require('./app/getapp');
var thumbList = require('./thumb/index');
var pageHandler = require('./page/controller');
// 工具栏
var textComponent = require('./toolbar/toolbar-text');
var viewComponent = require('./toolbar/toolbar-view');
var buttonComponent = require('./toolbar/toolbar-button');
var imageComponent = require('./toolbar/toolbar-image');
var audioComponent = require('./toolbar/toolbar-audio');
var videoComponent = require('./toolbar/toolbar-video');
// 控制面板
var textForm = require('./panel/text-form');
var viewForm = require('./panel/view-form');
var buttonForm = require('./panel/button-form');
var imageForm = require('./panel/image-form');
var audioForm = require('./panel/audio-form');
var videoForm = require('./panel/video-form');
var pageForm = require('./panel/page-form');
require('./app/monitor');


var Adapter = {
    init: function () {
        var _this = this;
        // 初始化应用
        new getApp({
            // 恢复上次编辑
            restoreApp: function () {
                _this.restoreApp();
            },
            onRender: function () {
                // 工具栏操作
                _this.toolbarStart();
                // 缩略图区操作
                _this.thumbListStart();
                // 控制面板操作
                _this.controlPanelStart();
                // 页面事件等操作
                _this.pageHandler();
            }
        });
    },
    // 缩略图区初始化
    thumbListStart: function () {
        thumbList.init();
    },
    // 工具栏初始化
    toolbarStart: function () {
        // 实例化文本工具组件
        model.tools.textComponent = this.textComponent = new textComponent();
        // 实例化容器工具组件
        model.tools.viewComponent = this.viewComponent = new viewComponent();
        // 实例化按钮工具组件
        model.tools.buttonComponent = this.buttonComponent = new buttonComponent();
        // 实例化图片工具组件
        model.tools.imageComponent = this.imageComponent = new imageComponent();
        // 实例化音频工具组件
        model.tools.audioComponent = this.audioComponent = new audioComponent();
        // 实例化视频工具组件
        model.tools.videoComponent = this.videoComponent = new videoComponent();
    },
    // 恢复应用编辑状态
    restoreApp: function () {
        var _this = this;
        // 创建元素
        for (var i = 0; i < model.pages.length; i++) {
            // 当前主编辑页显示
            $('.main-preview-page-item').eq(i).show().siblings('.main-preview-page-item').hide();
            // 当前缩略列表项选中
            $('.main-thumb-item').eq(i).addClass('current').siblings().removeClass('current');
            $.each(model.pages[i].component, function (id, element) {
                // 更正由于创建元素后再新建页面引起的pageIndex错误问题
                element.pageIndex = i;
                switch (element.type) {
                    case 'text':
                        _this.textComponent.build(element);
                        break;
                    case 'view':
                        _this.viewComponent.build(element);
                        break;
                    case 'button':
                        _this.buttonComponent.build(element);
                        break;
                    case 'image':
                        _this.imageComponent.build(element);
                        break;
                    case 'audio':
                        _this.audioComponent.build(element);
                        break;
                    case 'video':
                        _this.videoComponent.build(element);
                        break;
                }
            });
        }
        // 渲染背景音乐项
        $('.currBgMusic').html(model.bgMusic);
        // 滚动至最下方
        $('.main-thumb-box').get(0).scrollTop = 9999;
    },
    // 控制面板区初始化
    controlPanelStart: function () {
        // 实例化页面面板
        this.pageForm = new pageForm();
        // 实例化文本面板
        this.textForm = new textForm();
        // 实例化形状面板
        this.viewForm = new viewForm();
        // 实例化按钮面板
        this.buttonForm = new buttonForm();
        // 实例化图片面板
        this.imageForm = new imageForm();
        // 实例化音频面板
        this.audioForm = new audioForm();
        // 实例化视频面板
        this.videoForm = new videoForm();
    },
    // 页面操作初始化
    pageHandler: function () {
        pageHandler.init();
    }
};

module.exports = Adapter;