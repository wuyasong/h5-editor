var store = require('../../store/dataSet');
var vm = require('../common/vm');

var textFormCtrls = function () {
    this.init();
};

textFormCtrls.prototype = {
    init: function () {
        var _this = this;
        // 所有input监听change事件
        $('.set-text-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-text-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-text-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-text-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-text-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-text-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        // 层级设置
        $('.set-text-zIndex').unbind('change').bind('change', function(){ _this.zIndexChangeHandler(this.value) });
        $('.set-text-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.set-text-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        $('.ke-toolbar-icon-bold').unbind('click').bind('click', this.textChangeHandler);
        $('.ke-toolbar-icon-underline').unbind('click').bind('click', this.textChangeHandler);
        $('.ke-toolbar-icon-justifyleft').unbind('click').bind('click', this.textChangeHandler);
        $('.ke-toolbar-icon-justifycenter').unbind('click').bind('click', this.textChangeHandler);
        $('.ke-toolbar-icon-justifyright').unbind('click').bind('click', this.textChangeHandler);
        $('.ke-toolbar-icon-href').unbind('click').bind('click', this.linkChangeHandler);
        setTimeout(function () {
            $('.jPicker').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
            $('.link-window').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
        }, 500);
        $('.options-item-font-family').unbind('click').bind('click', this.fontFamilyHandler);
        $('.options-item-font-size').unbind('click').bind('click', this.fontSizeHandler);
        // $('.options-item-font-color').unbind('mouseup').bind('mouseup', this.colorChangeHandler);
        // $('.options-item-font-color').ColorPicker({ color: '#333333', onChange: this.colorChangeHandler });
        $('.options-item-font-color').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: '333333' }) } }, this.colorChangeHandler, this.colorChangeHandler, this.colorChangeHandler);
        // $('.options-item-line-height').unbind('click').bind('click', this.lineHeightHandler);
    },
    // 更新元素id，编辑工具，本实例文本编辑器类，当前选中文本编辑器
    updateCurrTools: function(id){
        // 更新当前文本编辑器类
        this.editor = store.contentEditors[id];
        // 更新当前选中文本编辑器
        store.currContentEditor = this.editor;
        // 更新当前选中元素id
        store.currElemId = id;
        // 更新当前选中编辑工具
        store.currEditTool = 'text';
        // 显示右侧表单栏
        $('.aside-options-font').show().siblings().hide();
    },
    styleChangeHandler: function () {
        if (!store.currElemId) return;
        var _this = this;
        var key = $(this).attr('data-key');
        var value = this.value;
        var style = store.elements[store.currElemId].style;
        // 缓存上一个状态
        var oldValue = { id: store.currElemId, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
        // 缓存当前状态
        var newValue = { id: store.currElemId, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
        if (key === 'width') {
            // 更新文本编辑实例宽高
            store.currContentEditor.setWidth(value);
            newValue.width = value;
        } else if (key === 'height') {
            store.currContentEditor.setHeight(value);
            newValue.height = value;
        } else if (key === 'left') {
            newValue.offsetX = value;
        } else if (key === 'top') {
            newValue.offsetY = value;
        }
        // 更新预览视图模型
        vm.setPreViewModel(key, value);
        // 获取当前
        // 缓存当前元素id，放到闭包内
        var id = store.currElemId;
        // 添加历史记录
        vm.execute({
            undo: vm.move.bind(_this, oldValue, function () { try { _this.updateCurrTools(id); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { _this.updateCurrTools(id); } catch(ex){} }), 
            title: '移动文本元素', 
        });
    },
    zIndexChangeHandler: function(value, callback){
        callback ? callback() : void 0;
        if (!store.currElemId) return;
        var id = store.currElemId;
        if (!callback) {
            // 添加历史记录
            vm.execute({
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'text'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'text'); } catch(ex){} }), 
                title: '修改文本层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-text-zIndex');
        var value = parseInt(elem[0].value);
        value = value + 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexReduceHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-text-zIndex');
        var value = parseInt(elem[0].value);
        value = value - 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    textChangeHandler: function () {
        var command = $(this).attr('data-cmd');
        // var param = $(this).attr('data-cmd-param');
        // 处于获取焦点状态
        // if (store.contentEditorState) {
            if (store.currContentEditor) {
                var cmdVal = store.currContentEditor.queryCommandValue(command);
                //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
                var range = store.currContentEditor.selection.getRange();
                range.select();
                // 执行文本命令
                store.currContentEditor.execCommand(command);
                // 查询命令改变高亮状态
                if (cmdVal === 'left' || cmdVal === 'center' || cmdVal === 'right') {
                    $(this).addClass('selected').siblings('.toolbar-icon-justify').removeClass('selected');
                } else {
                    store.currContentEditor.queryCommandState(command) ? $(this).addClass('selected') : $(this).removeClass('selected');
                }
            }
        // }
    },
    linkChangeHandler: function () {
        // 处于获取焦点状态
        // if (store.contentEditorState) {
            // 显示链接弹窗
            $('.link-window, .mask-layer').show();
            // 关闭,取消按钮监听事件
            $('.link-menu-closebtn, .link-cancel-btn').unbind('click').bind('click', function () { $('.link-window, .mask-layer').hide(); });
            // 确定按钮监听事件
            $('.link-ok-btn').unbind('click').bind('click', function () {
                $('.link-window, .mask-layer').hide();
                // 执行文本命令
                var range = store.currContentEditor.selection.getRange();
                range.select();
                store.currContentEditor.execCommand('link', { href: $('.link-input').val(), title: '', target: '_blank' });
            });
        // }
    },
    fontFamilyHandler: function () {
        // 处于获取焦点状态
        // if (store.contentEditorState) {
            $('.font-family-select').show();
            $(this).find('li').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
            // 下拉列表绑定点击事件
            $(this).find('li').unbind('click').bind('click', function (e) {
                e.stopPropagation();
                var name = $(this).attr('data-name');
                var range = store.currContentEditor.selection.getRange();
                range.select();
                // 执行文本命令
                store.currContentEditor.execCommand('fontfamily', name);
                // 更新选中项
                $('.options-item-font-family-selected').html(name);
                // 隐藏下拉列表
                $('.font-family-select').hide();
            });
        // }
    },
    fontSizeHandler: function () {
        var _this = this;
        // 处于获取焦点状态
        // if (store.contentEditorState) {
            $('.font-size-select').show();
            $(this).find('li').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
            // 下拉列表绑定点击事件
            $(this).find('li').unbind('click').bind('click', function (e) {
                e.stopPropagation();
                var value = $(this).html();
                var range = store.currContentEditor.selection.getRange();
                range.select();
                // 执行文本命令
                store.currContentEditor.execCommand('fontsize', value);
                // 更新选中项
                $('.options-item-font-size-selected').html(value);
                // 隐藏下拉列表
                $('.font-size-select').hide();
            });
        // }
    },
    colorChangeHandler: function (color, context) {
        // var range = store.currContentEditor.selection.getRange();
        // range.select();
        var hex = color.val('hex');
        // 处于获取焦点状态
        if (store.contentEditorState) {
            // 执行文本命令
            store.currContentEditor.execCommand('forecolor', hex ? ('#' + hex) : 'transparent');
        }
        // $('.options-item-font-color-selected').html('#' + hex);
        // $('.font-color-icon').css('background', '#' + hex);
    },
    // lineHeightHandler: function () {
    //     // 处于获取焦点状态
    //     // if (store.contentEditorState) {
    //         $('.line-height-select').show();
    //         $(this).find('li').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
    //         // 下拉列表绑定点击事件
    //         $(this).find('li').unbind('click').bind('click', function (e) {
    //             e.stopPropagation();
    //             var value = $(this).html();
    //             // 执行文本命令
    //             store.currContentEditor.execCommand('lineheight', value);
    //             // 更新选中项
    //             $('.options-item-input-line-height').html(value);
    //             // 隐藏下拉列表
    //             $('.line-height-select').hide();
    //         });
    //     // }
    // }
};

module.exports = textFormCtrls;