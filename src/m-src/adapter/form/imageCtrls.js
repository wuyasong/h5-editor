var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');
var Cache = require('../common/cache');
var gallery = require('../common/gallery');


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

// 圆角设置按钮按下时操作
function bindBorderRadiusEvent(e, self, imageCtrls){
    self.initborderRadius = store.elements[store.currElemId].style.borderRadius;
    self.dx = e.pageX;
    self.initLeft = self.offsetLeft;
    $(document).unbind('mousemove').bind('mousemove', function(e){ imageCtrls.borderRadiusChangeHandler(e, self) });
    $(document).unbind('mouseup').bind('mouseup', imageCtrls.borderRadiusSetHandler.bind(imageCtrls, self));
}

function updateBorderRadius(id, value, borderRadius){
    vm.updateCurrTools(id, 'image');
    // 更改表单项圆角视图
    $('.set-image-borderRadius').css('left', value + 'px');
    $('.set-image-borderRadius-desc').html(borderRadius + 'px');
    // 更新预览视图模型
    vm.setPreViewModel('borderRadius', borderRadius);
}

function bindOpacityEvent(e, self, imageCtrls){
    self.initOpacity = store.elements[store.currElemId].style.opacity;
    self.dx = e.pageX;
    self.initLeft = self.offsetLeft;
    $(document).unbind('mousemove').bind('mousemove', function(e){ imageCtrls.OpacityChangeHandler(e, self) });
    $(document).unbind('mouseup').bind('mouseup', imageCtrls.OpacitySetHandler.bind(imageCtrls, self));
}

function updateOpacity(id, value, opacity){
    vm.updateCurrTools(id, 'image');
    // 更改表单项圆角视图
    $('.set-image-opacity').css('left', value + 'px');
    $('.set-image-opacity-desc').html(parseInt(opacity * 100) + '%');
    // 更新预览视图模型
    vm.setPreViewModel('opacity', opacity);
}

function setImageSrc(id, src){
    vm.updateCurrTools(id, 'image');
    // 更新预览视图模型
    if (src) {
        $('.set-image-preview').css('backgroundImage', 'url(' + src + ')');
        $('#' + store.currElemId).children('.drag-ele').children('img').attr('src', src);
    } else {
        $('.set-image-preview').css('backgroundImage', '');
        $('#' + store.currElemId).children('.drag-ele').children('img').attr('src', '');
    }
    store.elements[store.currElemId].src = src;
}

var imageCtrls = function(){
    this.init();
};

