var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');

function textPanel () {
    this.init();
}

textPanel.prototype = {
    /**
     * 初始化控制面板-文本
     */
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-text-font-family-btn',
                '.text-font-family-list li',
                '.dropdown-font-size-btn',
                '.set-text-font-size-input',
                '.text-font-size-list li',
                '.set-text-line-height-input',
                '.set-text-line-height-btn',
                '.text-line-height-list li',
                '.text-font-bold-box',
                '.text-font-underline-box',
                '.text-font-left-box',
                '.text-font-center-box',
                '.text-font-right-box',
                '.text-font-link-box'
            ],
            methods: {
                /**
                 * 显示字体列表
                 */
                getFontFamilyList: function (e, $el) {
                    e.stopPropagation();
                    $('.text-font-family-list').show();
                },
                /**
                 * 设置字体
                 */
                setFontFamily: this.changeFontFamily,
                /**
                 * 显示字号列表
                 */
                getFontSizeList: function (e, $el) {
                    e.stopPropagation();
                    $('.text-font-size-list').show();
                },
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
                 * 显示行高列表
                 */
                getLineHeightList: function (e, $el) {
                    e.stopPropagation();
                    $('.text-line-height-list').show();
                },
                /**
                 * 行高输入框监听change事件
                 */
                setLineHeightInput: function (e, $el) {
                    var value = parseInt($el.val());
                    _this.changeLineHeight(value);
                },
                /**
                 * 行高列表监听点击事件
                 */
                setLineHeight: function (e, $el) {
                    _this.changeLineHeight($el.attr('data-font'), $el);
                },
                /**
                 * 加粗
                 */
                setBold: function (e, $el) {
                  _this.changeStyle('fontWeight', 'bold');
                },
                /**
                 * 下划线
                 */
                setUnderline: function (e, $el) {
                  _this.changeStyle('text-decoration', 'underline');
                },
                /**
                 * 居左
                 */
                setJustifyLeft: function (e, $el) {
                  _this.changeStyle('text-align', 'left');
                },
                /**
                 * 居中
                 */
                setJustifyCenter: function (e, $el) {
                  _this.changeStyle('text-align', 'center');
                },
                /**
                 * 居右
                 */
                setJustifyRight: function (e, $el) {
                  _this.changeStyle('text-align', 'right');
                }
            }
        });
        // 字色
        $('.set-text-color').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.text.style.color }) } 
            }, 
            this.changeColor, 
            this.changeColor, 
            this.changeColor
        );
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
        $('.set-text-font-family-btn p').html(value);
        $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置字色
     * 更新字色模型
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
        $('.set-text-color').css('backgroundColor', hex);
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
        $('.set-text-font-size-input').val(value + '像素');
        $el && $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 设置行高
     * 更新行高模型
     * 主编辑区更新视图
     * 缩略图区更新视图
     * 表单视图更新
     */
    changeLineHeight: function (value, $el) {
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].style.lineHeight = value;
        // 主编辑区更新视图
        mainEdit.setProps('lineHeight', value, 'style');
        // 缩略图区更新视图
        thumbList.setProps('lineHeight', value, 'style');
        // 表单视图更新
        $('.set-text-line-height-input').val(value);
        $el && $el.addClass('selected').siblings().removeClass('selected');
    },
    changeStyle: function (key, value) {
        var currentPage = model.currentPage - 1;
        var oldValue = model.pages[currentPage].component[model.currentId].style[key];
        if (oldValue != value) {
            model.pages[currentPage].component[model.currentId].style[key] = value;
            // 主编辑区更新视图
            mainEdit.setProps(key, value, 'style');
            // 缩略图区更新视图
            thumbList.setProps(key, value, 'style');
        } else {
            model.pages[currentPage].component[model.currentId].style[key] = '';
            // 主编辑区更新视图
            mainEdit.setProps(key, '', 'style');
            // 缩略图区更新视图
            thumbList.setProps(key, '', 'style');
        }
    }
    // init: function () {},
    // init: function () {},
    // init: function () {},
    // init: function () {},
};

module.exports = textPanel;