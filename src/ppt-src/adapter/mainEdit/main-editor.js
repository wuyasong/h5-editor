var mainEditItemView = require('../../views/mainEdit/editlist_empty.tpl');
var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var layerlist = require('../component/layer');
var component = require('../component/common');
var view = {
    text: require('../../views/mainEdit/textPlugin.tpl'),
    view: require('../../views/mainEdit/divPlugin.tpl'),
    button: require('../../views/mainEdit/buttonPlugin.tpl'),
    image: require('../../views/mainEdit/imagePlugin.tpl'),
    audio: require('../../views/mainEdit/audioPlugin.tpl'),
    video: require('../../views/mainEdit/videoPlugin.tpl')
};

var mainEdit = {
    // 新建一页主编辑视图
    createPage: function (index) {
        // 添加主编辑区视图
        $('.main-preview-page-item').eq(index).after(mainEditItemView( model.pages[index+ 1] ));
        // 更新选中主编辑区
        $('.main-preview-page-item').eq(index + 1).show().siblings('.main-preview-page-item').hide();
    },
    // 删除一页主编辑视图
    deletePage: function (index) {
        $('.main-preview-page-item').eq(index).remove();
        // 更新选中主编辑区
        $('.main-preview-page-item').eq(index - 1 < 0 ? 0 : index - 1).show().siblings('.main-preview-page-item').hide();
    },
    // 选择一页主编辑视图
    selectPage: function (index) {
        $('.main-preview-page-item').eq(index).show().siblings('.main-preview-page-item').hide();
    },
    /**
     * 创建元素模型
     * 继承默认模型
     * 元素索引表模型添加数据
     * 创建DOM元素
     */
    createElement: function (data, type, img) {
        var currentPage,
            elemId,
            currentIndex,
            store;
        if (data) {
            model.currentPage = Number(data.pageIndex) + 1;
            currentPage = model.currentPage - 1;
            elemId = data.id;
            store = model.pages[currentPage].component[elemId];
            model.elemKey[elemId] = {
                data: store
            };
        } 
        else {
            currentPage = model.currentPage - 1;
            elemId = 'wz_' + type + '_' + (++model.history.index);
            store = model.pages[currentPage].component[elemId] = $.extend(true, {id: elemId, pageIndex: currentPage}, defaultData[type], defaultData.animate);
            currentIndex = ++model.currentIndex;
            currentIndex = String(currentIndex).length < 2 ? '0' + currentIndex : currentIndex;
            store.name = store.name + '_' + currentIndex; // 元素命名
            store.events = [];
            model.elemKey[elemId] = {
                data: store
            };
            // 创建元素为图片
            if (img) {
                var width, height;
                // 图片本身宽度大于视口宽度 -> 缩放到视口宽度比例
                if (img.width > model.preview.width) {
                    width = model.preview.width;
                    height = parseInt(model.preview.width / (img.width / img.height));
                } 
                // 图片本身宽度小于等于视口宽度
                else {
                    width = img.width;
                    height = img.height;
                }
                // 元素模型赋值为图片对象的属性
                store.src = img.src;
                store.style.width = width;
                store.style.height = height;
            }
        }
        // 创建DOM元素
        $('.main-preview-page-item').eq(currentPage).append(view[type](store));
        $('.main-options-body-' + type).show().siblings().hide();

        return elemId;
    },
    // 销毁元素
    destoryElement: function (id) {
        var currentPage = model.currentPage - 1;
        // 删除索引表中元素
        delete model.elemKey[id];
        // 删除模型内元素
        delete model.pages[currentPage].component[id];
        // 销毁主编辑区视图
        $('#' + id).remove();
        // 删除图层列表视图
        layerlist.render();
        component.resetModel();
    },
    // 修改元素属性
    setProps: function (key, value, type) {
        var currentId = model.currentId;
        if (type === 'style') {
            // 基础样式则修改外层属性
            if (key === 'width' || key === 'height' || key === 'zIndex' || key === 'left' || key === 'top') {
                $('#' + currentId).css(key, value);
                if (key === 'height') $('#' + currentId + ' .drag-ele').css('line-height', value + 'px');
            }
            // 元素特有样式则修改内层属性
            else {
                $('#' + currentId + ' .txtEditor').css(key, value);
                $('#' + currentId + ' .drag-ele').css(key, value);
            }
        } else if (type === 'props') {
            $('#' + currentId + ' .drag-ele')[key](value);
        }
    },
    setImage: function (img) {
        var currentId = model.currentId;
        $('#' + currentId + ' .drag-ele-img').attr('src', img.src);
        $('#' + currentId).css('width', img.width);
        $('#' + currentId).css('height', img.height);
    }
};

module.exports = mainEdit;