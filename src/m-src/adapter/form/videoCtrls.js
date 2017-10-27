var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');
var Cache = require('../common/cache');
var videoWindowView = require('../../view/layer/videoWindow.hbs'); // 选择视频弹窗视图

var placeholderArr = ['输入用户作品ID', '输入曲库ID', '输入视频链接'];
var imageObj = {};
var defaultVideoIcon = '/images/video_poster_icon.png';

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

// 显示视频弹窗
function onVideoWindowShow(){
    var currElem = store.elements[store.currElemId];
    $('.mask-layer').show();
    $('.video-window').show().html(videoWindowView(currElem));
    $('.set-video-selectedType').unbind('click').bind('click', onVideoSelectTypeShow);
    $('.video-select-list li').unbind('click').bind('click', VideoSelectType);
    $('.set-video-search').unbind('click').bind('click', onVideoSearch);
    $('.video-ok-btn').unbind('click').bind('click', this.selectedVideo.bind(this));
    $('.video-cancel-btn').unbind('click').bind('click', closeVideoWindow);
    $('.video-menu-closebtn').unbind('click').bind('click', closeVideoWindow);
    $('.video-name, .video-view').unbind('click').bind('click', playPauseVideo);
}
// 播放视频
function playPauseVideo(){
    var $video = $('#videoCtrls');
    if ($video[0].src && $video[0].paused) {
        $video.get(0).play();
    } else {
        $video.get(0).pause();
    }
}
// 选择类型列表显示
function onVideoSelectTypeShow(){
    var $selectList = $('.video-select-list');
    $selectList.is(':hidden') ? $selectList.show() : $selectList.hide();
}
// 选择类型
function VideoSelectType(){
    var $selectList = $('.video-select-list');
    var index = $(this).index();
    $selectList.hide();
    $('.video-selected').html(this.innerHTML);
    $('.set-video-url-input').attr('placeholder', placeholderArr[index]);
    $('.set-video-url-input').attr('data-type', parseInt(index + 1));
}
// 搜索视频
function onVideoSearch(){
    var _this = this; // 指向set-video-search按钮
    var $input = $('.set-video-url-input');
    var sourceType = $input.attr('data-type');
    var val = $input.val();
    if (sourceType === '3') {
        if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi.test(val)) {
            alert('请输入正确视频地址');
            return;
        }
        // 显示歌曲信息
        $('.video-name').html(val);
        // 使用视频按钮赋值视频src
        $('.video-ok-btn').attr('data-src', val);
        $('#videoCtrls').attr('src', val);
        return;
    }
    else if (sourceType === '1' || sourceType === '2') {
        if (!/[0-9]+/g.test(val)) {
            alert('请输入正确id');
            return;
        }
        searchMVInfo(sourceType, val);
    }
}
function searchMVInfo(sourceType, val){
    $.ajax({
        type: 'GET',
        url: '/h5/searchSongInfo?avid=' + val + '&sourceType=' + sourceType + '&ran=' + Math.random(),
        success: function (params) {
            var data = JSON.parse(params),
                songUrl, singer, songName;

            if (sourceType === '1') {
                // 没有查到MV信息
                if (!data.spaceav) {
                    alert('没有查到MV信息');
                    return;
                }
                songUrl = data.spaceav.fileURL;
                singer = data.spaceav.nickName;
                songName = data.spaceav.name;
            } else if (sourceType === '2') {
                // 没有查到MV信息
                if (!data.fileMV) {
                    alert('没有查到MV信息');
                    return;
                }
                songUrl = data.fileMV;
                singer = data.singerName;
                songName = data.name;
            }

            // 显示歌曲信息
            $('.video-name').html(songName + ' - ' + singer);
            // 使用视频按钮赋值视频src
            $('.video-ok-btn').attr('data-src', songUrl);
            $('#videoCtrls').attr('src', songUrl);
        },
        error: function () {
            alert('查询歌曲信息失败');
        }
    });
}

// 关闭视频弹窗
function closeVideoWindow(){
    $('.mask-layer').fadeOut();
    $('.video-window').fadeOut();
}
// 更新视频信息视图模型
function updateVideoInfo(id, info, src){
    vm.updateCurrTools(id, 'video');
    info = info == '' ? '请选择视频' : info;
    $('.set-video-src-desc').html(info);
    // 更新模型
    store.elements[store.currElemId].src = src;
    store.elements[store.currElemId].info = info;
}

// 更新默认图
function setPoster(id, poster){
    vm.updateCurrTools(id, 'video');
    // 设置播放暂停icon
    if (poster) {
        $('.set-video-poster').css('backgroundImage', 'url(' + poster + ')');
    } else {
        $('.set-video-poster').css('backgroundImage', '');
    }
    // 更新预览视图模型
    if (poster) {
        $('#' + store.currElemId).children('.drag-ele').css('backgroundImage', 'url(' + poster + ')');
    } else {
        $('#' + store.currElemId).children('.drag-ele').css('backgroundImage', 'url(' + defaultVideoIcon + ')');
    }
    store.elements[store.currElemId].poster = poster;
}

