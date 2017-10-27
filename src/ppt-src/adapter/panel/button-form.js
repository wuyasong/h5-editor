var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');

function buttonPanel () {
    this.init();
}

buttonPanel.prototype = {
    /**
     * 初始化控制面板-按钮
     */
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-button-text',
                '.set-button-font-family-btn',
                '.button-font-family-list li',
                '.set-button-font-size-input',
                '.set-button-font-size-btn',
                '.button-font-size-list li',
                '.set-button-border-input',
                '.set-button-border-btn',
                '.button-border-width-list li',
                '.set-button-link',
                '.set-button-border-radius',
                '.set-button-opacity'
            ],
            methods: {
                /**
                 * 显示字体列表
                 */
                getFontFamilyList: function (e, $el) {
                    e.stopPropagation();
                    $('.button-font-family-list').show();
                },
                /**
                 * 显示字号列表
                 */
                getFontSizeList: function (e, $el) {
                    e.stopPropagation();
                    $('.button-font-size-list').show();
                },
                /**
                 * 显示边框宽度列表
                 */
                getBorderWidthList: function (e, $el) {
                    e.stopPropagation();
                    $('.button-border-width-list').show();
                },
                // 设置文字
                setText: this.changeText,
                /**
                 * 设置字体
                 */
                setFontFamily: this.changeFontFamily,
                /**
                 * 字号输入框监听change事件
                 */
                setFontSizeInput: function (e, $el) {
                    var value = parseInt($el.val());
                    _this.changeFontSize(value);
                },
                /**
                 * 字号列表监听点击事件
                 */
                setFontSize: function (e, $el) {
                    _this.changeFontSize($el.attr('data-font'), $el);
                },
                /**
                 * 修改链接
                 */
                setLink: this.changeLink,
                /**
                 * 边框输入框监听change事件
                 */
                setBorderWidthInput: function (e, $el) {
                    var value = parseInt($el.val());
                    _this.changeBorderWidth(value);
                },
                /**
                 * 边框点击事件
                 */
                setBorderWidth: function (e, $el) {
                    _this.changeBorderWidth($el.attr('data-border'), $el);
                },
                /**
                 * 修改圆角
                 */
                getBorderRadiusProps: function (e, $el) {
                    _this.disX = e.pageX;
                    _this.initWidth = $('.button-border-radius-progress-bar').width();
                    // console.info(_this.disX, _this.initWidth)
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeBorderRadius(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                },
                /**
                 * 修改透明度
                 */
                getOpacityProps: function (e, $el) {
                    _this.disX = e.pageX;
                    _this.initWidth = $('.button-opacity-progress-bar').width();
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeOpacity(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                }
            }
        });
        // 字色
        $('.set-button-color').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.button.style.color }) } 
            }, 
            this.changeColor, 
            this.changeColor, 
            this.changeColor
        );
        // 背景色
        $('.set-button-bgcolor').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.button.style.backgroundColor }) } 
            }, 
            this.changeBgColor, 
            this.changeBgColor, 
            this.changeBgColor
        );
        // 边框色
        $('.set-button-border-color').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.button.style.borderColor }) } 
            }, 
            this.changeborderColor, 
            this.changeborderColor, 
            this.changeborderColor
        );
    },
    /**
     * 设置文字色
     * 更新文字色模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeColor: function (color, context) {
        var currentPage = model.currentPage - 1;
        var hex = color.val('hex');
        hex = hex ? ('#' + hex) : 'transparent';
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.color = hex;
        // 主编辑区更新视图
        mainEdit.setProps('color', hex, 'style');
        // 缩略图区更新视图
        thumbList.setProps('color', hex, 'style');
        // 更新表单视图
        $('.set-button-color').css('backgroundColor', hex);
    },
    /**
     * 设置背景色
     * 更新背景色模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeBgColor: function (color, context) {
        var currentPage = model.currentPage - 1;
        var hex = color.val('hex');
        hex = hex ? ('#' + hex) : 'transparent';
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.backgroundColor = hex;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundColor', hex, 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundColor', hex, 'style');
        // 更新表单视图
        $('.set-button-bgcolor').css('backgroundColor', hex);
    },
    /**
     * 设置边框色
     * 更新边框色模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeborderColor: function (color, context) {
        var currentPage = model.currentPage - 1;
        var hex = color.val('hex');
        hex = hex ? ('#' + hex) : 'transparent';
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.borderColor = hex;
        // 主编辑区更新视图
        mainEdit.setProps('borderColor', hex, 'style');
        // 缩略图区更新视图
        thumbList.setProps('borderColor', hex, 'style');
        // 更新表单视图
        $('.set-button-border-color').css('backgroundColor', hex);
    },
    // 修改文字
    changeText: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var value = $el.val();
        model.pages[currentPage].component[model.currentId].text = value;
        // 主编辑区更新视图
        mainEdit.setProps('html', value, 'props');
        // 缩略图区更新视图
        thumbList.setProps('html', value, 'props');
        // 更新表单视图
        $('.set-button-text').val(value);
    },
    /**
     * 设置字体
     * 更新字体模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeFontFamily: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var value = $el.attr('data-font');
        model.pages[currentPage].component[model.currentId].style.fontFamily = value;
        // 主编辑区更新视图
        mainEdit.setProps('fontFamily', value, 'style');
        // 缩略图区更新视图
        thumbList.setProps('fontFamily', value, 'style');
        // 表单视图更新
        $('.set-button-font-family-btn p').html(value || '默认');
        $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置字号
     * 更新字号模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeFontSize: function (value, $el) {
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.fontSize = value;
        // 主编辑区更新视图
        mainEdit.setProps('fontSize', value + 'px', 'style');
        // 缩略图区更新视图
        thumbList.setProps('fontSize', value + 'px', 'style');
        // 表单视图更新
        $('.set-button-font-size-input').val(value + '像素');
        $('.button-font-size-list li[data-font="' + value + '"]').addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置边框宽度
     * 更新边框宽度模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeBorderWidth: function (value, $el) {
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.borderWidth = value;
        // 主编辑区更新视图
        mainEdit.setProps('borderWidth', value + 'px', 'style');
        mainEdit.setProps('borderStyle', 'solid', 'style');
        // 缩略图区更新视图
        thumbList.setProps('borderWidth', value + 'px', 'style');
        thumbList.setProps('borderStyle', 'solid', 'style');
        // 表单视图更新
        $('.set-button-border-input').val(value != 0 ? (value + '像素') : '无');
        $('.button-border-width-list li[data-border="' + value + '"]').addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置链接
     * 更新链接模型
     */
    changeLink: function (e, $el) {
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].link = $el.val();
    },
    /**
     * 设置圆角
     * 更新圆角模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeBorderRadius: function (e) {
        e.preventDefault();
        var currentPage = model.currentPage - 1;
        // 计算进度条宽度（单位：px）
        var disX = e.pageX - this.disX + this.initWidth;
        var totalWidth = 130;
        disX = disX < 0 ? 0 : disX;
        disX = disX > totalWidth ? totalWidth : disX;
        // 计算进度条宽度（单位：%）
        var persent = disX / totalWidth * 100 + '%';
        // console.info(disX, totalWidth, disX / totalWidth)
        // 圆角值
        var borderRadius = Math.round(model.pages[currentPage].component[model.currentId].style.width / 2 * (disX / totalWidth));
        // 更新圆角模型
        model.pages[currentPage].component[model.currentId].style['borderRadius'] = borderRadius;
        // 主编辑区更新视图
        mainEdit.setProps('borderRadius', borderRadius, 'style');
        // 缩略图区更新视图
        thumbList.setProps('borderRadius', borderRadius, 'style');
        // 更新表单视图
        $('.button-border-radius-progress-bar').css('width', persent);
        $('.button-border-radius-txt').html(borderRadius + 'px');
    },
    /**
     * 设置透明度
     * 更新透明度模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeOpacity: function (e) {
        e.preventDefault();
        var currentPage = model.currentPage - 1;
        // 计算进度条宽度（单位：px）
        var disX = e.pageX - this.disX + this.initWidth;
        var totalWidth = 130;
        disX = disX < 0 ? 0 : disX;
        disX = disX > totalWidth ? totalWidth : disX;
        // 计算进度条宽度（单位：%）
        var persent = disX / totalWidth * 100 + '%';
        // 透明度值
        var opacity = Math.round(disX / totalWidth * 100) / 100;
        // 更新圆角模型
        model.pages[currentPage].component[model.currentId].style['opacity'] = Number(opacity);
        // 主编辑区更新视图
        mainEdit.setProps('opacity', opacity, 'style');
        // 缩略图区更新视图
        thumbList.setProps('opacity', opacity, 'style');
        // 更新表单视图
        $('.button-opacity-progress-bar').css('width', persent);
        $('.button-opacity-txt').html(parseInt(opacity * 100) + '%');
    }
    // init: function () {},
    // init: function () {},
    // init: function () {},
};

module.exports = buttonPanel;