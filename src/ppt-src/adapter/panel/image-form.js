var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');
var Gallery = require('../component/gallery');  // 图库功能

function imagePanel () {
    this.init();
}

imagePanel.prototype = {
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
                '.set-image-src',
                '.image-src-delete',
                '.set-image-border-input',
                '.set-image-border-btn',
                '.image-border-width-list li',
                '.set-image-link',
                '.set-image-border-radius',
                '.set-image-opacity'
            ],
            methods: {
                /**
                 * 显示图库弹窗
                 * 默认显示我的图库
                 */
                getGalleryWin: function (e, $el) {
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(_this.changeImage);
                },
                /**
                 * 显示边框宽度列表
                 */
                getBorderWidthList: function (e, $el) {
                    e.stopPropagation();
                    $('.image-border-width-list').show();
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
                    _this.initWidth = $('.image-border-radius-progress-bar').width();
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeBorderRadius(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                },
                /**
                 * 修改透明度
                 */
                getOpacityProps: function (e, $el) {
                    _this.disX = e.pageX;
                    _this.initWidth = $('.image-opacity-progress-bar').width();
                    $(document).unbind('mousemove').bind('mousemove', function (e) { _this.changeOpacity(e); });
                    $(document).unbind('mouseup').bind('mouseup', function (e) { $(document).off('mousemove').off('mouseup'); });
                }
            }
        });
        // 边框色
        $('.set-image-border-color').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.image.style.borderColor }) } 
            }, 
            this.changeborderColor, 
            this.changeborderColor, 
            this.changeborderColor
        );
    },
    /**
     * 修改图片
     * 更新模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeImage: function (src, width, height) {
        var currentPage = model.currentPage - 1;
        var currElem = model.pages[currentPage].component[model.currentId];
        var newW, newH;
        // 图片本身宽度大于视口宽度 -> 缩放到视口宽度比例
        if (width > model.preview.width) {
            newW = model.preview.width;
            newH = parseInt(model.preview.width / (width / height));
        } 
        // 图片本身宽度小于等于视口宽度
        else {
            newW = width;
            newH = height;
        }
        // 更新模型
        currElem.src = src;
        currElem.style.width = newW;
        currElem.style.height = newH;
        // 主编辑区更新视图
        mainEdit.setImage({
            'src': src,
            'width': newW,
            'height': newH,
        });
        // 缩略图区更新视图
        thumbList.setImage({
            'src': src,
            'width': newW,
            'height': newH,
        });
        // 表单视图更新
        $('.image-src-preview').css('background-image', 'url(' + src + ')');
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
        $('.set-image-border-color').css('backgroundColor', hex);
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
        mainEdit.setProps('border', value + 'px solid ' + model.pages[currentPage].component[model.currentId].style.borderColor, 'style');
        // 缩略图区更新视图
        thumbList.setProps('border', value + 'px solid ' + model.pages[currentPage].component[model.currentId].style.borderColor, 'style');
        // 表单视图更新
        $('.set-image-border-input').val(value != 0 ? (value + '像素') : '无');
        $('.image-border-width-list li[data-border="' + value + '"]').addClass('selected').siblings().removeClass('selected');
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
        $('.image-border-radius-progress-bar').css('width', persent);
        $('.image-border-radius-txt').html(borderRadius + 'px');
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
        $('.image-opacity-progress-bar').css('width', persent);
        $('.image-opacity-txt').html(parseInt(opacity * 100) + '%');
    }
};

module.exports = imagePanel;