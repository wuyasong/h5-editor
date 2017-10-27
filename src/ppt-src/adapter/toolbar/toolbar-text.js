var model = require('../../model/store');
var thumbList = require('../thumb/index');
var mainEdit = require('../mainEdit/main-editor');
var History = require('../../lib/history');
var component = require('../component/common');
var layerlist = require('../component/layer');
var contextmenu = require('../component/contextmenu');
var contextmenuView = require('../../views/win/contextmenu.tpl');

// 文字组件
function textComponent () {
    this.type = 'text';
    this.elemId = null;
    this.history = new History();
    this.init();
}

textComponent.prototype = {
    init: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: ['.main-toolbar-text-icon'],
            methods: {
                /**
                 * 新建文本事件回调
                 * 创建文本元素
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
     * 新建文本元素
     * 更新当前状态
     * 创建元素模型
     * 主编辑区创建文本元素视图
     * 缩略图区创建文本元素视图
     * 初始化文本编辑器(绑定双击,右键菜单指令)
     * 实例化缩放事件
     * 实例化拖拽事件
     * 更新图层列表视图
     */
    build: function (data) {
        var _this = this;
        // 主编辑区创建文本元素视图 并更新模型
        this.elemId = mainEdit.createElement(data, 'text');
        // 缩略图区创建文本元素视图
        thumbList.createElement(this.elemId, 'text');
        // 更新当前状态
        component.updateEditState(this.elemId, this.type);
        // 重置文本编辑及拖拽状态
        component.updateDragState();
        // 更新表单视图
        component.panel.updateTextView();
        // 初始化文本编辑器 && 右键菜单
        this.initContentEdit();
        // 实例化缩放事件
        component.dragEvent(this.elemId, 'text');
        // 实例化拖拽事件
        component.resizeEvent(this.elemId, 'text');
        // 更新图层列表视图
        layerlist.render();
        component.updateLayerState(this.elemId);
    },
    initContentEdit: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: ['#' + this.elemId, '.txtEditor'],
            methods: {
                /**
                 * 双击编辑时
                 * 更新一些状态
                 * 当前文本编辑器改为正在编辑状态
                 * 全选文本
                 * 禁止拖拽状态
                 * 右键菜单
                 */
                onEdit: function (e, $el) {
                    e.preventDefault();
                    var currentId = $el.attr('id');
                    component.updateEditState(currentId, _this.type);
                    // 当前文本编辑器改为正在编辑状态
                    $el.children('.txtEditor')
                        .addClass('editing')
                        .attr('contenteditable', true)
                        .focus()
                        .unbind('selectstart').bind('selectstart', function(){return true;})
                        .unbind('keyup').bind('keyup', function(){
                            var currentPage = model.currentPage - 1;
                            model.pages[currentPage].component[currentId].text = this.innerHTML;
                            thumbList.setProps('html', this.innerHTML, 'props');
                        });
                    // 全选文本
                    document.execCommand("selectall");
                    // 其余可拖拽
                    $.each(model.elemKey, function(key, element){
                        if (currentId === key) {
                            element.draggable && (element.draggable.activate = false);
                        } else {
                            element.draggable && (element.draggable.activate = true)
                        }
                    });
                },
                // 失去焦点时
                // 重置文本编辑及拖拽状态
                onBlur: function () {
                    component.updateDragState();
                },
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
    // init: function () {},
    // init: function () {},
    // init: function () {},
    // init: function () {},
};

module.exports = textComponent;