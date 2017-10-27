var defaultStore = require('../../store/defaultData'); 
var store = require('../../store/dataSet'); 
var uiDraggable = require('../../utils/ui-draggable');
var uiResizable = require('../../utils/ui-resizable');
var domView = require('../../view/preview/imageView.hbs');
var imageFormCtrls = require('../form/imageCtrls');
var vm = require('../common/vm');
var Cache = require('../common/cache');
var gallery = require('../common/gallery');
var contextmenu = require('../../utils/contextmenu');
var layerComponent = require('../common/layer.ctrls');

var imageObj = {};

function checkSize(file) {
    if (file.size > 2 * 1024 * 1024) {
        alert('请上传小于2MB的图片');
        return false;
    } else {
        return true;
    }
}

function checkType(file) {
    if (!/jpeg|jpg|png|bmp|gif/gi.test(file.type)) {
        alert('请上传jpg,png,bmp,gif类型图片');
        return false;
    } else {
        return true;
    }
}

function addHistory(_this){
    var element = {};
    // 深度拷贝容器元素模型 防止删除后找不到对象
    $.extend(true, element, store.elements[_this.elemId]);
    // 添加历史记录
    vm.execute({
        undo: _this.delSelectedElem.bind(_this, element.id),
        execute: _this.getImage.bind(_this, element), 
        title: '新建图片元素', 
    });
}

// 构造函数
var imageAdapter = function(){
    this.elemId = null;
    this.elem = null;
    this.draggleable = null;
    this.resizable = null;
    this.init();
};

