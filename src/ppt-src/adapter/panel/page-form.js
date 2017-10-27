var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var Gallery = require('../component/gallery');  // 图库功能
var Music = require('../component/music');  // 乐库功能
var Cache = require('../component/cache');
var baseForm = require('./base-form');
var animateForm = require('./animate-form');
var eventForm = require('./events-form');

function pagePanel () {
    // 继承基础样式操作
    this.base = new baseForm();
    // 继承动画操作
    this.animation = new animateForm();
    // 继承事件操作
    this.events = new eventForm();
    this.init();
}

pagePanel.prototype = {
    /**
     * 初始化控制面板-页面属性
     */
    init: function () {
        var _this = this;
        /**
         * 绑定指令
         * 选择背景
         * 选择音频
         * 关闭弹层
         */
        handy.create({
            el: [
                '.set-page-bgImg',   // 选择背景图按钮
                '.set-page-bgMusic',   // 选择背景音乐按钮
                '.bgimg-delete',   // 删除背景图按钮
                '.layerlist-del-btn',  // 图层删除按钮
                '.panel-tabs li'  // 控制面板选项卡
            ],
            methods: {
                /**
                 * 切换面板选项卡
                 */
                tabPanel: function (e, $el) {
                    var index = $el.index();
                    // 显示当前面板（样式，动画，事件）
                    $('.panel-tabs li').eq(index).addClass('current').siblings().removeClass('current');
                    $('.main-options-body').eq(index).show().siblings('.main-options-body').hide();
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
                 * 显示音频弹窗
                 * 默认显示我的音乐
                 */
                getAidioWin: function (e, $el) {
                    $('.window-audio').show();
                    Music.getLocal(_this.changeBgMusic);
                },
                /**
                 * 删除背景
                 */
                deleteBgImg: _this.deleteBgImg,
                /**
                 * 删除元素
                 */
                deleteElement: function () {
                    // 销毁缩略列表区视图
                    $('.' + model.currentId + '_thumb').remove();
                    mainEdit.destoryElement(model.currentId);
                }
            }
        });
        // 背景色
        $('.set-page-bgcolor').jPicker(
            { 
                window: { expandable: true }, 
                color: { active: new $.jPicker.Color({ hex: defaultData.background.backgroundColor }) } 
            }, 
            this.changeColor, 
            this.changeColor, 
            this.changeColor
        );
        // 初始化继承的样式操作
        this.base.init();
        // 初始化继承的动画操作
        this.animation.init();
        // 初始化继承的事件操作
        this.events.init();
        // 事件实例存储到模型中
        model.eventComponent = this.events;
    },
    /**
     * 修改背景色
     * 更新模型
     * 更新主编辑区视图
     * 更新缩略列表视图
     * 更新表单视图
     */
    changeColor: function (color, context) {
        var currentPage = model.currentPage - 1;
        var hex = color.val('hex');
        hex = hex ? ('#' + hex) : 'transparent';
        // 更新背景图片模型
        model.pages[currentPage].background.backgroundColor = hex;
        // 更新主编辑区视图
        $('.main-preview-page-item').eq(currentPage).css('backgroundColor', hex);
        // 更新缩略列表视图
        $('.main-thumb-preview').eq(currentPage).css('backgroundColor', hex);
        // 更新表单视图
        $('.set-page-bgcolor').css('backgroundColor', hex);
    },
    /**
     * 修改背景图片
     * 更新背景图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    changeBgImg: function (src) {
        var currentPage = model.currentPage - 1;
        // 更新背景图片模型
        model.pages[currentPage].background.backgroundImage = src;
        // 更新主编辑区视图
        $('.main-preview-page-item').eq(currentPage).css('backgroundImage', 'url(' + src + ')');
        // 更新缩略列表视图
        $('.main-thumb-preview-content').eq(currentPage).css('backgroundImage', 'url(' + src + ')');
        // 更新表单视图
        $('.bgimg-preview').css('backgroundImage', 'url(' + src + ')');
    },
    /**
     * 删除背景图片
     * 删除背景图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    deleteBgImg: function () {
        var currentPage = model.currentPage - 1;
        // 更新背景图片模型
        model.pages[currentPage].background.backgroundImage = '';
        // 更新主编辑区视图
        $('.main-preview-page-item').eq(currentPage).css('backgroundImage', '');
        // 更新缩略列表视图
        $('.main-thumb-preview-content').eq(currentPage).css('backgroundImage', '');
        // 更新表单视图
        $('.bgimg-preview').css('backgroundImage', '');
    },
    /**
     * 修改背景音乐
     * 更新背景音乐模型
     */
    changeBgMusic: function (src) {
        model.bgMusic = src;
        $('.currBgMusic').html(src).attr('title', src);
    }
};

module.exports = pagePanel;