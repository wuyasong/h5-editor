var model = require('../../model/store');
var thumbList = require('../thumb/index');
var mainEdit = require('../mainEdit/main-editor');
var History = require('../../lib/history');
var component = require('../component/common');
var layerlist = require('../component/layer');
var contextmenu = require('../component/contextmenu');
var contextmenuView = require('../../views/win/contextmenu.tpl');

// 视频组件
function videoComponent () {
    this.type = 'video';
    this.elemId = null;
    this.history = new History();
    this.init();
}

videoComponent.prototype = {
    init: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: ['.main-toolbar-video-icon'],
            methods: {
                /**
                 * 新建元素的事件回调
                 * 创建元素
                 * 添加历史记录
                 */
                create: function (e, $el) {
                    e.stopPropagation();
                    _this.build();
                }
            }
        });
    },
    /**
     * 新建视频元素
     * @param {Object} data 上次编辑元素对象模型，没有则为undefined
     * 更新当前状态
     * 创建元素模型
     * 主编辑区创建元素视图
     * 缩略图区创建元素视图
     * 元素绑定右键菜单指令
     * 实例化缩放事件
     * 实例化拖拽事件
     * 更新图层列表视图
     */
    build: function (data) {
        var _this = this;
        // 主编辑区创建元素视图 并更新模型
        this.elemId = mainEdit.createElement(data, 'video');
        // 缩略图区创建元素视图
        thumbList.createElement(this.elemId, 'video');
        // 更新当前状态
        component.updateEditState(this.elemId, this.type);
        // 重置文本编辑及拖拽状态
        component.updateDragState();
        // 更新表单视图
        component.panel.updateVideoView();
        // 元素绑定右键菜单指令
        this.bindEvents();
        // 实例化缩放事件
        component.dragEvent(this.elemId, 'video');
        // 实例化拖拽事件
        component.resizeEvent(this.elemId, 'video');
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

module.exports = videoComponent;