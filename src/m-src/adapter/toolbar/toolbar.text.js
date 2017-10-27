var defaultStore = require('../../store/defaultData'); 
var store = require('../../store/dataSet'); 
var uiDraggable = require('../../utils/ui-draggable');
var uiResizable = require('../../utils/ui-resizable');
var textView = require('../../view/preview/textView.hbs');
var textFormCtrls = require('../form/textCtrls');
var vm = require('../common/vm');
var contextmenu = require('../../utils/contextmenu');
var layerComponent = require('../common/layer.ctrls');

var TimeFn = null;

var textAdapter = function(){
    this.elemId = null;
    this.elem = null;
    this.editor = null;
    this.draggleable = null;
    this.resizable = null;
    this.init();
}

textAdapter.prototype = {
    init: function(){
        var _this = this;
        // 文本按钮监听点击事件
        $('.main-toolbar-text').unbind('click').bind('click', function(e){
            e.stopPropagation();
            _this.getText();
            var element = {};
            // 深度拷贝文本元素模型 防止删除后找不到对象
            $.extend(true, element, store.elements[_this.elemId]);
            // 添加历史记录(所有同步操作执行完成后再执行历史操作)
            // 文本元素模型和editor实例缓存在action方法闭包作用域内
            vm.execute({
                undo: _this.delSelectedElem.bind(_this, element.id), 
                execute: _this.getText.bind(_this, element, element.text), 
                title: '新建文本元素', 
            });
        });
        // 实例化表单项修改操作
        new textFormCtrls();
    },
    // 新建文本元素
    getText: function(data, editContent){
        var _this = this;
        // 创建文本唯一模型
        this.createTextModel(data);
        // 创建文本DOM元素
        this.createTextDom();
        // 实例化文本编辑器
        this.initContentEdit(editContent);
        // $('.editBtn').unbind('click').bind('click', function(e){
        //     e.stopPropagation();
        //     _this.textElemDblclickHandler($('#' + _this.elemId)[0]);
        // });
        // 文本DOM元素监听双击事件 添加高亮 更新当前选中元素id 更新为可编辑状态
        $('#' + this.elemId).unbind('dblclick').bind('dblclick', function(e){
            e.stopPropagation();
            _this.textElemDblclickHandler(this);
        });
        // 文本DOM元素实例化缩放事件
        this.initDragEvent();
        // 文本DOM元素实例化拖拽事件
        this.initResizeEvent();
        // 文本DOM元素监听右键事件 删除项  添加历史记录
        this.elem.unbind('contextmenu').bind('contextmenu', function(e){ e.stopPropagation(); _this.textContextMenu(e, this); return false; });
        // 创建图层
        layerComponent.insert('文本', store.elements[this.elemId], this.updateCurrTools);
    },
    // 创建文本唯一模型并继承默认文本模型
    createTextModel: function(data){
        if (data) {
            // 获取id
            this.elemId = data.id;
            // 深度拷贝默认文本模型
            store.elements[this.elemId] = data;
        } else {
            // 获取id
            this.elemId = 'med_text_' + (+new Date());
            // 创建模型
            store.elements[this.elemId] = {
                id: this.elemId
            };
            // 深度拷贝默认文本模型
            $.extend(true, store.elements[this.elemId], defaultStore.text);
        }
        // 更新文本编辑器正在编辑状态
        store.contentEditorState = false;
        $('.text-tool-icon').removeClass('selected').addClass('disabled');
    },
    // 创建文本DOM元素
    createTextDom: function(){
        if (!$('#' + this.elemId).length) {
            var textElem, scrollTop = $('.main-preview-box').scrollTop();
            // 预览视口滚动过
            if (scrollTop != 0) {
                store.elements[this.elemId].style.top = scrollTop;
            }
            textElem = textView(store.elements[this.elemId]);
            // 预览窗口创建dom元素生成唯一id  添加历史记录
            $('.main-preview').append(textElem);
        }
        // 获取元素
        this.elem = $('#' + this.elemId);
        // 添加激活状态
        this.elem.addClass('active');
        // 显示右侧表单栏
        $('.aside-options-font').show().siblings().hide();

    },
    // 实例化文本编辑器
    /**
     * 文本编辑器
     * 设置不可编辑
     * 编辑器堆添加
     * 其余编辑器设置不可编辑
     */
    initContentEdit: function(editContent){
        var _this = this;
        if (editContent == undefined) {
            this.editor = UM.getEditor(this.elemId + '_txteditor');
            // this.editor = UE.getEditor(this.elemId + '_txteditor');
        } else {
            // store.contentEditors[_this.elemId]
            this.editor = UM.getEditor(this.elemId + '_txteditor');
            this.editor.setContent(editContent);
            // this.editor = UE.getEditor(this.elemId + '_txteditor', {
            //     onready:function(){   //此处为异步操作，使用this指向
            //         store.contentEditors[this.elemId].body.innerHTML = editContent;
            //         $('#' + this.elemId + '_showTxt').html(editContent);
            //     }
            // });
        }
        // this.editor.setDisabled();
        store.contentEditors[_this.elemId] = this.editor;
        // store.contentEditors.push(this.editor);
        this.setDisabledAll();
        this.editor.elemId = this.elemId;
        _this.editor.ready(function(){ //此处为异步操作，使用this指向
            // 当前编辑实例移除焦点
            // 监听sleectionchange事件 更新模型 改变视图高度
            _this.editor.addListener('selectionchange',function(){
                var key = 'height';
                var value = _this.editor.body.offsetHeight;
                // 通知模型更新
                if (store.elements[store.currElemId]) {
                    store.elements[store.currElemId].style[key] = value;
                    // 更新元素位置
                    _this.elem.css(key, parseInt(value) + 'px');
                }
                // 检测所有命令更新工具栏状态
                $.each(['bold', 'underline'], function(i, command){
                    store.currContentEditor ?
                    store.currContentEditor.queryCommandState(command) ? $('.ke-toolbar-icon-' + command).addClass('selected') : $('.ke-toolbar-icon-' + command).removeClass('selected') :
                    void 0;
                });
                $.each(['justifyleft', 'justifycenter', 'justifyright'], function(i, value){
                    if (store.currContentEditor) {
                        if (store.currContentEditor.queryCommandState(value)) {
                            $('.ke-toolbar-icon-justify' + value).addClass('selected').siblings('.toolbar-icon-justify').removeClass('selected');
                        }
                    }
                });
                // 更新文本模型
                if (store.elements[store.currElemId]) {
                store.elements[store.currElemId].text = this.getContent();
                }
            })
            // 当编辑器集合长度小于等于编辑实例uid 则没有添加编辑实例
            // 添加文本编辑器到模型
            // store.contentEditors[this.elemId] = this;
            // // 所有编辑实例移除焦点
            // // _this.setDisabledAll();
            // $.each(store.contentEditors, function(i, contentEditors){
            //     contentEditors.setDisabled();
            // });
            // // 更新当前对象属性
            // _this.updateCurrTools(this.elemId);
        });
    },
    // 实例化拖拽类
    initDragEvent: function(){
        var _this = this;
        this.draggleable = new uiDraggable(this.elem, {
            pageView: '.main-preview',
            onDragStart: function(draggable, elem){
                // 其余编辑实例移除焦点
                _this.setDisabledAll();
                // 更新当前对象属性
                _this.updateCurrTools(elem.attr('id'));
                // 更新文本编辑器正在编辑状态
                store.contentEditorState = false;
                $('.text-tool-icon').removeClass('selected').addClass('disabled');
                // 添加拖拽框
                $('#' + store.currElemId).addClass('active').siblings().removeClass('active');
                // 显示右侧表单栏
                $('.aside-options-font').show().siblings().hide();
                // 更新表单视图
                $('.set-text-left').val(parseInt(draggable.offsetX));
                $('.set-text-top').val(parseInt(draggable.offsetY));
                $('.set-text-width').val(parseInt(draggable.width));
                $('.set-text-height').val(parseInt(draggable.height));
                // 隐藏右键菜单
                contextmenu.hide();
            },
            onDragMove: function(draggable){
                // 更新表单视图
                $('.set-text-left').val(parseInt(draggable.offsetX));
                $('.set-text-top').val(parseInt(draggable.offsetY));
            },
            onDragEnd: function(draggable){
                var id = store.currElemId;
                var style = store.elements[id].style;
                // 缓存上一个状态
                var oldValue = { id: id, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
                // 缓存当前状态
                var newValue = { id: id, offsetX: draggable.offsetX, offsetY: draggable.offsetY, width: draggable.width, height: draggable.height };
                // 添加历史记录
                // 回调为更新当前对象属性
                vm.execute({
                    undo: vm.move.bind(_this.draggleable, oldValue, function(){ _this.updateCurrTools(id); }),
                    execute: vm.move.bind(_this.draggleable, newValue, function(){ _this.updateCurrTools(id); }),
                    title: '移动文本元素', 
                });
                // 更新模型
                store.elements[store.currElemId].style.left = draggable.offsetX;
                store.elements[store.currElemId].style.top = draggable.offsetY;
                store.elements[store.currElemId].style.width = draggable.width;
                store.elements[store.currElemId].style.height = draggable.height;
            }
        });
        // 添加拖拽类到模型
        store.draggables[this.elemId] = this.draggleable;
    },
    // 实例化缩放类
    initResizeEvent: function(){
        var _this = this;
        this.resizable = new uiResizable({
            resizable: $('#' + this.elemId + ' .ui-resizable'),
            pageView: '.main-preview',
            onResizeStart: function(resizable, elem){
                // 其余编辑实例移除焦点
                _this.setDisabledAll();
                // 更新当前对象属性
                _this.updateCurrTools(elem.attr('id'));
                // 更新文本编辑器正在编辑状态
                store.contentEditorState = false;
                $('.text-tool-icon').removeClass('selected').addClass('disabled');
                // 添加拖拽框
                $('#' + store.currElemId).addClass('active').siblings().removeClass('active');
                // 显示右侧表单栏
                $('.aside-options-font').show().siblings().hide();
                // 更新当前选中元素id
                store.currElemId = _this.elemId;
                // 激活拖拽状态
                _this.draggleable.activate = true;
                // 更新表单视图
                $('.set-text-left').val(parseInt(resizable.left));
                $('.set-text-top').val(parseInt(resizable.top));
                $('.set-text-width').val(parseInt(resizable.width));
                $('.set-text-height').val(parseInt(resizable.height));
            },
            onResizeMove: function(resizable){
                // 更新文本编辑器宽高
                _this.editor.setWidth(resizable.width);
                _this.editor.setHeight(resizable.height);
                // 更新表单视图
                $('.set-text-left').val(parseInt(resizable.left));
                $('.set-text-top').val(parseInt(resizable.top));
                $('.set-text-width').val(parseInt(resizable.width));
                $('.set-text-height').val(parseInt(resizable.height));
            },
            onResizeEnd: function(resizable){
                var id = store.currElemId;
                var style = store.elements[id].style;
                // 缓存上一个状态
                var oldValue = { id: id, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
                // 缓存当前状态
                var newValue = { id: id, offsetX: resizable.left, offsetY: resizable.top, width: resizable.width, height: resizable.height };
                // 添加历史记录
                // 回调为更新当前对象属性
                vm.execute({
                    undo: vm.move.bind(_this.resizable, oldValue, function(){ _this.updateCurrTools(id); }),
                    execute: vm.move.bind(_this.resizable, newValue, function(){ _this.updateCurrTools(id); }),
                    title: '缩放文本元素', 
                });
                // 更新模型
                store.elements[store.currElemId].style.left = resizable.left;
                store.elements[store.currElemId].style.top = resizable.top;
                store.elements[store.currElemId].style.width = resizable.width;
                store.elements[store.currElemId].style.height = resizable.height;
            }
        });
    },
    // 更新元素id，编辑工具，本实例文本编辑器类，当前选中文本编辑器
    updateCurrTools: function(id){
        // 更新作用域内元素id
        this.elemId = id;
        // 更新作用域内元素
        this.elem = $('#' + this.elemId);
        // 更新当前文本编辑器类
        // this.editor = store.contentEditors[this.elemId];
        this.editor = UM.getEditor(this.elemId + '_txteditor');
        // 更新当前选中文本编辑器
        store.currContentEditor = this.editor;
        // 更新当前选中元素id
        store.currElemId = id;
        // 添加拖拽框
        this.elem.addClass('active').siblings().removeClass('active');
        // 页面背景去除active状态
        $('.main-preview-wrapper, .main-toolbar-body-icon').removeClass('active');
        // 更新当前选中编辑工具
        store.currEditTool = 'text';
        // 显示右侧表单栏
        $('.aside-options-font').show().siblings().hide();
        // 图层列表选中当前项
        layerComponent.active(id);
    },
    /**
     * 删除本元素
     * 清除模型
     * 清除预览视图
     */
    delSelectedElem: function(id){
        UM.getEditor(this.elemId + '_txteditor').destroy();
        // UE.delEditor(this.elemId + '_txteditor')
        // 更新当前文本编辑器类
        delete store.contentEditors[id];
        // 更新拖拽集合数组
        delete store.draggables[id];
        // store.draggables.splice(editIndex, 1);
        // 删除模型内元素
        delete store.elements[id];
        // 删除预览视图
        $('#' + id).remove();
        // 更新当前选中文本编辑器
        store.currContentEditor = null;
        // 更新当前选中元素id
        store.currElemId = null;
        // 更新当前选中编辑工具
        store.currEditTool = null;
        // 更新作用域内元素id
        this.elemId = null;
        // 更新作用域内元素
        this.elem = null;
        this.editor = null;
        // 显示右侧表单栏
        $('.aside-options-page').show().siblings().hide();
        // 删除图层
        layerComponent.delete(id);
    },
    /**
     * 添加高亮状态
     * 显示右侧表单栏
     * 更新当前选中元素id
     * 更新为可编辑状态
     */
    textElemDblclickHandler: function(context){
        // 更新当前对象属性
        this.updateCurrTools(context.id);
        $('.text-tool-icon').removeClass('disabled');
        // 激活拖拽状态
        $(context).addClass('active').siblings().removeClass('active');
        // 显示右侧表单栏
        $('.aside-options-font').show().siblings().hide();
        // // 其余编辑实例移除焦点
        // $.each(store.contentEditors, function(i, contentEditors){
        //     contentEditors.setHide();
        // });
        // // 当前编辑实例获取焦点
        // this.editor.setShow();
        // 更新文本编辑器正在编辑状态
        this.editor.setEnabled();
        // this.editor._isEnabled = true;
        store.contentEditorState = true;
        // var range = UM.getEditor(this.elemId + '_txteditor').selection.getRange();
        // range.select();
        this.editor.execCommand('selectall');
        $('#' + this.editor.id).removeClass('disabled');
        // 禁止拖拽状态
        $.each(store.draggables, function(i, draggable){
            draggable.activate = false;
        });
    },
    deleteHandler: function(id){
        var _this = this;
        var element = {};
        // 深度拷贝容器元素模型 防止删除后找不到对象
        $.extend(true, element, store.elements[_this.elemId]);
        // 添加历史记录
        vm.execute({
            undo: _this.getText.bind(_this, element, element.text),
            execute: _this.delSelectedElem.bind(_this, element.id), 
            title: '删除文本元素', 
        });
        // 删除本元素
        _this.delSelectedElem(id);
    },
    /**
     * 显示右键菜单
     * 菜单列表监听点击事件
     */
    textContextMenu: function(e, self){
        var _this = this;
        contextmenu.show(e, 'text');
        // 触发删除操作
        $('#contextmenu-text .contextmenu-del').unbind('mousedown').bind('mousedown', function(e){ 
            e.stopPropagation();
            _this.deleteHandler(self.id);
            // 隐藏右键菜单
            contextmenu.hide();
        });
    },
    /**
     * 设置文本编辑器不可编辑
     */
    setDisabledAll: function(e, self){
        var _this = this;
        // if (store.currContentEditor) {
        //     // 获取当前文本编辑实例
        //     var currEditor = store.currContentEditor;
        //     // 如果编辑的值有变化
        //     if (currEditor.localHtml != currEditor.body.innerHTML) {
        //         // 添加历史记录
        //         vm.execute({
        //             undo: this.changeTxtEdit.bind(this, currEditor, currEditor.localHtml),
        //             execute: this.changeTxtEdit.bind(this, currEditor, currEditor.body.innerHTML),
        //             title: '编辑文本', 
        //         });
        //     }
        //     // 文本编辑器移除编辑状态
        //     $.each(store.contentEditors, function(i, editor){
        //         editor.setHide();
        //     });
        // }
        // 文本编辑器移除编辑状态
        $.each(store.contentEditors, function(i, editor){
            editor.setDisabled();  //设置不可编辑
            // editor._isEnabled = false;  //可编辑状态标识为（不可编辑）
            $('#' + editor.id).addClass('disabled');
        });
    },
    // 改变文本编辑器中值
    // changeTxtEdit: function(_editor, value){
    //     _editor.body.innerHTML = value;
    //     $(_editor.container).siblings('.editor-showTxt').html(value);
    //     // 更新元素id，编辑工具，本实例文本编辑器类，当前选中文本编辑器
    //     this.updateCurrTools(_editor.elemId);
    //     // 更新当前编辑实例为当前编辑文本
    //     store.currContentEditor = _editor;
    // }
};

module.exports = textAdapter;