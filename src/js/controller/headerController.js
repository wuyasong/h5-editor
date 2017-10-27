var $ = require('jquery');
// 全局数据堆
var appstore = require('appStore');
// 引入dialog类
var dialog = require('../lib/dialog.class.js');


function headerControls() {
    $('.expand_logo').unbind('click').bind('click', function () {
        console.info(appstore.pages);
    });
    // 如果是编辑应用 更新模型视图
    if (exp.store) {
        // appstore = exp.store;
        $('#expand-title').val(appstore.expandTitle);
    }
    // 专题标题处理
    $('#expand-title').unbind('keyup').bind('keyup', titleHandler);
    // 保存页面
    $('#savePage').unbind('click').bind('click', saveHandler);
    // 发布页面
    $('#putPage').unbind('click').bind('click', putHandler);
    // 作品列表
    $('.button_applistbox').unbind('click').bind('click', applistHandler);
    // 设置选项
    $('.preview_setBox').unbind('click').bind('click', setBoxHandler);
}

function applistHandler() {
    if ($('.applist').css('display') === 'none') {
        // $('.applist').show();
        $.ajax({
            type: 'GET',
            url: '/h5/getapplist?ran=' + Math.random(),
            success: function(data) {
                var data = JSON.parse(data);
                // 成功弹层
                if (data.retcode == 1) {
                    var str = '';
                    for (var i = 0; i < data.applist.length; i++) {
                        str += '<li><a href="http://' + window.location.host + '/?id=' + data.applist[i].sessionid + '" target="_blank">' + data.applist[i].title + '</a></li>';
                    }
                    $('.applist').html(str).show();
                    // $('.applist').html('<li><a href="">62d294bf-dbeb-4ff7-a10b-eeb72268b2ac</a></li>')
                } else if (data.retcode == -1) {}
            },
            error: function(xhr, status, err) {}
        });
    } else {
        $('.applist').hide();
    }
}

function titleHandler() {
    // 存储专题标题
    appstore.expandTitle = this.value;
}

// 设置弹窗操作
function setBoxHandler() {
    // 显示设置弹窗
    $('.mask_layer').html(appstore.template.setLayer()).show();
    // 点击关闭按钮移除弹窗
    $('#setBox_closeBtn').unbind('click').bind('click', function() {
        $('.mask_layer').hide();
    });
    // 点击开启关闭状态按钮
    $('.setItem').unbind('click').bind('click', function() {
        var option = $(this).attr('data-options');
        if (appstore.setOptions[option] === false) {  // 开启他
            appstore.setOptions[option] = true;
            $(this).children('.setItem_btn').removeClass('setItem_close').addClass('setItem_open');
        } else {  // 关闭他
            appstore.setOptions[option] = false;
            $(this).children('.setItem_btn').removeClass('setItem_open').addClass('setItem_close');
        }
    });
}

// 保存操作
function saveHandler(succ_callback, fail_callback) {

    var store;
    // 检测title是否为空 
    if (!appstore.expandTitle) {
        alert('请输入专题名称！');
        return;
    }
    // console.info(appstore);
    // 序列化数据 UIitem(object) -> elems(array)
    formatData();
    // 提交存入数据库分别对应字段
    store = {
        sessionid: exp.sessionid,
        title: appstore.expandTitle, // 应用标题
        page: appstore.expandPage,  // 页数
        object: appstore.pages,  // object对象，所有UIItem集合
        music: appstore.music,  // 背景音乐
        audioList: appstore.audioList, // 音频列表
        shareImg: appstore.shareImg,  //分享图
        setOptions: appstore.setOptions  // 配置选项
    };
    console.info(store);
    // 提交时存入数据库store字段
    var obj = {
        expandTitle: appstore.expandTitle,
        expandPage: appstore.expandPage,
        currentPage: appstore.currentPage,
        music: appstore.music,
        audioList: appstore.audioList, // 音频列表
        state: appstore.state,
        UIArr: appstore.UIArr,
        pages: appstore.pages,  // 页对象
        shareImg: appstore.shareImg,
        setOptions: appstore.setOptions
    };
    // console.info(appstore.pages);
    // 存本地存储
    // localStorage.h5_expand_store = JSON.stringify(store);

    // 发送POST请求 存储到数据库
    $.ajax({
        type: 'POST',
        url: '/h5/toSave?ran=' + Math.random(),
        data: {
            zt: JSON.stringify(store),
            sessionid: exp.sessionid,
            // data: JSON.stringify(store)
            // store: JSON.stringify(obj)
        },
        success: function(data) {
            var data = JSON.parse(data);
            // 成功弹层
            if (data.retcode == 1) {
                dialog.show('保存成功');
                if (typeof succ_callback == 'function') {
                    succ_callback();
                }
            } else if (data.retcode == -1) {
                dialog.show('保存失败');
                if (typeof fail_callback == 'function') {
                    fail_callback();
                }
            }
        },
        error: function(xhr, status, err) {
            // 失败弹层
            alert('保存失败，网络错误');
            if (typeof fail_callback == 'function') {
                fail_callback();
            }
            console.info(err);
        }
    });
}

// 发布操作
function putHandler() {
    // 先保存数据 
    // 成功回调：二维码链接弹窗
    saveHandler(function() {
        // 显示二维码弹窗
        $('.mask_layer').html(appstore.template.qrcodeLayer(exp.sessionid)).show();
        // 点击关闭按钮移除弹窗
        $('.releasebox_closebtn').unbind('click').bind('click', function() {
            $('.mask_layer').hide();
        });
    });
}

// 序列化要保存的数据
function formatData() {
    // 枚举每一页
    for (var i = 0; i < appstore.expandPage; i++) {
        appstore.pages[i].elems = [];
        // 枚举每一页的UI元素对象
        var UIitem = appstore.pages[i].UIitem;
        for (var key in UIitem) {
            if (/image_/g.test(key)) {
                var width = UIitem[key].styles.width;
                var height = UIitem[key].styles.height;
                // 设置图片实际缩放尺寸
                UIitem[key].styles.act_width = width * 2;
                UIitem[key].styles.act_height = height * 2;
            }
            appstore.pages[i].elems.push(UIitem[key]);
        }
    }
}


module.exports = headerControls;