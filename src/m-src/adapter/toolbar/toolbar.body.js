var defaultStore = require('../../store/defaultData'); 
var store = require('../../store/dataSet'); 
var uiDraggable = require('../../utils/ui-draggable');
var uiResizable = require('../../utils/ui-resizable-page');
var bodyFormCtrls = require('../form/bodyCtrls');
var vm = require('../common/vm');
var Cache = require('../common/cache');
var contextmenu = require('../../utils/contextmenu');

var bodyAdapter = function(){
    this.elem = $('.main-preview');
    this.draggleable = null;
    this.resizable = null;
    this.init();
}

function setPageHeight(value){
    this.updateCurrTools();
    // 更新表单视图
    $('.set-body-height').val(value);
    // 更新预览视图
    $('.main-preview-wrapper,.main-preview').height(value);
    // 更新模型
    store.preview.height = value;
}

bodyAdapter.prototype = {
    init: function(){
        var _this = this;
        // 初始化页面高度
        var initHeight = $('.main-preview-wrapper').height();
        if (!store.fullScreen) {
            $('.set-body-height').val(initHeight);
            this.elem.height(initHeight);
        } else {
            this.elem.height(504);
            $('.main-preview-wrapper').height(504);
        }
        // this.elem.height(initHeight);
        store.preview.height = initHeight;
        // 图片按钮监听点击事件
        $('.main-toolbar-body').unbind('click').bind('click', function(e){
            e.stopPropagation();
            // 初始化背景画布元素
            _this.getBody();
        });
        // 实例化表单项change操作
        this.formCtrls = new bodyFormCtrls();
    },
    getBody: function(){
        // 更新当前元素，添加拖拽框
        this.updateCurrTools();
        // dom元素实例化缩放事件
        this.initResizeEvent();
    },
    // dom元素实例化缩放事件
    initResizeEvent: function(){
        var _this = this;
        this.resizable = new uiResizable({
            resizable: $('.page-ui-resizable'),
            pageView: $('.main-preview'),
            onResizeMove: function(resizable){
                $('.set-body-height').val(parseInt(resizable.height));
            },
            onResizeEnd: function(resizable){
                // 缓存上一个状态
                var oldValue = store.preview.height;
                // 缓存当前状态
                var newValue = resizable.height;
                // 添加历史记录
                // 回调为更新当前对象属性
                vm.execute({
                    undo: setPageHeight.bind(_this, oldValue),
                    execute: setPageHeight.bind(_this, newValue),
                    title: '修改页面高度', 
                });
                // 更新模型
                store.preview.height = resizable.height;
            }
        });
    },
    // 更新元素，编辑工具
    updateCurrTools: function(){
        $('.main-toolbar-body-icon').addClass('active');
        // 更新作用域内元素
        this.elem = $('.main-preview');
        // 更新当前选中元素id
        store.currElemId = null;
        // 更新当前选中编辑工具
        store.currEditTool = 'page';
        // 添加拖拽框
        $('.main-preview-wrapper').addClass('active');
        // 显示右侧表单栏
        $('.aside-options-page').show().siblings().hide();
    }
};

module.exports = bodyAdapter;