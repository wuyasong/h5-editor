var layerView = require('../../view/layer/layerCtrls.hbs');
var store = require('../../store/dataSet');

var layerCtrls = {
    // 显示隐藏图层
    toggle: function ($layerItemLook) {
        var id = $layerItemLook.parent('li').attr('data-elemId');
        if ($layerItemLook.hasClass('block')) { 
            // 更新视图
            $layerItemLook.addClass('none').removeClass('block');
            $('#' + id).hide();
            // 更新模型
            store.elements[id].style.display = 'none';
        } else {
            // 更新视图
            $layerItemLook.addClass('block').removeClass('none');
            $('#' + id).show();
            // 更新模型
            store.elements[id].style.display = 'block';
        }
    },
    // 图层列表插入一条
    insert: function (name, elem, updateCurrTools) {
        var _this = this;
        var idx = getIndex(elem);
        var layerItem = layerView({name: name + toFormatNumber(idx), elem: elem});
        // 渲染当前图层
        $('.layer-ctrls-list').prepend(layerItem);
        // 绑定点击事件 - 更新选中元素
        $('.layer-ctrls-list li[data-elemId=' + elem.id + '] .layer-ctrls-item-txt')
            .bind('mousedown', function (e) { e.stopPropagation(); })
            .bind('click', function (e) { updateCurrTools($(this).parent().attr('data-elemId')); });
        // 绑定点击事件 - 显示隐藏元素
        $('.layer-ctrls-list li .layer-ctrls-item-look')
            .bind('mousedown', function (e) { e.stopPropagation(); })
            .unbind('click').bind('click', function (e) { _this.toggle($(this)); });

        $('.default-layer-item').hide();
    },
    // 图层列表删除一条
    delete: function (id) {
        $('.layer-ctrls-list li[data-elemId=' + id + ']').remove();
        if (isEmptyObject(store.elements)) {
            $('.layer-ctrls-list').html('<li class="default-layer-item">还没有添加元素</li>');
        }
    },
    active: function (id) {
        $('.layer-ctrls-list li[data-elemId=' + id + ']').addClass('active').siblings().removeClass('active');
    }
};

function isEmptyObject(obj) {
    for (var key in obj) {
        return !1;
    }
    return !0;
}

function getIndex(obj) {
    var index = 0;
    for (var key in store.elements) {
        ++index;
        if (obj.id === key) {
            return index;
        }
    }
    // return index;
}

function toArray(elems) {
    var array = [];
    for (var key in elems) {
        array.push(elems[key]);
    }
    return array;
}

function toFormatNumber(index) {
    return String(index).length < 2 ? ('0' + index) : index;
}

module.exports = layerCtrls;