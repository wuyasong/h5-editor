var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');
var Gallery = require('../component/gallery');  // 图库功能

function viewPanel () {
    this.init();
}

viewPanel.prototype = {
    /**
     * 初始化控制面板-容器
     */
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-view-border-input',
                '.set-view-border-btn',
                '.view-border-list li',
                '.set-view-link',
                '.set-view-border-radius',
                '.set-view-opacity',
                '.set-view-bgImg',
                '.view-bgImg-delete',
                '.set-view-bg-position',
                '.set-view-bg-size',
                '.view-bg-position-list li',
                '.set-view-bg-size',
                '.view-bg-size-list li'
            ],
            methods: {
                /**
                 * 显示边框列表
                 */
                getBorderWidth: function (e, $el) {
                    e.stopPropagation();
                    $('.view-border-list').show();
                },
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
                 * 修改链接
                 */
                setLink: this.changeLink,
                /**
                 * 修改圆角
                 */
                getBorderRadiusProps: function (e, $el) {
                    _this.disX = e.pageX;
                    _this.initWidth = $('.view-border-radius-progress-bar').width();
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeBorderRadius(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                },
                /**
                 * 修改透明度
                 */
                getOpacityProps: function (e, $el) {
                    _this.disX = e.pageX;
                    _this.initWidth = $('.view-opacity-progress-bar').width();
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeOpacity(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                },
                /**
                 * 显示图库弹窗
                 * 默认显示我的图库
                 */
                getGalleryWin: function (e, $el) {
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(_this.changeBgImg);
                },
                /**
                 * 删除背景图片
                 */
                deleteBgImg: this.deleteBgImg,
                /**
                 * 显示背景位置列表
                 */
                getBgPositionList: function (e, $el) {
                    e.stopPropagation();
                    $('.view-bg-position-list').show();
                },
                /**
                 * 显示背景尺寸列表
                 */
                getBgSizeList: function (e, $el) {
                    e.stopPropagation();
                    $('.view-bg-size-list').show();
                },
                /**
                 * 设置背景位置
                 */
                setBgPosition: this.changeBgPosition,
                /**
                 * 设置背景尺寸
                 */
                setBgSize: this.changeBgSize
            }
        });
        // 背景色
        $('.set-view-bgcolor').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.view.style.backgroundColor }) } 
            }, 
            this.changeBgColor, 
            this.changeBgColor, 
            this.changeBgColor
        );
        // 边框色
        $('.set-view-border-color').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.view.style.borderColor }) } 
            }, 
            this.changeborderColor, 
            this.changeborderColor, 
            this.changeborderColor
        );
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
        $('.set-view-bgcolor').css('backgroundColor', hex);
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
        $('.set-view-border-color').css('backgroundColor', hex);
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
        // console.info(value)
        // 表单视图更新
        $('.set-view-border-input').val(value != 0 ? (value + '像素') : '无');
        $('.view-border-list li[data-border="' + value + '"]').addClass('selected').siblings().removeClass('selected');
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
        // 圆角值
        var borderRadius = Math.round(model.pages[currentPage].component[model.currentId].style.width / 2 * (disX / totalWidth));
        // 更新圆角模型
        model.pages[currentPage].component[model.currentId].style['borderRadius'] = borderRadius;
        // 主编辑区更新视图
        mainEdit.setProps('borderRadius', borderRadius, 'style');
        // 缩略图区更新视图
        thumbList.setProps('borderRadius', borderRadius, 'style');
        // 更新表单视图
        $('.view-border-radius-progress-bar').css('width', persent);
        $('.view-border-radius-txt').html(borderRadius + 'px');
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
        $('.view-opacity-progress-bar').css('width', persent);
        $('.view-opacity-txt').html(parseInt(opacity * 100) + '%');
    },
    /**
     * 修改背景图片
     * 更新背景图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    changeBgImg: function (src) {
        var currentPage = model.currentPage - 1;
        // 更新背景图片模型
        model.pages[currentPage].component[model.currentId].style['backgroundImage'] = src;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 更新表单视图
        $('.view-bgImg-preview').css('backgroundImage', 'url(' + src + ')');
    },
    /**
     * 删除背景图片
     * 删除背景图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    deleteBgImg: function () {
        var currentPage = model.currentPage - 1;
        // 更新背景图片模型
        model.pages[currentPage].component[model.currentId].style['backgroundImage'] = '';
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', '', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', '', 'style');
        // 更新表单视图
        $('.view-bgImg-preview').css('backgroundImage', '');
    },
    /**
     * 设置背景位置
     * 更新背景位置模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeBgPosition: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var value = $el.attr('data-position');
        model.pages[currentPage].component[model.currentId].style.backgroundPosition = value;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundPosition', value, 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundPosition', value, 'style');
        // 表单视图更新
        $('.set-view-bg-position p').html($el.html());
        $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置背景尺寸
     * 更新背景尺寸模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeBgSize: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var value = $el.attr('data-size');
        model.pages[currentPage].component[model.currentId].style.backgroundSize = value;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundSize', value, 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundSize', value, 'style');
        // 表单视图更新
        $('.set-view-bg-size p').html($el.html());
        $el.addClass('selected').siblings().removeClass('selected');
    }
    // init: function () {},
    // init: function () {},
    // init: function () {},
};

module.exports = viewPanel;