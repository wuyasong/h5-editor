var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');

var initFontColor = defaultStore.button.style.color;
var initBgColor = defaultStore.button.style.backgroundColor;

// 圆角设置按钮按下时操作
function bindBorderRadiusEvent(e, self, buttonCtrls){
    self.initborderRadius = store.elements[store.currElemId].style.borderRadius;
    self.dx = e.pageX;
    self.initLeft = self.offsetLeft;
    $(document).unbind('mousemove').bind('mousemove', function(e){ buttonCtrls.borderRadiusChangeHandler(e, self) });
    $(document).unbind('mouseup').bind('mouseup', buttonCtrls.borderRadiusSetHandler.bind(buttonCtrls, self));
}

function updateBorderRadius(id, value, borderRadius){
    vm.updateCurrTools(id, 'button');
    // 更改表单项圆角视图
    $('.set-button-borderRadius').css('left', value + 'px');
    $('.set-button-borderRadius-desc').html(borderRadius + 'px');
    // 更新预览视图模型
    vm.setPreViewModel('borderRadius', borderRadius);
}

function bindOpacityEvent(e, self, buttonCtrls){
    self.initOpacity = store.elements[store.currElemId].style.opacity;
    self.dx = e.pageX;
    self.initLeft = self.offsetLeft;
    $(document).unbind('mousemove').bind('mousemove', function(e){ buttonCtrls.OpacityChangeHandler(e, self) });
    $(document).unbind('mouseup').bind('mouseup', buttonCtrls.OpacitySetHandler.bind(buttonCtrls, self));
}

function updateOpacity(id, value, opacity){
    vm.updateCurrTools(id, 'button');
    // 更改表单项圆角视图
    $('.set-button-opacity').css('left', value + 'px');
    $('.set-button-opacity-desc').html(parseInt(opacity * 100) + '%');
    // 更新预览视图模型
    vm.setPreViewModel('opacity', opacity);
}

function setText(id, value){
    vm.updateCurrTools(id, 'button');
    // 更改表单项文字视图
    $('.set-button-text').val(value);
    // 更新预览视图模型
    $('#' + store.currElemId + ' .drag-ele').html(value);
    store.elements[store.currElemId].text = value;
}

function setFontSize(id, value){
    vm.updateCurrTools(id, 'button');
    // 更改表单项文字视图
    $('.set-button-fontSize-selected').html(value);
    // 更新预览视图模型
    vm.setPreViewModel('fontSize', value);
}

// 获取当前边框属性
function getBorderAttrs(){
    return {
        borderWidth: store.elements[store.currElemId].style['borderWidth'],
        borderStyle: store.elements[store.currElemId].style['borderStyle'],
        borderColor: store.elements[store.currElemId].style['borderColor'],
    };
}

var buttonCtrls = function(){
    this.init();
};

