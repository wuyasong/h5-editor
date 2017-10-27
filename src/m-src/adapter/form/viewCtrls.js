var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');
var Cache = require('../common/cache');
var gallery = require('../common/gallery');

var viewCtrls = function(){
    this.init();
}

var initColor = defaultStore.view.style.backgroundColor;
var $scrollbarCurr = $('.container-border-radius');
var scrollbarWidth = $scrollbarCurr.parent().width() - $scrollbarCurr.width();

// 获取当前边框属性
function getBorderAttrs(){
    return {
        borderWidth: store.elements[store.currElemId].style['borderWidth'],
        borderStyle: store.elements[store.currElemId].style['borderStyle'],
        borderColor: store.elements[store.currElemId].style['borderColor']
    };
}

function opacityChange(id, value, opacity){
    vm.updateCurrTools(id, 'view');
    // 更改表单项圆角视图
    $('.container-opacity').css('left', value + 'px');
    $('.container-opacity-desc').html(parseInt(opacity * 100) + '%');
    // 更新预览视图模型
    vm.setPreViewModel('opacity', opacity);
}

function borderRadiusChange(id, value, borderRadius){
    vm.updateCurrTools(id, 'view');
    // 更改表单项圆角视图
    $('.container-border-radius').css('left', value + 'px');
    $('.container-border-radius-desc').html(borderRadius + 'px');
    // 更新预览视图模型
    vm.setPreViewModel('borderRadius', borderRadius);
}

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
// 设置容器预览窗背景更新模型
function setContainerBg(id, src){
    vm.updateCurrTools(id, 'view');
    // 设置容器预览窗背景
    if (src) {
        $('.container-bg-preview').css('backgroundImage', 'url(' + src + ')');
    } else {
        $('.container-bg-preview').css('backgroundImage', '');
    }
    // 更新预览视图模型
    vm.setPreViewModel('backgroundImage', src);
}
// 修改背景对齐属性
function bgPositionChange(id, position){
    vm.updateCurrTools(id, 'view');
    // 更新表单项选中值
    $('.container-bg-position-selected').html(defaultStore.notes.position[position]);
    // 更新预览视图模型
    vm.setPreViewModel('backgroundPosition', position);
}
// 修改背景尺寸属性
function bgSizeChange(id, size){
    vm.updateCurrTools(id, 'view');
    // 更新表单项选中值
    $('.container-bg-size-selected').html(size);
    // 更新预览视图模型
    vm.setPreViewModel('backgroundSize', size);
}

// 隐藏所有下拉列表
function removeSlsectList(){
    $('.container-bg-position-list').hide();
    $('.container-bg-size-list').hide();
}

function backgroundChange(id){
    vm.updateCurrTools(id, 'view');
    $('.container-bg-preview').css('backgroundImage', '');
    // 更新预览视图模型
    vm.setPreViewModel('backgroundImage', '');
}