imageAdapter.prototype = {
    init: function(){
        var _this = this;
        // 图片按钮监听点击事件
        $('.main-toolbar-image-icon').unbind('click').bind('click', function(e){ e.stopPropagation(); });
        $('.main-toolbar-image-menu .main-toolbar-menu-item').unbind('mousedown').bind('mousedown', function(e){ e.stopPropagation(); });
        $('.main-toolbar-menu-upload').unbind('change').bind('change', function(e){ _this.uploadBgHandler(this); }); //上传
        $('.main-toolbar-menu-gallery').unbind('click').bind('click', function(e){ _this.selectLibHandler(); }); //图库
        $('.main-toolbar-menu-mypic').unbind('click').bind('click', function(e){ _this.selectMypicHandler(); }); //我的图片
        // 实例化表单项change操作
        _this.formCtrls = new imageFormCtrls();
        vm.updateFormCtrls.image = _this.formCtrls.updateFormView;
    },
    getImage: function(data){
        var _this = this;
        // 创建图片唯一模型
        this.createImageModel(data);
        // 创建图片dom元素
        this.createImageDom();
        // 更新元素所有样式
        vm.updatePreviewStyle();
        // dom元素实例化拖拽事件
        this.initDragEvent();
        // dom元素实例化缩放事件
        this.initResizeEvent();
        // 监听右键菜单事件
        this.elem.unbind('contextmenu').bind('contextmenu', function(e){ e.stopPropagation(); _this.imageContextMenu(e, this); return false; });
        // 更新图片所有表单视图
        _this.formCtrls.updateFormView();
        // 创建图层
        layerComponent.insert('图像', store.elements[this.elemId], this.updateCurrTools);
    },
    // 创建图片唯一模型
    createImageModel: function(data){
        if (data) {
            // 获取id
            this.elemId = data.id;
            // 图片模型指向缓存的数据对象
            store.elements[this.elemId] = data;
        } else {
            // 获取id
            this.elemId = 'med_image_' + (+new Date());
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
            $.extend(true, store.elements[this.elemId], defaultStore.image);
            console.info(imageObj.width > store.preview.width);
            if (imageObj.width > store.preview.width) {
                var scale = imageObj.width / imageObj.height;
                imageObj.width = store.preview.width;
                imageObj.height = parseInt(store.preview.width / scale);
            }
            store.elements[this.elemId].src = imageObj.src;
            store.elements[this.elemId].style.width = imageObj.width;
            store.elements[this.elemId].style.height = imageObj.height;
            console.info(store.elements[this.elemId]);
        }
    },
    // 创建图片dom元素
    createImageDom: function(){
        var _this = this;
        if (!$('#' + this.elemId).length) {
            var imageElem, scrollTop = $('.main-preview-box').scrollTop();
            // 预览视口滚动过
            if (scrollTop != 0) {
                store.elements[this.elemId].style.top = scrollTop;
            }
            imageElem = domView(store.elements[this.elemId]);
            // 预览窗口创建dom元素生成唯一id  添加历史记录
            $('.main-preview').append(imageElem);
        }
        // 更新当前对象属性;
        _this.updateCurrTools(this.elemId);
    },
    galleryItemHandler: function(){
        var _this = this;
        // 点击图库弹窗的图片操作
        $('.gallery-item').unbind('click').bind('click', function(){
            // 隐藏弹窗
            gallery.hide();
            imageObj = {
                src: $(this).attr('data-src'), 
                width: Number($(this).attr('data-width')), 
                height: Number($(this).attr('data-height'))
            };
            // 创建图片元素
            _this.getImage();
            // 添加历史记录
            addHistory(_this);
        });
    },
    selectLibHandler: function(){
        var imgList = Cache.get('edit_m_img');
        gallery.show('图片库', imgList);
        this.galleryItemHandler();
    },
    selectMypicHandler: function(){
        var imgList = Cache.get('edit_m_img');
        gallery.show('我的图片', imgList);
        this.galleryItemHandler();
    },
    // 上传图片处理
    uploadBgHandler: function(input){
        var _this = this,
            formData = new FormData(),
            file = input.files[0];

        // 检测图片类型
        if (!checkType(file)) return;
        // 检测图片大小
        if (!checkSize(file)) return;
        // 添加表单项
        formData.append('container_bg', file);
        // 显示loading层
        $('.loading-window').show();
        // 上传至服务器操作
        $.ajax({
            url: '/m/uploadImg',
            type: 'POST',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(res){
                imageObj = {src: res.path, width: res.width, height: res.height};
                // 移除loading层
                $('.loading-window').fadeOut();
                // 存储至本地缓存
                Cache.add('edit_m_img', imageObj);
                // 创建图片元素
                _this.getImage();
                // 添加历史记录
                addHistory(_this);
            },
            error: function(){
                alert('上传图片失败');
                // 移除loading层
                $('.loading-window').fadeOut();
            }
        });
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
                $('.set-image-left').val(parseInt(draggable.offsetX));
                $('.set-image-top').val(parseInt(draggable.offsetY));
                $('.set-image-width').val(parseInt(draggable.width));
                $('.set-image-height').val(parseInt(draggable.height));
                // 更新容器所有表单视图
                _this.formCtrls.updateFormView();
                // 隐藏右键菜单
                contextmenu.hide();
            },
            onDragMove: function(draggable){
                // 更新表单视图
                $('.set-image-left').val(parseInt(draggable.offsetX));
                $('.set-image-top').val(parseInt(draggable.offsetY));
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
                    title: '移动图片元素', 
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
                $('.set-image-left').val(parseInt(resizable.left));
                $('.set-image-top').val(parseInt(resizable.top));
                $('.set-image-width').val(parseInt(resizable.width));
                $('.set-image-height').val(parseInt(resizable.height));
                // 更新容器所有表单视图
                _this.formCtrls.updateFormView();
            },
            onResizeMove: function(resizable){
                // 更新表单视图
                $('.set-image-left').val(parseInt(resizable.left));
                $('.set-image-top').val(parseInt(resizable.top));
                $('.set-image-width').val(parseInt(resizable.width));
                $('.set-image-height').val(parseInt(resizable.height));
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
                    title: '缩放图片元素', 
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
        store.currEditTool = 'image';
        // 页面背景去除active状态
        $('.main-preview-wrapper, .main-toolbar-body-icon').removeClass('active');
        // 添加拖拽框
        this.elem.addClass('active').siblings().removeClass('active');
        // 显示右侧表单栏
        $('.aside-options-image').show().siblings().hide();
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
            undo: _this.getImage.bind(_this, element),
            execute: _this.delSelectedElem.bind(_this, element.id), 
            title: '删除图片元素', 
        });
        // 删除本元素
        _this.delSelectedElem(id);
    },
    // 右键菜单事件
    imageContextMenu: function(e, self){
        var _this = this;
        contextmenu.show(e, 'view');
        // 触发删除操作
        $('#contextmenu-view .contextmenu-del').unbind('mousedown').bind('mousedown', function(e){ 
            e.stopPropagation();
            _this.deleteHandler(self.id);
            // 隐藏右键菜单
            contextmenu.hide();
        });
    }
};

module.exports = imageAdapter;