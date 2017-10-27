var defaultStore = require('../../store/defaultData'); 
var store = require('../../store/dataSet'); 
var uiDraggable = require('../../utils/ui-draggable');
var uiResizable = require('../../utils/ui-resizable');
var domView = require('../../view/preview/containerView.hbs');
var viewFormCtrls = require('../form/viewCtrls');
var vm = require('../common/vm');
var contextmenu = require('../../utils/contextmenu');
var layerComponent = require('../common/layer.ctrls');

var viewAdapter = function(){
    this.elemId = null;
    this.elem = null;
    this.draggleable = null;
    this.resizable = null;
    this.init();
};

viewAdapter.prototype = {
    init: function(){
        var _this = this;
        // 容器按钮监听点击事件
        $('.main-toolbar-view-icon').unbind('click').bind('click', function(e){
            e.stopPropagation();
            // 初始化容器元素
            _this.getView();
            var element = {};
            // 深度拷贝文本元素模型 防止删除后找不到对象
            $.extend(true, element, store.elements[_this.elemId]);
            // 添加历史记录(所有同步操作执行完成后再执行历史操作)
            vm.execute({
                undo: _this.delSelectedElem.bind(_this, element.id), 
                execute: _this.getView.bind(_this, element), 
                title: '新建容器元素', 
            });
        });
        // 实例化表单项change操作
        this.formCtrls = new viewFormCtrls();
        vm.updateFormCtrls.view = this.formCtrls.updateContainerView;
    },
    // 初始化容器元素
    getView: function(data){
        var _this = this;
        // 创建容器唯一模型
        this.createViewModel(data);
        // 创建容器dom元素
        this.createViewDom();
        // 更新元素所有样式
        vm.updatePreviewStyle();
        // dom元素实例化拖拽事件
        this.initDragEvent();
        // dom元素实例化缩放事件
        this.initResizeEvent();
        // 监听右键菜单事件
        this.elem.unbind('contextmenu').bind('contextmenu', function(e){ e.stopPropagation(); _this.viewContextMenu(e, this); return false; });
        // 更新容器所有表单视图
        _this.formCtrls.updateContainerView();
        // 创建图层
        layerComponent.insert('容器', store.elements[this.elemId], this.updateCurrTools);
    },
    // 创建容器唯一模型
    createViewModel: function(data){
        if (data) {
            // 获取id
            this.elemId = data.id;
            // 容器模型指向缓存的数据对象
            store.elements[this.elemId] = data;
        } else {
            // 获取id
            this.elemId = 'med_view_' + (+new Date());
            // 创建模型
            store.elements[this.elemId] = {
                id: this.elemId,
                // 与应用通讯协议
                native: {
                    name: null,
                    method: null,
                    id: null
                }
            };
            // 深度拷贝默认文本模型
            $.extend(true, store.elements[this.elemId], defaultStore.view);
        }
    },
    // 创建容器dom元素
    createViewDom: function(){
        var _this = this;
        if (!$('#' + this.elemId).length) {
            var viewElem, scrollTop = $('.main-preview-box').scrollTop();
            // 预览视口滚动过
            if (scrollTop != 0) {
                store.elements[this.elemId].style.top = scrollTop;
            }
            viewElem = domView(store.elements[this.elemId]);
            // 预览窗口创建dom元素生成唯一id  添加历史记录
            $('.main-preview').append(viewElem);
        }
        // 更新当前对象属性;
        _this.updateCurrTools(this.elemId);
    },
    // dom元素实例化拖拽事件
    initDragEvent: function(){
        var _this = this;
        this.draggleable = new uiDraggable(this.elem, {
            pageView: '.main-preview',
            onDragStart: function(draggable, elem){
                // 更新当前对象属性
                _this.updateCurrTools(elem.attr('id'));
                // 更新表单视图
                $('.set-view-left').val(parseInt(draggable.offsetX));
                $('.set-view-top').val(parseInt(draggable.offsetY));
                $('.set-view-width').val(parseInt(draggable.width));
                $('.set-view-height').val(parseInt(draggable.height));
                // 更新容器所有表单视图
                _this.formCtrls.updateContainerView();
                // 隐藏右键菜单
                contextmenu.hide();
            },
            onDragMove: function(draggable){
                // 更新表单视图
                $('.set-view-left').val(parseInt(draggable.offsetX));
                $('.set-view-top').val(parseInt(draggable.offsetY));
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
                    title: '移动容器元素', 
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
    // dom元素实例化缩放事件
    initResizeEvent: function(){
        var _this = this;
        this.resizable = new uiResizable({
            resizable: $('#' + this.elemId + ' .ui-resizable'),
            pageView: '.main-preview',
            onResizeStart: function(resizable, elem){
                // 更新当前对象属性
                _this.updateCurrTools(elem.attr('id'));
                // 激活拖拽状态
                _this.draggleable.activate = true;
                // 更新表单视图
                $('.set-view-left').val(parseInt(resizable.left));
                $('.set-view-top').val(parseInt(resizable.top));
                $('.set-view-width').val(parseInt(resizable.width));
                $('.set-view-height').val(parseInt(resizable.height));
                // 更新容器所有表单视图
                _this.formCtrls.updateContainerView();
            },
            onResizeMove: function(resizable){
                // 更新表单视图
                $('.set-view-left').val(parseInt(resizable.left));
                $('.set-view-top').val(parseInt(resizable.top));
                $('.set-view-width').val(parseInt(resizable.width));
                $('.set-view-height').val(parseInt(resizable.height));
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
                    title: '缩放容器元素', 
                });
                // 更新模型
                store.elements[store.currElemId].style.left = resizable.left;
                store.elements[store.currElemId].style.top = resizable.top;
                store.elements[store.currElemId].style.width = resizable.width;
                store.elements[store.currElemId].style.height = resizable.height;
            }
        });
    },
    // 更新元素id，编辑工具
    updateCurrTools: function(id){
        // 更新作用域内元素id
        this.elemId = id;
        // 更新作用域内元素
        this.elem = $('#' + this.elemId);
        // 更新当前选中元素id
        store.currElemId = id;
        // 更新当前选中编辑工具
        store.currEditTool = 'view';
        // 页面背景去除active状态
        $('.main-preview-wrapper, .main-toolbar-body-icon').removeClass('active');
        // 添加拖拽框
        this.elem.addClass('active').siblings().removeClass('active');
        // 显示右侧表单栏
        $('.aside-options-view').show().siblings().hide();
        // 图层列表选中当前项
        layerComponent.active(id);
    },
    delSelectedElem: function(id){
        // 更新拖拽集合数组
        delete store.draggables[id];
        // 删除模型内元素
        delete store.elements[id];
        // 删除预览视图
        $('#' + id).remove();
        // 更新当前选中元素id
        store.currElemId = null;
        // 更新当前选中编辑工具
        store.currEditTool = null;
        // 更新作用域内元素id
        this.elemId = null;
        // 更新作用域内元素
        this.elem = null;
        // 显示右侧表单栏
        $('.aside-options-page').show().siblings().hide();
        // 删除图层
        layerComponent.delete(id);
    },
    deleteHandler: function(id){
        var _this = this;
        var element = {};
        // 深度拷贝容器元素模型 防止删除后找不到对象
        $.extend(true, element, store.elements[_this.elemId]);
        // 添加历史记录
        vm.execute({
            undo: _this.getView.bind(_this, element),
            execute: _this.delSelectedElem.bind(_this, element.id), 
            title: '删除容器元素', 
        });
        // 删除本元素
        _this.delSelectedElem(id);
    },
    // 删除元素操作
    viewContextMenu: function(e, self){
        var _this = this;
        contextmenu.show(e, 'view');
        // 触发删除操作
        $('#contextmenu-view .contextmenu-del').unbind('mousedown').bind('mousedown', function(e){ 
            e.stopPropagation();
            _this.deleteHandler(self.id);
            // 隐藏右键菜单
            contextmenu.hide();
        });
    },
};

module.exports = viewAdapter;