imageCtrls.prototype = {
    init: function(){
        var _this = this;
        $('.set-image-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-image-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-image-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-image-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-image-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-image-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        // 层级设置
        $('.set-image-zIndex').unbind('keyup').bind('keyup', function(){ _this.zIndexChangeHandler(this.value) });
        $('.set-image-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.set-image-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        // 圆角设置
        $('.set-image-borderRadius').unbind('mousedown').bind('mousedown', function(e){ bindBorderRadiusEvent(e, this, _this); });
        // 链接设置
        $('.set-image-link').unbind('keyup').bind('keyup', this.linkChangeHandler);
        // 透明度设置
        $('.set-image-opacity').unbind('mousedown').bind('mousedown', function (e) { bindOpacityEvent(e, this, _this); });
        // 替换-上传图片
        $('.replace-image-upload').unbind('change').bind('change', function(){ _this.uploadBgHandler(this); });
        // 替换-图库按钮点击
        $('.replace-image-gallery').unbind('click').bind('click', this.selectLibHandler.bind(this));
        // 替换-我的图片按钮点击
        $('.replace-image-mypic').unbind('click').bind('click', this.selectMypicHandler.bind(this));
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
            undo: vm.move.bind(_this, oldValue, function () { try { vm.updateCurrTools(id, 'image'); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { vm.updateCurrTools(id, 'image'); } catch(ex){} }), 
            title: '移动图片元素', 
        });
    },
    zIndexChangeHandler: function(value, callback){
        callback ? callback() : void 0;
        if (!store.currElemId) return;
        var id = store.currElemId;
        if (!callback) {
            // 添加历史记录
            vm.execute({
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'image'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'image'); } catch(ex){} }), 
                title: '修改图片层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-image-zIndex');
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
        var elem = $('.set-image-zIndex');
        var value = parseInt(elem[0].value);
        value = value - 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    borderRadiusChangeHandler: function(e, self){
        if (!store.currElemId) return;
        var dx = e.pageX - self.dx + self.initLeft;
        var totalWidth = $(self).parent().width() - $(self).width();
        dx = dx < 0 ? 0 : dx;
        dx = dx > totalWidth ? totalWidth : dx;
        // 转换为百分比
        var persent = dx / totalWidth;
        // 当前容器半径*百分比
        var borderRadius = parseInt(store.elements[store.currElemId].style.width / 2 * persent);
        // 更改表单项圆角视图
        $(self).css('left', dx + 'px');
        $('.set-image-borderRadius-desc').html(borderRadius + 'px');
        // 更新预览视图模型
        vm.setPreViewModel('borderRadius', borderRadius);
    },
    borderRadiusSetHandler: function(self){
        $(document).off('mousemove').off('mouseup');
        var id = store.currElemId;
        // 添加历史记录
        vm.execute({
            undo: updateBorderRadius.bind(this, id, self.initLeft, self.initborderRadius),
            execute: updateBorderRadius.bind(this, id, self.offsetLeft, store.elements[store.currElemId].style.borderRadius), 
            title: '修改图片圆角', 
        });
    },
    OpacityChangeHandler: function(e, self){
        if (!store.currElemId) return;
        var dx = e.pageX - self.dx + self.initLeft;
        var totalWidth = $(self).parent().width() - $(self).width();
        dx = dx < 0 ? 0 : dx;
        dx = dx > totalWidth ? totalWidth : dx;
        // 当前容器透明度
        var opacity = dx / totalWidth;
        // 更改表单项圆角视图
        $(self).css('left', dx + 'px');
        $('.set-image-opacity-desc').html(parseInt(opacity * 100) + '%');
        // 更新预览视图模型
        vm.setPreViewModel('opacity', opacity);
    },
    OpacitySetHandler: function(self){
        $(document).off('mousemove').off('mouseup');
        var id = store.currElemId;
        // 添加历史记录
        vm.execute({
            undo: updateOpacity.bind(this, id, self.initLeft, self.initOpacity),
            execute: updateOpacity.bind(this, id, self.offsetLeft, store.elements[store.currElemId].style.opacity), 
            title: '修改图片透明度', 
        });
    },
    linkChangeHandler: function(){
        // 更新模型
        if (store.currElemId) {
            store.elements[store.currElemId].link = this.value;
        }
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
                var oldValue = store.elements[store.currElemId].src;
                var newValue = res.path;
                img.src = res.path;
                img.width = res.width;
                img.height = res.height;
                // 替换图片
                setImageSrc(id, res.path);
                // 移除loading层
                $('.loading-window').hide();
                // 存储至本地缓存
                Cache.add('edit_m_img', img);
                // 添加历史记录
                vm.execute({
                    undo: setImageSrc.bind(_this, id, oldValue),
                    execute: setImageSrc.bind(_this, id, newValue), 
                    title: '替换图片', 
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
            var oldValue = store.elements[store.currElemId].src;
            var newValue = $(this).attr('data-src');
            // 隐藏弹窗
            gallery.hide();
            // 设置容器预览窗背景更新模型
            setImageSrc(id, $(this).attr('data-src'));
            // 添加历史记录
            vm.execute({
                undo: setImageSrc.bind(_this, id, oldValue),
                execute: setImageSrc.bind(_this, id, newValue), 
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
    updateFormView: function(){
        var currElem = store.elements[store.currElemId];
        var scrollbarWidth = $('.set-image-borderRadius').parent().width() - $('.set-image-borderRadius').width();
        // 更新图片位置尺寸
        $('.set-image-left').val(currElem.style.left);
        $('.set-image-top').val(currElem.style.top);
        $('.set-image-width').val(currElem.style.width);
        $('.set-image-height').val(currElem.style.height);
        // 更新图片预览
        currElem.src ? 
        $('.set-image-preview').css('backgroundImage', 'url(' + currElem.src + ')') :
        $('.set-image-preview').css('backgroundImage', '');
        // 层级
        $('.set-image-zIndex').val(currElem.style.zIndex);
        // 圆角 borderRadius
        var borderRadiusOffset = currElem.style.borderRadius / (currElem.style.width / 2) * scrollbarWidth;
        $('.set-image-borderRadius').css('left', borderRadiusOffset + 'px');
        $('.set-image-borderRadius-desc').html(currElem.style.borderRadius + 'px');
        // 透明度
        var opacityOffset = currElem.style.opacity * scrollbarWidth;
        $('.set-image-opacity').css('left', opacityOffset + 'px');
        $('.set-image-opacity-desc').html(parseInt(currElem.style.opacity * 100) + '%');
        // 链接
        var link = currElem.link ? currElem.link : '';
        $('.set-image-link').val(link);
        // 更新method列表
        $('.set-native .set-native-selected').html(currElem.native.name ? defaultStore.native[currElem.native.name].name : '选择应用');
        $('.set-native-method .set-native-method-selected').html(currElem.native.method ? defaultStore.native[currElem.native.name].method[currElem.native.method] : '选择功能');
        $('.set-native-param .set-native-param-input').val(currElem.native.id ? currElem.native.id : '');
    }
};

module.exports = imageCtrls;