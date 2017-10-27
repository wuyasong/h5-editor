var galleryWindowView = require('../../view/layer/galleryWindow.hbs'); // 图库弹窗视图

var gallery = {
    show: function(title, picList){
        var _this = this;
        $('.mask-layer').show();
        $('.gallery-window').show().html(galleryWindowView({title: title, gallery: picList}));
        $('.gallery-window').unbind('mousedown').bind('mousedown', function(e){ e.stopPropagation(); });
        $('.gallery-menu-closebtn').unbind('click').bind('click', function(){ _this.hide(); });
        // $('.gallery-item').unbind('click').bind('click', function(){ _this.hide(); });
    },
    hide: function(){
        $('.mask-layer').fadeOut();
        $('.gallery-window').fadeOut();
    }
};

module.exports = gallery;