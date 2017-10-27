var save = require('./save');
var store = require('../../store/dataSet');
var Cache = require('../common/cache');
var shareInfoView = require('../../view/layer/shareInfoWindow.hbs');
var setEdit = require('./setEdit');

function checkSize(file) {
    if (file.size > 2 * 1024 * 1024) {
        alert('请上传小于2MB的图片');
        return false;
    } else {
        return true;
    }
}

function checkType(file) {
    if (!/jpeg|jpg|png|bmp|gif/gi.test(file.type)) {
        alert('请上传jpg,png,bmp,gif类型图片');
        return false;
    } else {
        return true;
    }
}

function isEmptyObject(obj) {
    for (var key in obj) {
        return !1;
    }
    return !0;
}

var pageCtrls = {
    init: function(){
        var _this = this;
        // 赋值sessionId
        store.sessionid = window.edit_m.sid;
        // 点击保存
        $('.menu-btn-save').unbind('click').bind('click', this.saveHandler);
        // 点击获取二维码
        $('.menu-btn-qrcode').unbind('click').bind('click', this.getQrcodeHandler);
        // 点击下载
        $('.menu-btn-download').unbind('click').bind('click', this.downloadHandler);
        // 修改标题
        $('.menu-title-input').unbind('change').bind('change', this.titleChangeHandler);
        // 点击发布
        $('.menu-btn-release').unbind('click').bind('click', this.releaseHandler);
        // 悬浮显示提示层
        $('.menu-btn-icon').hover(function(){
            $('.menu-btn-tip').hide();
            $(this).siblings('.menu-btn-tip').fadeIn(100);
        }, function(){
            $(this).siblings('.menu-btn-tip').fadeOut(100);
        });
        // 悬浮显示提示层
        $('.main-toolbar-icon').hover(function(){
            $('.main-toolbar-tip').hide();
            $(this).siblings('.main-toolbar-tip').fadeIn(100);
        }, function(){
            $(this).siblings('.main-toolbar-tip').fadeOut(100);
        });
        // 点击设置
        $('.aside-menu-set').unbind('click').bind('click', this.setEditHandler);
        $(document).bind('contextmenu', function() {
            return false;
        });
        // 关闭图层列表
        $('.layer-ctrls-close').unbind('click').bind('click', function() {
            // 更新视图
            $('.layer-ctrls-box').hide();
            // 更新模型
            store.setOptions.isShowLayer = false;
        });
        // 开启图层列表
        $('.menu-main-ctrls-layer').unbind('click').bind('click', function() {
            // 更新视图
            $('.layer-ctrls-box').show();
            // 更新模型
            store.setOptions.isShowLayer = true;
        });
        if (isEmptyObject(store.elements)) {
            $('.layer-ctrls-list').html('<li class="default-layer-item">还没有添加元素</li>');
        }
    },
    // 点击保存操作
    saveHandler: function(){
        if (store.title) {
            save.start(1);
        } else {
            alert('请输入网页标题！');
        }
    },
    // 点击获取二维码操作
    getQrcodeHandler: function(){
        var $dialog = $(this).children('.menu-qrcode-dialog');
        if ($dialog.is(':hidden')) {
            $(this).children('.menu-btn-tip').hide();
            $dialog.fadeIn();
        } else {
            $dialog.fadeOut();
        }
    },
    downloadHandler: function(){
        $(this).children('.menu-btn-tip').hide();
        window.location.href = '/m/download/' + window.edit_m.sid + '?title=' + store.title;
    },
    releaseHandler: function () {
        if (!store.title) {
            alert('请输入网页标题！');
            return;
        }
        // 显示分享消息设置弹窗
        $('.mask-layer').show();
        $('.shareInfo-window').html(shareInfoView(store)).show();
        $('.shareInfo-menu-closebtn,.shareInfo-cancel-btn').unbind('click').bind('click', function () { $('.shareInfo-window').hide(); $('.mask-layer').hide(); });
        $('.shareInfo-ok-btn').unbind('click').bind('click', function () { $('.shareInfo-window').hide(); $('.mask-layer').hide(); save.start(2); });
        // 修改分享标题
        $('.set-shareInfo-title').unbind('change').bind('change', pageCtrls.titleChangeHandler);
        // 修改分享描述
        $('.set-shareInfo-description').unbind('change').bind('change', pageCtrls.descriptionChangeHandler);
        // 修改分享图片
        $('.set-shareInfo-img-input').unbind('change').bind('change', function(){ pageCtrls.uploadImgHandler(this); });
    },
    setEditHandler: function () {
        setEdit.init();
    },
    // 更新标题操作
    titleChangeHandler: function(){
        store.title = this.value;
        if (!store.description) 
            store.description = this.value;
    },
    descriptionChangeHandler: function(){
        store.description = this.value;
    },
    uploadImgHandler: function (input) {
        var _this = this,
            formData = new FormData(),
            file = input.files[0];

        // 检测图片类型
        if (!checkType(file)) return;
        // 检测图片大小
        if (!checkSize(file)) return;
        // 添加表单项
        formData.append('container_bg', file);
        // 显示loading层
        $('.loading-window').show();
        // 上传至服务器操作
        $.ajax({
            url: '/m/uploadImg',
            type: 'POST',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(res){
                var id = store.currElemId;
                imageObj = {src: res.path, width: res.width, height: res.height};
                // 移除loading层
                $('.loading-window').fadeOut();
                // 存储至本地缓存
                Cache.add('edit_m_img', imageObj);
                // 更新状态视图和模型
                $('.set-shareInfo-img').css('background-image', 'url(' + res.path + ')');
                store.shareImg = res.path;
            },
            error: function(){
                alert('上传图片失败');
                // 移除loading层
                $('.loading-window').fadeOut();
            }
        });
    }
};

module.exports = pageCtrls;