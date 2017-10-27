var layerView = require('../../views/win/layerItem.tpl');
var component = require('./common');

var layer = {
    render: function () {
        var currentPage = model.currentPage - 1,
            store = model.pages[currentPage].component,
            data = toArray(store);

        $('.layerlist').html(layerView(data));
        this.initEvent();
    },
    initEvent: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: [
                '.layerlist-item-look', 
                '.layerlist-item-txt', 
                '.win-layerlist-close', 
                '.win-layerlist-header'
            ],
            methods: {
                /**
                 * 新建文本事件回调
                 * 创建文本元素
                 * 添加历史记录
                 */
                toggleElement: this.toggleElement,
                selectElement: this.selectElement,
                /**
                 * 关闭弹层
                 */
                closeWin: function (e, $el) {
                    // 更新模型 设置-开启图层列表
                    model.setOptions.isShowLayer = false;
                    // 更新设置弹窗视图
                    $('.pageset-item-showlayer-checkbox').removeClass('checked');
                    $el.parents('.window-layerlist').hide();
                },
                // 图层弹窗按下操作
                layer_dragstart: function (e, $el) {
                    var $layer = $('.layerlist-box');
                    var oriX = e.pageX;
                    var oriY = e.pageY;
                    var offsetLeft = parseInt($layer.css('left'));
                    var offsetTop = parseInt($layer.css('top'));
                    $(document).on('mousemove', function(e){ 
                        _this.moveLayer(e, oriX, oriY, offsetLeft, offsetTop); 
                    });
                    $(document).on('mouseup', function(e){ 
                        $(document).off('mousemove').off('mouseup'); 
                    });
                }
            }
        });
        // 列表项绑定悬浮事件（悬浮时添加高亮）
        $('.layerlist li').hover(function () {
            var id = $(this).attr('data-id');
            $('#' + id).addClass('hover').siblings().removeClass('hover');
        }, function () {
            var id = $(this).attr('data-id');
            $('#' + id).removeClass('hover');
        });
    },
    toggleElement: function (e, $el) {
        var id = $el.attr('data-id'),
            currentPage = model.currentPage - 1,
            store = model.pages[currentPage].component;
        if ($el.hasClass('block')) { 
            // 更新视图
            $el.addClass('none').removeClass('block');
            $('#' + id).hide();
            // 更新模型
            store[id].style.display = 'none';
        } else {
            // 更新视图
            $el.addClass('block').removeClass('none');
            $('#' + id).show();
            // 更新模型
            store[id].style.display = 'block';
        }
    },
    selectElement: function (e, $el) {
        component.updateEditState($el.attr('data-id'), $el.attr('data-type'));
        component.updateDragState();
        component.panel.updateComponentController($el.attr('data-type'));
    },
    // 图层弹窗移动操作
    moveLayer: function (e, oriX, oriY, offsetLeft, offsetTop) {
        var $layer = $('.layerlist-box');
        e.preventDefault();
        // 移动图层弹窗
        $layer.css({
            left: e.pageX - oriX + offsetLeft,
            top: e.pageY - oriY + offsetTop
        });
    }
};

function toArray(elems) {
    var array = [];
    for (var key in elems) {
        array.push(elems[key]);
    }
    return array;
}

module.exports = layer;