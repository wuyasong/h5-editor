var textAdapter = require('./toolbar.text');
var viewAdapter = require('./toolbar.view');
var buttonAdapter = require('./toolbar.button');
var imageAdapter = require('./toolbar.image');
var audioAdapter = require('./toolbar.audio');
var videoAdapter = require('./toolbar.video');
var bodyAdapter = require('./toolbar.body');
var nativeCtrl = require('../common/native');
var store = require('../../store/dataSet');
var vm = require('../common/vm');
// require('../../utils/ueditor.config.js');
// require('../../utils/ueditor.all.min.js');
// require('../../utils/zh-cn.js');
// require('../../utils/colorpicker.js');

function toArray(elems) {
    var array = [];
    for (var key in elems) {
        array.push(elems[key]);
    }
    return array;
}

function toFormatNumber(index) {
    return String(index).length < 2 ? ('0' + index) : index;
}

var toolsProgram = {
    init: function(){
        this.rootHandler();
        // 实例化文本适配器组件
        this.textAdapter = new textAdapter();
        // 实例化容器适配器组件
        this.viewAdapter = new viewAdapter();
        // 实例化按钮适配器组件
        this.buttonAdapter = new buttonAdapter();
        // 实例化图片适配器组件
        this.imageAdapter = new imageAdapter();
        // 实例化音频适配器组件
        this.audioAdapter = new audioAdapter();
        // 实例化视频适配器组件
        this.videoAdapter = new videoAdapter();
        // 实例化背景画布适配器组件
        this.bodyAdapter = new bodyAdapter();
        // 执行键盘操作
        this.keyboardHandler();
        // native扩展功能
        nativeCtrl.init();
        // 撤销重做按钮监听点击事件
        $('.menu-btn-revoke').unbind('click').bind('click', function(){ vm.undo(); });
        $('.menu-btn-recover').unbind('click').bind('click', function(){ vm.redo(); });
        // 如果有 加载上次编辑内容
        if (window.edit_m.modify) 
            this.loadLastModifiedData();
    },
    loadLastModifiedData: function(){
        // 枚举创建过的对象元素 执行其新建方法
        for (var key in store.elements) {
            var element = store.elements[key];
            switch (element.type) {
                case 'text':
                    this.textAdapter.getText(element, element.text);
                    break;
                case 'view':
                    this.viewAdapter.getView(element);
                    break;
                case 'button':
                    this.buttonAdapter.getButton(element);
                case 'image':
                    this.imageAdapter.getImage(element);
                    break;
                case 'audio':
                    this.audioAdapter.getAudio(element);
                    break;
                case 'video':
                    this.videoAdapter.getVideo(element);
                    break;
            }
        }
    },
    rootHandler: function(){
        var _this = this;
        // 表单区域所有位置阻止冒泡到根文档
        $('.aside-options-body, .mask-layer').on('mousedown', function(e){
            e.stopPropagation();
            // 移除所有下拉框
            _this.removeSelectList();
        });
        $('.menu-qrcode-dialog a').on('mousedown', function(e){ e.stopPropagation(); });
        $(document).on('mousedown', function(e){
            if (e.target.className.indexOf('menu-btn') == -1) {
                // 文本编辑器移除编辑状态
                _this.textAdapter.setDisabledAll();
            }
            // 页面背景去除active状态
            $('.main-preview-wrapper, .main-toolbar-body-icon').removeClass('active');
            // 恢复可拖拽状态
            $.each(store.draggables, function(i, draggable){
                draggable.activate = true;
            });
            // 所有元素移除拖拽框
            $('.ui-draggable').removeClass('active');
            // 更新当前元素id
            store.currElemId = null;
            // 更新当前选中编辑工具
            store.currEditTool = 'body';
            // 显示右侧表单栏
            $('.aside-options-page').show().siblings().hide();
            // 更新当前选中文本编辑器为空
            store.currContentEditor = null;
            // 更新文本编辑器正在编辑状态
            store.contentEditorState = false;
            $('.text-tool-icon').removeClass('selected').addClass('disabled');
            // 移除所有下拉框
            _this.removeSelectList();
            $('.contextmenu').hide();
            $('.menu-qrcode-dialog').hide();
        });
    },
    removeSelectList: function(){
        // 文本工具栏中下拉框隐藏
        $('.font-family-select').hide();
        $('.line-height-select').hide();
        $('.font-size-select').hide();
        // 容器工具栏中下篮筐隐藏
        $('.container-bg-position-list').hide();
        $('.container-bg-size-list').hide();
        $('.button-font-size-select').hide();
        $('.options-item-select').hide();
    },
    keyboardHandler: function(){
        var _this = this;
        // 文档监听键盘事件
        $(document).on('keydown', function(e){
            if (e.ctrlKey) {
                if (e.keyCode === 90) {  // 撤销
                    e.preventDefault();
                    vm.undo();
                } else if (e.keyCode === 89) {  // 重做
                    e.preventDefault();
                    vm.redo();
                }
            } else {
                switch (e.keyCode) {
                    case 46:   // del
                        e.preventDefault();
                        delSelected();
                        break;
                    case 37:   // 左
                        e.preventDefault();
                        vm.keyToMove('left', -1);
                        break;
                    case 38:   // 上
                        e.preventDefault();
                        vm.keyToMove('top', -1);
                        break;
                    case 39:   // 右
                        e.preventDefault();
                        vm.keyToMove('left', 1);
                        break;
                    case 40:   // 下
                        e.preventDefault();
                        vm.keyToMove('top', 1);
                        break;
                }
            }
        });

        function delSelected(){
            var adapter, element = {};
            // 如果当前元素不为空
            if (store.currElemId) {
                adapter = _this[store.currEditTool + 'Adapter'];
                // 删除元素
                adapter.deleteHandler(store.currElemId);
            }
        }
    }
}

module.exports = toolsProgram;