buttonCtrls.prototype = {
    init: function(){
        var _this = this;
        $('.set-button-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-button-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-button-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-button-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-button-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-button-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        // 层级设置
        $('.set-button-zIndex').unbind('keyup').bind('keyup', function(){ _this.zIndexChangeHandler(this.value) });
        $('.set-button-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.set-button-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        // 按钮文本
        $('.set-button-text').unbind('keyup').bind('keyup', this.textChangeHandler);
        $('.set-button-fontSize').unbind('click').bind('click', this.fontSizeHandler);
        // 圆角设置
        $('.set-button-borderRadius').unbind('mousedown').bind('mousedown', function(e){ bindBorderRadiusEvent(e, this, _this); });
        // 链接设置
        $('.set-button-link').unbind('keyup').bind('keyup', this.linkChangeHandler);
        // 透明度设置
        $('.set-button-opacity').unbind('mousedown').bind('mousedown', function (e) { bindOpacityEvent(e, this, _this); });
        // $('.set-button-borderColor').ColorPicker({ color: defaultStore.button.style.backgroundColor, onChange: this.bordercolorChangeHandler });
        $('.set-border-width').unbind('keyup').bind('keyup', this.borderwidthChangeHandler);
        $('.set-border-type').unbind('click').bind('click', this.bordertypeChangeHandler);
        // 边框
        // $('.set-button-borderColor').ColorPicker({ color: defaultStore.button.style.borderColor, onChange: this.bordercolorChangeHandler });
        $('.set-button-borderColor').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: defaultStore.button.style.borderColor }) } }, this.bordercolorChangeHandler, this.bordercolorChangeHandler, this.bordercolorChangeHandler);
        $('.set-border-width').unbind('keyup').bind('keyup', this.borderwidthChangeHandler);
        $('.set-border-type').unbind('click').bind('click', this.bordertypeChangeHandler);
        // 字体颜色
        // $('.set-button-fontColor').ColorPicker({ 
        //     color: defaultStore.button.style.color, 
        //     onSelect: function(hsb, hex, rgb){ _this.fontColorSelectHandler(hsb, hex, rgb); }, 
        //     onChange: this.fontColorChangeHandler,
        //     onShow: function(hsb, hex, rgb){ 
        //         initFontColor = store.elements[store.currElemId].style.color;
        //     }
        // });
        $('.set-button-fontColor').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: defaultStore.button.style.color }) } }, this.fontColorChangeHandler, this.fontColorChangeHandler, this.fontColorChangeHandler);
        // 背景颜色
        // $('#button-bgColor').ColorPicker({ 
        //     color: defaultStore.button.style.backgroundColor, 
        //     onSelect: function(hsb, hex, rgb){ _this.bgcolorSelectHandler(hsb, hex, rgb); }, 
        //     onChange: this.bgcolorChangeHandler,
        //     onShow: function(hsb, hex, rgb){ 
        //         initBgColor = store.elements[store.currElemId].style.backgroundColor;
        //     }
        // });
        $('#button-bgColor').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: defaultStore.button.style.backgroundColor }) } }, this.bgcolorChangeHandler, this.bgcolorChangeHandler, this.bgcolorChangeHandler);
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
            // 更新行高
            vm.setPreViewModel('lineHeight', value);
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
            undo: vm.move.bind(_this, oldValue, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }), 
            title: '移动按钮元素', 
        });
    },
    // 文本变化操作
    textChangeHandler: function(){
        if (!store.currElemId) return;
        var _this = this;
        var value = this.value;
        // 缓存上一个状态
        var oldValue = store.elements[store.currElemId].text;
        // 缓存当前状态
        var newValue = value;
        // 更新预览视图模型
        $('#' + store.currElemId + ' .drag-ele').html(value);
        store.elements[store.currElemId].text = value;
        // 获取当前
        // 缓存当前元素id，放到闭包内
        var id = store.currElemId;
        // 添加历史记录
        vm.execute({
            undo: setText.bind(_this, id, oldValue),
            execute: setText.bind(_this, id, newValue), 
            title: '修改按钮文字', 
        });
    },
    // 边框颜色变化操作
    bordercolorChangeHandler: function(color, context){
        if (!store.currElemId) return;
        // 更新表单视图
        // $('.set-button-borderColor').html('#' + hex);
        // $('.set-button-borderColorIcon').css('background', '#' + hex);
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
    // 背景颜色变化操作
    bgcolorChangeHandler: function (color, context) {
        // $('.set-button-bgColorSelected').html('#' + hex);
        // $('.set-button-bgColorIcon').css('background', '#' + hex);
        // callback ? callback() : void 0;
        if (!store.currElemId) return;
        var hex = color.val('hex');
        // 更新预览视图模型
        vm.setPreViewModel('backgroundColor', hex ? ('#' + hex) : 'transparent');
    },
    // bgcolorSelectHandler: function(hsb, hex, rgb){
    //     var id = store.currElemId;
    //     var style = store.elements[store.currElemId].style;
    //     // 添加历史记录
    //     vm.execute({
    //         undo: this.bgcolorChangeHandler.bind(this, null, initBgColor.substring(1), null, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }),
    //         execute: this.bgcolorChangeHandler.bind(this, null, hex, null, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }), 
    //         title: '修改按钮颜色', 
    //     });
    // },
    // 字体颜色变化操作
    fontColorChangeHandler: function (color, context) {
        // if (!store.currElemId) return;
        // $('.set-button-fontColorSelected').html('#' + hex);
        // $('.set-button-fontColorIcon').css('background', '#' + hex);
        // callback ? callback() : void 0;
        if (!store.currElemId) return;
        var hex = color.val('hex');
        // 更新预览视图模型
        vm.setPreViewModel('color', hex ? ('#' + hex) : 'transparent');
    },
    // fontColorSelectHandler: function(hsb, hex, rgb){
    //     var id = store.currElemId;
    //     var style = store.elements[store.currElemId].style;
    //     // 添加历史记录
    //     vm.execute({
    //         undo: this.fontColorChangeHandler.bind(this, null, initFontColor.substring(1), null, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }),
    //         execute: this.fontColorChangeHandler.bind(this, null, hex, null, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }), 
    //         title: '修改按钮字体颜色', 
    //     });
    // },
    fontSizeHandler: function () {
        $('.button-font-size-select').show();
        $(this).find('li').unbind('mousedown').bind('mousedown', function (e) { e.stopPropagation(); });
        // 下拉列表绑定点击事件
        $(this).find('li').unbind('click').bind('click', function (e) {
            e.stopPropagation();
            var value = $(this).html();
            var id = store.currElemId;
            var style = store.elements[store.currElemId].style;
            // 添加历史记录
            vm.execute({
                undo: setFontSize.bind(this, id, style.fontSize),
                execute: setFontSize.bind(this, id, value), 
                title: '修改按钮字号', 
            });
            // 更新预览视图模型
            vm.setPreViewModel('fontSize', value);
            // 更新选中项
            $('.set-button-fontSize-selected').html(value);
            // 隐藏下拉列表
            $('.button-font-size-select').hide();
        });
    },
    // 边框颜色变化操作
    // bordercolorChangeHandler: function(hsb, hex, rgb){
    //     if (!store.currElemId) return;
    //     // 更新表单视图
    //     $('.set-button-borderColor').html('#' + hex);
    //     $('.set-button-borderColorIcon').css('background', '#' + hex);
    //     // 更新模型
    //     store.elements[store.currElemId].style.borderColor = '#' + hex;
    //     // 更新预览视图
    //     $('#' + store.currElemId).children('.drag-ele').css('border', getBorderAttrs().borderWidth + 'px ' + getBorderAttrs().borderStyle + ' ' + getBorderAttrs().borderColor);
    // },
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
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'button'); } catch(ex){} }), 
                title: '修改按钮层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-button-zIndex');
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
        var elem = $('.set-button-zIndex');
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
        var borderRadius = parseInt(store.elements[store.currElemId].style.height / 2 * persent);
        // 更改表单项圆角视图
        $(self).css('left', dx + 'px');
        $('.set-button-borderRadius-desc').html(borderRadius + 'px');
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
            title: '修改按钮圆角', 
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
        $('.set-button-opacity-desc').html(parseInt(opacity * 100) + '%');
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
            title: '修改按钮透明度', 
        });
    },
    linkChangeHandler: function(){
        // 更新模型
        if (store.currElemId) {
            store.elements[store.currElemId].link = this.value;
        }
    },
    updateFormView: function(){
        var currElem = store.elements[store.currElemId];
        var scrollbarWidth = $('.set-button-borderRadius').parent().width() - $('.set-button-borderRadius').width();
        // 更新按钮位置尺寸
        $('.set-button-left').val(currElem.style.left);
        $('.set-button-top').val(currElem.style.top);
        $('.set-button-width').val(currElem.style.width);
        $('.set-button-height').val(currElem.style.height);
        // 层级
        $('.set-button-zIndex').val(currElem.style.zIndex);
        // 按钮文本
        $('.set-button-text').val(currElem.text);
        // 字体属性
        $('.set-button-fontColorSelected').html(currElem.style.color);
        $('.set-button-fontColorIcon').css('backgroundColor', currElem.style.color);
        $('.set-button-fontSize-selected').html(currElem.style.fontSize);
        $('.set-button-bgColorSelected').html(currElem.style.backgroundColor);
        $('.set-button-bgColorIcon').css('backgroundColor', currElem.style.backgroundColor);
        // 边框
        $('.set-button-borderColor').html(currElem.style.borderColor);
        $('.set-button-borderColorIcon').css('background', currElem.style.borderColor);
        $('.set-border-width').val(parseInt(currElem.style.borderWidth) + 'px');
        $('.set-border-type-' + currElem.style.borderStyle).addClass('current').siblings('.set-border-type').removeClass('current');
        // 圆角 borderRadius
        var borderRadiusOffset = currElem.style.borderRadius / (currElem.style.height / 2) * scrollbarWidth;
        $('.set-button-borderRadius').css('left', borderRadiusOffset + 'px');
        $('.set-button-borderRadius-desc').html(currElem.style.borderRadius + 'px');
        // 透明度
        var opacityOffset = currElem.style.opacity * scrollbarWidth;
        $('.set-button-opacity').css('left', opacityOffset + 'px');
        $('.set-button-opacity-desc').html(parseInt(currElem.style.opacity * 100) + '%');
        // 链接
        var link = currElem.link ? currElem.link : '';
        $('.set-button-link').val(link);
        // 更新method列表
        $('.set-native .set-native-selected').html(currElem.native.name ? defaultStore.native[currElem.native.name].name : '选择应用');
        $('.set-native-method .set-native-method-selected').html(currElem.native.method ? defaultStore.native[currElem.native.name].method[currElem.native.method] : '选择功能');
        $('.set-native-param .set-native-param-input').val(currElem.native.id ? currElem.native.id : '');
    }
};

module.exports = buttonCtrls;