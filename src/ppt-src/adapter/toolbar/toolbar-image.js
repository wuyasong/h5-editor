var model = require('../../model/store');
var thumbList = require('../thumb/index');
var mainEdit = require('../mainEdit/main-editor');
var History = require('../../lib/history');
var component = require('../component/common');
var layerlist = require('../component/layer');
var contextmenu = require('../component/contextmenu');
var contextmenuView = require('../../views/win/contextmenu.tpl');
var Gallery = require('../component/gallery');  // 图库功能

// 形状组件
function imageComponent () {
    this.type = 'image';
    this.elemId = null;
    this.history = new History();
    this.init();
}

imageComponent.prototype = {
    init: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: ['.main-toolbar-image-icon'],
            methods: {
                /**
                 * 新建形状事件回调
                 * 创建形状元素
                 * 添加历史记录
                 */
                create: function (e, $el) {
                    e.stopPropagation();
                    // _this.build();
                    /**
                     * 显示图库弹窗
                     * 默认显示我的图库
                     */
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(function (src, width, height) {
                        _this.build(undefined, {src: src, width: width, height: height});
                    });
                }
            }
        });
    },
    /**
     * 新建形状元素
     * @param {Object} data 上次编辑元素对象，没有则为undefined
     * @param {Object} img 本次编辑选择的图片元素属性，包括src,width,height
     * 更新当前状态
     * 创建元素模型
     * 主编辑区创建形状元素视图
     * 缩略图区创建形状元素视图
     * 形状元素绑定右键菜单指令
     * 实例化缩放事件
     * 实例化拖拽事件
     * 更新图层列表视图
     */
    build: function (data, img) {
        var _this = this;
        // 主编辑区创建元素视图 并更新模型
        this.elemId = mainEdit.createElement(data, 'image', img);
        // 缩略图区创建元素视图
        thumbList.createElement(this.elemId, 'image');
        // 更新当前状态
        component.updateEditState(this.elemId, this.type);
        // 重置文本编辑及拖拽状态
        component.updateDragState();
        // 更新表单视图
        component.panel.updateImageView();
        // 形状元素绑定右键菜单指令
        this.bindEvents();
        // 实例化缩放事件
        component.dragEvent(this.elemId, 'image');
        // 实例化拖拽事件
        component.resizeEvent(this.elemId, 'image');
        // 更新图层列表视图
        layerlist.render();
        component.updateLayerState(this.elemId);
    },
    bindEvents: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: ['#' + this.elemId],
            methods: {
                // 右键菜单
                onContextmenu: function (e, $el) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('.contextmenu-list').show().css({left: e.clientX, top: e.clientY}).html(contextmenuView({type: model.currentTools, clipboard: model.clipboard}));
                    // 右键菜单项绑定指令
                    contextmenu.element($el.attr('id'));
                }
            }
        });
    }
};

module.exports = imageComponent;