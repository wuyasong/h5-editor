var store = require('../../store/dataSet');
var setEditView = require('../../view/layer/setEditWindow.hbs');

var setEdit = {
    init: function () {
        var _this = this;
        $('.mask-layer').show();
        $('.set-edit-window').show().html(setEditView({title: '设置', isOpenLikes: store.setOptions.isOpenLikes, isOpenCmt: store.setOptions.isOpenCmt}));
        $('.set-edit-window').unbind('mousedown').bind('mousedown', function(e){ e.stopPropagation(); });
        $('.setEdit-menu-closebtn').unbind('click').bind('click', function(){ _this.hide(); });
        // 监听开启关闭操作
        $('.setEdit-check').unbind('change').bind('change', function () { _this.setEditHandler(this); });
    },
    hide: function(){
        $('.mask-layer').fadeOut();
        $('.set-edit-window').fadeOut();
    },
    setEditHandler: function (self) {
        // 
        var isOpen = $(self).is(':checked');
        var checkboxType = $(self).attr('data-check');
        if (checkboxType === 'likes') {
            // 修改模型
            store.setOptions.isOpenLikes = isOpen;
        } else if (checkboxType === 'cmt') {
            // 修改模型
            store.setOptions.isOpenCmt = isOpen;
        }
    }
};

module.exports = setEdit;