viewCtrls.prototype = {
    init: function(){
        var that = this;
        // 所有input监听change事件
        $('.set-view-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-view-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-view-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-view-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-view-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-view-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        setTimeout(function () {
            // $('.colorpicker').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
            $('.container-bg-position').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
            $('.container-bg-size').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
        }, 500);
        // $('#view-bgColor').ColorPicker({ 
        //     color: defaultStore.view.style.backgroundColor, 
        //     onSelect: function(hsb, hex, rgb){ that.bgcolorSelectHandler(hsb, hex, rgb); }, 
        //     onChange: this.bgcolorChangeHandler,
        //     onShow: function(hsb, hex, rgb){ 
        //         initColor = store.elements[store.currElemId].style.backgroundColor;
        //     }
        // });
        // console.info(defaultStore.view.style.backgroundColor.substring(1))
        $('#view-bgColor').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: defaultStore.view.style.backgroundColor }) } }, this.bgcolorChangeHandler, this.bgcolorChangeHandler, this.bgcolorChangeHandler);
        $('#container-border .switch-btn').unbind('click').bind('click', this.borderChangeHandler);
        // $('.container-options-border-color').ColorPicker({ color: defaultStore.view.style.backgroundColor, onChange: this.bordercolorChangeHandler });
        $('.border-options-color').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: defaultStore.view.style.backgroundColor }) } }, this.bordercolorChangeHandler, this.bordercolorChangeHandler, this.bordercolorChangeHandler);
        $('.container-options-border-width').unbind('keyup').bind('keyup', this.borderwidthChangeHandler);
        $('.container-options-border-type').unbind('click').bind('click', this.bordertypeChangeHandler);
        $('.container-zIndex').unbind('keyup').bind('keyup', function(){ that.zIndexChangeHandler(this.value) });
        $('.container-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.container-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        $('.container-border-radius').unbind('mousedown').bind('mousedown', function (e) {
            var _this = this;
            this.dx = e.pageX;
            var offsetLeft = this.offsetLeft;
            var initborderRadius = store.elements[store.currElemId].style.borderRadius;
            this.dataLeft = this.offsetLeft;
            $(document).unbind('mousemove').bind('mousemove', function(ev){ that.borderRadiusChangeHandler(ev, _this) });
            $(document).unbind('mouseup').bind('mouseup', function(){
                $(document).off('mousemove').off('mouseup');
                var id = store.currElemId;
                // 添加历史记录
                vm.execute({
                    undo: borderRadiusChange.bind(that, id, offsetLeft, initborderRadius),
                    execute: borderRadiusChange.bind(that, id, _this.offsetLeft, store.elements[store.currElemId].style.borderRadius), 
                    title: '修改容器圆角', 
                });
            });
        });
        $('.container-link-input').unbind('keyup').bind('keyup', this.linkChangeHandler);
        $('.container-opacity').unbind('mousedown').bind('mousedown', function (e) {
            var _this = this;
            var offsetLeft = this.offsetLeft;
            var initOpacity = store.elements[store.currElemId].style.opacity;
            this.dx = e.pageX;
            this.dataLeft = this.offsetLeft;
            $(document).unbind('mousemove').bind('mousemove', function(ev){ that.opacityChangeHandler(ev, _this) });
            $(document).unbind('mouseup').bind('mouseup', function(){
                $(document).off('mousemove').off('mouseup');
                var id = store.currElemId;
                // 添加历史记录
                vm.execute({
                    undo: opacityChange.bind(that, id, offsetLeft, initOpacity),
                    execute: opacityChange.bind(that, id, _this.offsetLeft, store.elements[store.currElemId].style.opacity), 
                    title: '修改容器透明度', 
                });
            });
        });
        // 上传图片
        $('.container-bg-upload').unbind('change').bind('change', function(){ that.uploadBgHandler(this); });
        // 图库按钮点击
        $('.container-bg-gallery').unbind('click').bind('click', this.selectLibHandler.bind(this));
        // 我的图片按钮点击
        $('.container-bg-mypic').unbind('click').bind('click', this.selectMypicHandler.bind(this));
        // 背景对齐方式菜单点击
        $('.container-bg-position').unbind('click').bind('click', function(){ $('.container-bg-position-list').show(); $('.container-bg-size-list').hide(); });
        // 背景尺寸菜单点击
        $('.container-bg-size').unbind('click').bind('click', function(){ $('.container-bg-position-list').hide(); $('.container-bg-size-list').show(); });
        // 背景尺寸菜单项 点击
        $('.container-bg-position-list li').unbind('click').bind('click', function(e){ e.stopPropagation(); that.bgPositionHandler(this) });
        // 背景尺寸菜单项 点击
        $('.container-bg-size-list li').unbind('click').bind('click', function(e){ e.stopPropagation(); that.bgSizeHandler(this) });
        // 删除背景
        $('.container-bg-delbtn').unbind('click').bind('click', function(e){ e.stopPropagation(); that.delBackgroundHandler() });
    },
    // 大小宽高变化操作
    styleChangeHandler: function(){
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
            newValue.width = value;
        } else if (key === 'height') {
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
            undo: vm.move.bind(_this, oldValue, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }), 
            title: '移动容器元素', 
        });
    },
    // 背景颜色变化操作
    bgcolorChangeHandler: function (color, context) {
        // if (!store.currElemId) return;
        // $('.container-color-selected').html('#' + hex);
        // $('.container-color-icon').css('background', '#' + hex);
        // callback ? callback() : void 0;
        // if (!store.currElemId) return;
        // // 更新预览视图模型
        // vm.setPreViewModel('backgroundColor', '#' + hex);
        var hex = color.val('hex');
        // 更新预览视图模型
        vm.setPreViewModel('backgroundColor', hex ? ('#' + hex) : 'transparent');
    },
    bgcolorSelectHandler: function(hsb, hex, rgb){
        var id = store.currElemId;
        var style = store.elements[store.currElemId].style;
        // 添加历史记录
        vm.execute({
            undo: this.bgcolorChangeHandler.bind(this, null, initColor.substring(1), null, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }),
            execute: this.bgcolorChangeHandler.bind(this, null, hex, null, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }), 
            title: '修改容器背景颜色', 
        });
    },
    // 边框开关操作
    borderChangeHandler: function(){
        if (!store.currElemId) return;
        // 关闭边框属性
        if ($(this).hasClass('on')) {
            $(this).addClass('off').removeClass('on');
            $('.container-border-box').hide();
            // 更新模型
            store.elements[store.currElemId].border = null;
        } 
        // 开启边框属性
        else {
            $(this).addClass('on').removeClass('off');
            $('.container-border-box').show();
            // 更新模型
            store.elements[store.currElemId].border = true;
        }
    },
    // 边框颜色变化操作
    bordercolorChangeHandler: function(color, context){
        if (!store.currElemId) return;
        // 更新表单视图
        // $('.container-options-border-color').html('#' + hex);
        // $('.container-border-color-icon').css('background', '#' + hex);
        // // 更新模型
        // store.elements[store.currElemId].style.borderColor = '#' + hex;
        // // 更新预览视图
        // $('#' + store.currElemId).children('.drag-ele').css('border', getBorderAttrs().borderWidth + 'px ' + getBorderAttrs().borderStyle + ' ' + getBorderAttrs().borderColor);
        var hex = color.val('hex');
        // 更新模型
        store.elements[store.currElemId].style.borderColor = hex ? ('#' + hex) : 'transparent';
        // 更新预览视图
        $('#' + store.currElemId).children('.drag-ele').css('border', getBorderAttrs().borderWidth + 'px ' + getBorderAttrs().borderStyle + ' ' + getBorderAttrs().borderColor);
    },
    // 边框宽度变化操作
    borderwidthChangeHandler: function(){
        if (!store.currElemId) return;
        // 更新模型
        store.elements[store.currElemId].style.borderWidth = parseInt(this.value);
        // 更新预览视图
        $('#' + store.currElemId).children('.drag-ele').css('border', getBorderAttrs().borderWidth + 'px ' + getBorderAttrs().borderStyle + ' ' + getBorderAttrs().borderColor);
    },
    // 边框类型变化操作
    bordertypeChangeHandler: function(){
        if (!store.currElemId) return;
        $(this).addClass('current').siblings().removeClass('current');
        // 更新模型
        store.elements[store.currElemId].style.borderStyle = $(this).attr('data-type');
        // 更新预览视图
        $('#' + store.currElemId).children('.drag-ele').css('border', getBorderAttrs().borderWidth + 'px ' + getBorderAttrs().borderStyle + ' ' + getBorderAttrs().borderColor);
    },
    zIndexChangeHandler: function(value, callback){
        callback ? callback() : void 0;
        if (!store.currElemId) return;
        var id = store.currElemId;
        if (!callback) {
            // 添加历史记录
            vm.execute({
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'view'); } catch(ex){} }), 
                title: '修改容器层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var value = parseInt($('.container-zIndex')[0].value);
        value = value + 1;
        // 更新表单视图
        $('.container-zIndex').val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexReduceHandler: function(){
        if (!store.currElemId) return;
        var value = parseInt($('.container-zIndex')[0].value);
        value = value - 1;
        // 更新表单视图
        $('.container-zIndex').val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    borderRadiusChangeHandler: function(e, self){
        if (!store.currElemId) return;
        var dx = e.pageX - self.dx + self.dataLeft;
        var totalWidth = $(self).parent().width() - $(self).width();
        dx = dx < 0 ? 0 : dx;
        dx = dx > totalWidth ? totalWidth : dx;
        // 转换为百分比
        var persent = dx / totalWidth;
        // 当前容器半径*百分比
        var borderRadius = parseInt(store.elements[store.currElemId].style.width / 2 * persent);
        // 更改表单项圆角视图
        $(self).css('left', dx + 'px');
        $('.container-border-radius-desc').html(borderRadius + 'px');
        // 更新预览视图模型
        vm.setPreViewModel('borderRadius', borderRadius);
    },
    linkChangeHandler: function(){
        // 更新模型
        if (store.currElemId) {
            store.elements[store.currElemId].link = this.value;
        }
    },
    opacityChangeHandler: function(e, self){
        if (!store.currElemId) return;
        var dx = e.pageX - self.dx + self.dataLeft;
        var totalWidth = $(self).parent().width() - $(self).width();
        dx = dx < 0 ? 0 : dx;
        dx = dx > totalWidth ? totalWidth : dx;
        // 转换为百分比
        var persent = (dx / totalWidth);
        // 当前容器透明度
        var opacity = persent;
        // 更改表单项圆角视图
        $(self).css('left', dx + 'px');
        $('.container-opacity-desc').html(parseInt(opacity * 100) + '%');
        // 更新预览视图模型
        vm.setPreViewModel('opacity', opacity);
    },
    // 上传图片处理
    uploadBgHandler: function(input){
        var _this = this,
            formData = new FormData(),
            file = input.files[0],
            img = {};

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
                var id = store.currElemId;
                var oldValue = store.elements[store.currElemId].style.backgroundImage;
                var newValue = res.path;
                img.src = res.path;
                img.width = res.width;
                img.height = res.height;
                // 设置容器预览窗背景更新模型
                setContainerBg(id, res.path);
                // 移除loading层
                $('.loading-window').hide();
                // 存储至本地缓存
                Cache.add('edit_m_img', img);
                // 添加历史记录
                vm.execute({
                    undo: setContainerBg.bind(_this, id, oldValue),
                    execute: setContainerBg.bind(_this, id, newValue), 
                    title: '修改容器背景图片', 
                });
            },
            error: function(){
                alert('上传图片失败');
                // 移除loading层
                $('.loading-window').hide();
            }
        });
    },
    galleryItemHandler: function(){
        var _this = this;
        // 点击图库弹窗的图片操作
        $('.gallery-item').unbind('click').bind('click', function(){
            var id = store.currElemId;
            var oldValue = store.elements[store.currElemId].style.backgroundImage;
            var newValue = $(this).attr('data-src');
            // 隐藏弹窗
            gallery.hide();
            // 设置容器预览窗背景更新模型
            setContainerBg(id, $(this).attr('data-src'));
            // 添加历史记录
            vm.execute({
                undo: setContainerBg.bind(_this, id, oldValue),
                execute: setContainerBg.bind(_this, id, newValue), 
                title: '修改容器背景图片', 
            });
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
    bgPositionHandler: function(self){
        var id = store.currElemId;
        var oldValue = store.elements[store.currElemId].style.backgroundPosition;
        var newValue = $(self).attr('data-position');
        // 隐藏下拉列表
        removeSlsectList();
        // 更新背景对齐属性视图模型
        bgPositionChange(id, $(self).attr('data-position'));
        // 添加历史记录
        vm.execute({
            undo: bgPositionChange.bind(this, id, oldValue),
            execute: bgPositionChange.bind(this, id, newValue), 
            title: '修改容器背景对齐方式', 
        });
    },
    bgSizeHandler: function(self){
        var id = store.currElemId;
        var oldValue = store.elements[store.currElemId].style.backgroundSize;
        var newValue = $(self).attr('data-size');
        // 隐藏下拉列表
        removeSlsectList();
        // 更新背景尺寸属性视图模型
        bgSizeChange(id, $(self).attr('data-size'));
        // 添加历史记录
        vm.execute({
            undo: bgSizeChange.bind(this, id, oldValue),
            execute: bgSizeChange.bind(this, id, newValue), 
            title: '修改容器背景尺寸', 
        });
    },
    // 删除背景操作
    delBackgroundHandler: function(){
        var id = store.currElemId;
        var src = store.elements[store.currElemId].style.backgroundImage;
        // 更新表单项及模型视图
        backgroundChange(id);
        // 添加历史记录
        vm.execute({
            undo: setContainerBg.bind(this, id, src),
            execute: backgroundChange.bind(this, id), 
            title: '删除容器背景', 
        });
    },
    // 更新所有容器表单视图
    updateContainerView: function(){
        var currElem = store.elements[store.currElemId];
        // 更新图片位置尺寸
        $('.set-view-left').val(currElem.style.left);
        $('.set-view-top').val(currElem.style.top);
        $('.set-view-width').val(currElem.style.width);
        $('.set-view-height').val(currElem.style.height);

        $('.container-color-selected').html(currElem.style.backgroundColor);
        $('.container-color-icon').css('background', currElem.style.backgroundColor);
        // 边框
        $('.container-options-border-color').html(currElem.style.borderColor);
        $('.container-border-color-icon').css('background', currElem.style.borderColor);
        $('.container-options-border-width').val(currElem.style.borderWidth + 'px');
        $('.border-options-other .border-options-' + currElem.style.borderStyle).addClass('current').siblings().removeClass('current');
        // 层级
        $('.container-zIndex').val(currElem.style.zIndex);
        // 边框开关
        if (currElem.border) {
            $('.switch-btn').addClass('on').removeClass('off');
            $('.container-border-box').show();
        } else {
            $('.switch-btn').addClass('off').removeClass('on');
            $('.container-border-box').hide();
        }
        var scrollbarWidth = $('.container-border-radius').parent().width() - $('.container-border-radius').width();
        // 圆角 borderRadius
        var borderRadiusOffset = currElem.style.borderRadius / (currElem.style.width / 2) * scrollbarWidth;
        $('.container-border-radius').css('left', borderRadiusOffset + 'px');
        $('.container-border-radius-desc').html(currElem.style.borderRadius + 'px');
        // 链接
        var link = currElem.link ? currElem.link : '';
        $('.container-link-input').val(link);
        // 透明度
        var opacityOffset = currElem.style.opacity * scrollbarWidth;
        $('.container-opacity').css('left', opacityOffset + 'px');
        $('.container-opacity-desc').html(parseInt(currElem.style.opacity * 100) + '%');
        // 背景对齐方式
        $('.container-bg-position-selected').html(defaultStore.notes.position[currElem.style.backgroundPosition]);
        // 背景尺寸
        $('.container-bg-size-selected').html(currElem.style.backgroundSize);
        // 背景预览区
        if (currElem.style.backgroundImage) {
            $('.container-bg-preview').css('backgroundImage', 'url(' + currElem.style.backgroundImage + ')');
        } else {
            $('.container-bg-preview').css('backgroundImage', '');
        }
        // 更新method列表
        $('.set-native .set-native-selected').html(currElem.native.name ? defaultStore.native[currElem.native.name].name : '选择应用');
        $('.set-native-method .set-native-method-selected').html(currElem.native.method ? defaultStore.native[currElem.native.name].method[currElem.native.method] : '选择功能');
        $('.set-native-param .set-native-param-input').val(currElem.native.id ? currElem.native.id : '');
    }
};

module.exports = viewCtrls;