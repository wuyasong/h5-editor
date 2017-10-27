var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');
var defaultData = require('../../model/defaultData');
var layerlist = require('../component/layer');

var contextmenu = {
    // 元素的右键菜单项操作
    element: function (id) {
        var _this = this;
        handy.create({
            el: [
                '.contextmenu-item-copy', 
                '.contextmenu-item-destory', 
                '.contextmenu-item-copyAnimation',
                '.contextmenu-item-paste',
                '.contextmenu-item-pasteAnimation'
            ],
            methods: {
                // 复制元素
                copyElement: function (e, $el) {
                    // 当前元素模型拷贝到元素剪切板中
                    model.clipboard.element = $.extend(true, {}, model.pages[model.currentPage - 1].component[model.currentId]);
                    $('.contextmenu-list').hide();
                },
                // 删除
                destory: function (e, $el) {
                    // 销毁主编辑区视图和模型
                    mainEdit.destoryElement(id);
                    // 销毁缩略列表区视图
                    $('.' + id + '_thumb').remove();
                    $('.contextmenu-list').hide();
                },
                // 复制动画
                copyAnimation: function (e, $el) {
                    // 当前元素动画模型拷贝到动画剪切板中
                    model.clipboard.animation = $.extend(true, {}, model.pages[model.currentPage - 1].component[model.currentId].animation);
                    $('.contextmenu-list').hide();
                },
                // 粘贴元素
                pasteElement: function (e, $el) {
                    if ($el.hasClass('disabled')) e.stopPropagation();
                    if (!model.clipboard.element) return;
                    // 复制的元素模型
                    var clipboardElement = model.clipboard.element;
                    // 粘贴到新的元素模型上
                    var pasteElement = $.extend(true, {}, clipboardElement);
                    // 更新模型-元素id
                    pasteElement.id = 'wz_' + clipboardElement.type + '_' + (++model.history.index);
                    // 更新模型-currentIndex
                    var currentIndex = ++model.currentIndex;
                    currentIndex = String(currentIndex).length < 2 ? '0' + currentIndex : currentIndex;
                    // 更新模型-元素命名
                    pasteElement.name = defaultData[pasteElement.type].name + '_' + currentIndex;
                    // 更新模型-pageIndex
                    pasteElement.pageIndex = model.currentPage - 1;
                    // 相比原先位移10像素
                    pasteElement.style.left += 10;
                    pasteElement.style.top += 10;
                    // 插入到当前页模型中
                    model.pages[model.currentPage - 1].component[pasteElement.id] = pasteElement;
                    // 创建元素视图
                    model.tools[pasteElement.type + 'Component'].build(pasteElement);
                },
                // 粘贴动画
                pasteAnimation: function (e, $el) {
                    if ($el.hasClass('disabled')) e.stopPropagation();
                    if (!model.clipboard.animation) return;
                    // 粘贴动画到新的元素中
                    model.pages[model.currentPage - 1].component[model.currentId].animation = $.extend(true, {}, model.clipboard.animation);
                },
            }
        });
    }
};

module.exports = contextmenu;