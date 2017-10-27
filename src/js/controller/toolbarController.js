var $ = require('jquery');
// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('../comm/toolbar.model.js');
// toolbar font 操作
var toolbar_font = require('../comm/toolbar.font.handler.js');
// toolbar background 操作
var toolbar_background = require('../comm/toolbar.background.handler.js');
// toolbar button 操作
var toolbar_button = require('../comm/toolbar.button.handler.js');
// toolbar image 操作
var toolbar_image = require('../comm/toolbar.image.handler.js');
// toolbar music 操作
var toolbar_music = require('../comm/toolbar.music.handler.js');
// toolbar animate 操作
var toolbar_animate = require('../comm/toolbar.animate.handler.js');
// toolbar shareImg 操作
var toolbar_shareImg = require('../comm/toolbar.shareImg.handler.js');
// toolbar moreAudio
var toolbar_moreAudio = require('../comm/toolbar.moreAudio.handler.js');

document.oncontextmenu = function() {
    return false;
};

function navTab() {
    var index = $(this).index();
    $(this).addClass('current').siblings().removeClass('current');
    $('.toolbar_box').eq(index).show().siblings().hide();
    // $('.toolbar_box').eq(index).find('')
}

function toolbarControls() {
    // $.ajax({
    //     type: 'GET',
    //     url: '/searchSongInfo?avid=1777&sourceType=2',
    //     success: function (params) {
    //         console.info(params);
    //     }
    // });
    // 如果是编辑应用 更新模型视图
    if (exp.store) {
        // 更新背景音乐
        if (appstore.music.src) {
            toolbar_music.add(appstore.music.src);
        }
        // 更新分享图
        if (appstore.shareImg) {
            toolbar_shareImg.setImage(appstore.shareImg);
        }
        // // 更新audioList及添加音频界面
        // if (appstore.audioList.length) {
        //     toolbar_moreAudio(appstore.audioList[0]);
        // }
        // 输出配置选项
        if (exp.store.setOptions !== undefined) {
            // if (exp.store.setOptions.comment) {
                appstore.setOptions.comment = exp.store.setOptions.comment;
                exp.store.setOptions.comment ? $('#setItem_btn_comment').removeClass('setItem_open').addClass('setItem_close'): $('#setItem_btn_comment').removeClass('setItem_close').addClass('setItem_open');
            // }
            // if (exp.store.setOptions.like) {
                appstore.setOptions.like = exp.store.setOptions.like;
                exp.store.setOptions.like ? $('#setItem_btn_like').removeClass('setItem_open').addClass('setItem_close'): $('#setItem_btn_comment').removeClass('setItem_close').addClass('setItem_open');
            // }
        }
        // 遍历页对象
        for (var i = 0; i < appstore.expandPage; i++) {
            appstore.currentPage = i;
            toolbar_background.add();
            // 遍历UI元素
            for (var key in appstore.pages[i].UIitem) {
                var UIitem = appstore.pages[i].UIitem[key];
                var type = UIitem.type;
                var id = UIitem.id;
                switch (type) {
                    case 'font':
                        toolbar_font.add(i, id);
                        break;
                    case 'button':
                        toolbar_button.add(i, id);
                        break;
                    case 'image':
                        // 更新第一页audioList及添加音频界面
                        if (i === 0 && UIitem.audio && UIitem.audio.imgId) {
                            toolbar_moreAudio.add(UIitem.audio);
                        }
                        toolbar_image.add(UIitem.src, id, UIitem.styles.width, UIitem.styles.height, i);
                        break;
                }
                // appstore.pages[i].UIitem[key]
            }
        }
        appstore.currentPage = 0;
    }

    $('.toolbar_form_ani').html(appstore.template.animationBox());
    // toolbar导航切换操作
    $('#toolbarNavList li').unbind('click').bind('click', navTab);

    // 创建文本操作 及 其他文本操作
    $('#create_font').unbind('click').bind('click', function(event) {
        event.stopPropagation();
        // 为文本添加各事件
        toolbar_font.create();
    });

    // 背景操作
    $('#create_bg_img').unbind('change').bind('change', function() {
        toolbar_background.changeImage(this);
    });
    $('#toolbar_bg_color').unbind('change').bind('change', function() {
        toolbar_background.changeColor(this);
    });

    // 创建按钮操作 及 其他按钮操作
    $('#create_button').unbind('click').bind('click', function(event) {
        // event.stopPropagation();
        // 为文本添加各事件
        toolbar_button.create();
    });

    // 上传图片操作
    $('#create_img').unbind('change').bind('change', function() {
        toolbar_image.create(this);
    });

    // 上传歌曲操作
    $('#create_music').unbind('change').bind('change', function() {
        toolbar_music.create(this);
    });

    // 删除歌曲操作
    $('#del_music').unbind('click').bind('click', function() {
        toolbar_music.realease(this);
    });

    // 各种动画按钮操作
    toolbar_animate.open();
    // $('.animate_button').unbind('click').bind('click', function(){
    // 	toolbar_animate.open(this);
    // });

    // 上传分享图操作
    $('#create_shareImg').unbind('change').bind('change', function() {
        toolbar_shareImg.create(this);
    });

    // 删除分享图操作
    $('#create_item_shareImg_close').unbind('click').bind('click', function() {
        var r = confirm('确认删除图片？');
        if (r) {
            // DOM移除
            $('#create_item_shareImg_thumbPic').css('background-image', '');
        }
    });

    // 切换动画导航操作
    $('.widget_menu li').unbind('click').bind('click', function() {
        var classname = $(this).attr('data-classname');
        // var siblingItem = $(this).siblings().attr('data-nav');
        $(this).addClass('current').siblings().removeClass('current');
        $('.' + classname).show().siblings('.toolbar_tab_body').hide();
        // $('#' + siblingItem).hide();
        // 拉取图片库数据
        if (classname === 'toolbar_tab_img_lib') {
            toolbar_image.getImgLib();
        }
    });

    // 添加多音频操作
    toolbar_moreAudio.init();

    // alert(2)
    $('.preloadLayer').hide().remove();
}

module.exports = toolbarControls;