var videoCtrls = function(){
    this.init();
};

videoCtrls.prototype = {
    init: function(){
        var _this = this;
        $('.video-window').unbind('mousedown').bind('mousedown', function(e){e.stopPropagation();});
        $('.set-video-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-video-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-video-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-video-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-video-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-video-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        // 层级设置
        $('.set-video-zIndex').unbind('keyup').bind('keyup', function(){ _this.zIndexChangeHandler(this.value) });
        $('.set-video-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.set-video-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        // 视频地址设置
        $('.set-video-src').unbind('click').bind('click', onVideoWindowShow.bind(this));
        // 视频默认图设置
        $('.set-video-poster-input').unbind('change').bind('change', function(){ _this.uploadPosterHandler(this); });
    },
    // 尺寸宽高变化操作
    styleChangeHandler: function(){
        if (!store.currElemId) return;
        var _this = this;
        var key = $(this).attr('data-key');
        var value = this.value;
        var style = store.elements[store.currElemId].style;
        // 缓存上一个状态
        var oldValue = { id: store.currElemId, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
        // 缓存当前状态
        var newValue = { id: store.currElemId, offsetX: style.left, offsetY: style.top, width: style.width, height: style.height };
        if (key === 'width') {
            newValue.width = value;
        } else if (key === 'height') {
            newValue.height = value;
        } else if (key === 'left') {
            newValue.offsetX = value;
        } else if (key === 'top') {
            newValue.offsetY = value;
        }
        // 更新预览视图模型
        vm.setPreViewModel(key, value);
        // 获取当前
        // 缓存当前元素id，放到闭包内
        var id = store.currElemId;
        // 添加历史记录
        vm.execute({
            undo: vm.move.bind(_this, oldValue, function () { try { vm.updateCurrTools(id, 'video'); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { vm.updateCurrTools(id, 'video'); } catch(ex){} }), 
            title: '移动视频元素', 
        });
    },
    zIndexChangeHandler: function(value, callback){
        callback ? callback() : void 0;
        if (!store.currElemId) return;
        var id = store.currElemId;
        if (!callback) {
            // 添加历史记录
            vm.execute({
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'video'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'video'); } catch(ex){} }), 
                title: '修改视频层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-video-zIndex');
        var value = parseInt(elem[0].value);
        value = value + 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexReduceHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-video-zIndex');
        var value = parseInt(elem[0].value);
        value = value - 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    selectedVideo: function(){
        if (!$('.video-ok-btn').attr('data-src')) {
            alert('请选择视频');
            return;
        }
        var id = store.currElemId;
        var currElem = store.elements[id];
        var info = $('.video-name').html();
        var src = $('.video-ok-btn').attr('data-src');
        // 添加历史记录
        vm.execute({
            undo: updateVideoInfo.bind(this, id, currElem.info, currElem.src),
            execute: updateVideoInfo.bind(this, id, info, src), 
            title: '修改视频信息', 
        });
        // 更新视频信息
        updateVideoInfo(id, info, src);
        // 关闭视频弹窗
        closeVideoWindow();
    },
    uploadPosterHandler: function(input){
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
                var oldValue = store.elements[store.currElemId].poster;
                var newValue = res.path;
                imageObj = {src: res.path, width: res.width, height: res.height};
                // 移除loading层
                $('.loading-window').fadeOut();
                // 存储至本地缓存
                Cache.add('edit_m_img', imageObj);
                // 更新状态视图和模型
                setPoster(id, res.path);
                // 添加历史记录
                vm.execute({
                    undo: setPoster.bind(_this, id, oldValue),
                    execute: setPoster.bind(_this, id, newValue), 
                    title: '修改视频默认图', 
                });
            },
            error: function(){
                alert('上传图片失败');
                // 移除loading层
                $('.loading-window').fadeOut();
            }
        });
    },
    updateFormView: function(){
        var currElem = store.elements[store.currElemId];
        // 更新图片位置尺寸
        $('.set-video-left').val(currElem.style.left);
        $('.set-video-top').val(currElem.style.top);
        $('.set-video-width').val(currElem.style.width);
        $('.set-video-height').val(currElem.style.height);
        // 层级
        $('.set-video-zIndex').val(currElem.style.zIndex);
        // 视频信息
        currElem.info == '' ? 
        $('.set-video-src-desc').html('请选择视频') : 
        $('.set-video-src-desc').html(currElem.info);
        // 视频图标
        currElem.poster ?
        $('.set-video-poster').css('backgroundImage', 'url(' + currElem.poster + ')') :
        $('.set-video-poster').css('backgroundImage', '');
    }
};

module.exports = videoCtrls;