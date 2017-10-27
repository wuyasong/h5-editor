var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');

var initColor = store.preview.backgroundColor;

function setPageHeight(value){
    updateCurrTools();
    // 更新表单视图
    $('.set-body-height').val(value);
    // 更新预览视图
    $('.main-preview-wrapper,.main-preview').height(value);
    // 更新模型
    store.preview.height = value;
}
// 更新元素，编辑工具
function updateCurrTools(){
    $('.main-toolbar-body-icon').addClass('active');
    // 更新当前选中元素id
    store.currElemId = null;
    // 更新当前选中编辑工具
    store.currEditTool = 'page';
    // 添加拖拽框
    $('.main-preview-wrapper').addClass('active');
    // 显示右侧表单栏
    $('.aside-options-page').show().siblings().hide();
}

var bodyCtrls = function(){
    this.init();
};

bodyCtrls.prototype = {
    init: function(){
        var _this = this;
        $('.set-body-height').unbind('change').bind('change', this.styleChangeHandler);
        // $('.set-body-bgcolor').ColorPicker({
        //     color: store.preview.backgroundColor,
        //     onSelect: function(hsb, hex, rgb){ _this.bgcolorSelectHandler(hsb, hex, rgb); }, 
        //     onChange: this.bgcolorChangeHandler,
        //     onShow: function(hsb, hex, rgb){ 
        //         initColor = store.preview.backgroundColor;
        //     }
        // });
        $('.set-body-bgcolor').jPicker({ window: { expandable: true }, color: { active: new $.jPicker.Color({ hex: store.preview.backgroundColor }) } }, this.bgcolorChangeHandler, this.bgcolorChangeHandler, this.bgcolorChangeHandler);
        $('.set-body-fullScreen').unbind('click').bind('click', this.fullScreenHandler);
    },
    // 高变化操作
    styleChangeHandler: function(){
        var _this = this;
        var value = this.value;
        // 缓存上一个状态
        var oldValue = store.preview.height;
        // 缓存当前状态
        var newValue = value;
        // 更新预览视图
        $('.main-preview-wrapper,.main-preview').height(value);
        // 更新模型
        store.preview.height = value;
        // 添加历史记录
        vm.execute({
            undo: setPageHeight.bind(_this, oldValue),
            execute: setPageHeight.bind(_this, newValue), 
            title: '修改页面高度'
        });
    },
    fullScreenHandler: function () {
        if (store.fullScreen) {
            // 修改模型
            store.fullScreen = false;
            // 修改表单视图
            $(this).removeClass('checked');
            // 修改预览视图
            $('.set-body-height').val(store.preview.height);
            $('.main-preview-wrapper,.main-preview').height(store.preview.height);
        } else {
            // 修改模型
            store.fullScreen = true;
            // 修改表单视图
            $(this).addClass('checked');
            // 修改预览视图
            $('.set-body-height').val(504);
            $('.main-preview-wrapper,.main-preview').height(504);
        }
    },
    // 修改背景颜色
    bgcolorChangeHandler: function(color, context){
        // $('.set-body-bgcolor-selected').html('#' + hex);
        // $('.set-body-bgcolor-icon').css('background', '#' + hex);
        var hex = color.val('hex');
        // 更新预览视图模型
        $('.main-preview').css('backgroundColor', hex ? ('#' + hex) : 'transparent');
        store.preview.backgroundColor = hex ? ('#' + hex) : 'transparent';
    },
    // bgcolorSelectHandler: function(hsb, hex, rgb){
    //     // 添加历史记录
    //     vm.execute({
    //         undo: this.bgcolorChangeHandler.bind(this, null, initColor.substring(1), null),
    //         execute: this.bgcolorChangeHandler.bind(this, null, hex, null), 
    //         title: '修改页面背景颜色', 
    //     });
    // }
};

module.exports = bodyCtrls;