var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');
var Cache = require('../common/cache');
var audioWindowView = require('../../view/layer/audioWindow.hbs'); // 选择音频弹窗视图

var placeholderArr = ['输入用户作品ID', '输入曲库歌曲ID', '输入音频链接'];
var imageObj = {};
var defaultAudioIcon = '/images/audio_play_icon.jpg';

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

// 更新状态图
function setAudioIcon(id, type, src){
    vm.updateCurrTools(id, 'audio');
    // 设置播放暂停icon
    if (src) {
        $('.set-audio-' + type + 'Icon').css('backgroundImage', 'url(' + src + ')');
    } else {
        $('.set-audio-' + type + 'Icon').css('backgroundImage', '');
    }
    // 更新预览视图模型
    store.elements[store.currElemId].image[type] = src;
    if (type === 'play') {
        if (src) {
            $('#' + store.currElemId).children('.drag-ele').css('backgroundImage', 'url(' + src + ')');
        } else {
            $('#' + store.currElemId).children('.drag-ele').css('backgroundImage', 'url(' + defaultAudioIcon + ')');
        }
    }
}

var audioCtrls = function(){
    this.init();
};

// 显示音频弹窗
function onAudioWindowShow(){
    var currElem = store.elements[store.currElemId];
    $('.mask-layer').show();
    $('.audio-window').show().html(audioWindowView(currElem));
    $('.set-audio-selectedType').unbind('click').bind('click', onAudioSelectTypeShow);
    $('.audio-select-list li').unbind('click').bind('click', AudioSelectType);
    $('.set-audio-search').unbind('click').bind('click', onAudioSearch);
    $('.audio-ok-btn').unbind('click').bind('click', this.selectedAudio.bind(this));
    $('.audio-cancel-btn').unbind('click').bind('click', closeAudioWindow);
    $('.audio-menu-closebtn').unbind('click').bind('click', closeAudioWindow);
}

// 选择类型列表显示
function onAudioSelectTypeShow(){
    var $selectList = $('.audio-select-list');
    $selectList.is(':hidden') ? $selectList.show() : $selectList.hide();
}
// 选择类型
function AudioSelectType(){
    var $selectList = $('.audio-select-list');
    var index = $(this).index();
    $selectList.hide();
    $('.audio-selected').html(this.innerHTML);
    $('.set-audio-url-input').attr('placeholder', placeholderArr[index]);
    $('.set-audio-url-input').attr('data-type', parseInt(index + 1));
}

// 搜索音频
function onAudioSearch(){
    var _this = this; // 指向set-audio-search按钮
    var $input = $('.set-audio-url-input');
    var sourceType = $input.attr('data-type');
    var val = $input.val();
    if (sourceType === '3') {
        if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi.test(val)) {
            alert('请输入正确音频地址');
            return;
        }
        // 显示歌曲信息
        $('.audio-name').html(val);
        // 使用音频按钮赋值音频src
        $('.audio-ok-btn').attr('data-src', val);
        return;
    }
    else if (sourceType === '1' || sourceType === '2') {
        if (!/[0-9]+/g.test(val)) {
            alert('请输入正确id');
            return;
        }
        searchSongInfo(sourceType, val);
    }
}

function searchSongInfo(sourceType, val){
    $.ajax({
        type: 'GET',
        url: '/h5/searchSongInfo?avid=' + val + '&sourceType=' + sourceType + '&ran=' + Math.random(),
        success: function (params) {
            var data = JSON.parse(params),
                songUrl, singer, songName;

            if (sourceType === '1') {
                // 没有查到歌曲信息
                if (!data.spaceav) {
                    alert('没有查到歌曲信息');
                    return;
                }
                songUrl = data.spaceav.fileURL;
                singer = data.spaceav.nickName;
                songName = data.spaceav.name;
            } else if (sourceType === '2') {
                // 没有查到歌曲信息
                if (!data.listenUrl) {
                    alert('没有查到歌曲信息');
                    return;
                }
                songUrl = data.listenUrl;
                singer = data.singerName;
                songName = data.name;
            }

            // 显示歌曲信息
            $('.audio-name').html(songName + ' - ' + singer);
            // 使用音频按钮赋值音频src
            $('.audio-ok-btn').attr('data-src', songUrl);
        },
        error: function () {
            alert('查询歌曲信息失败');
        }
    });
}

// 关闭音频弹窗
function closeAudioWindow(){
    $('.mask-layer').fadeOut();
    $('.audio-window').fadeOut();
}

// 更新音频信息视图模型
function updateAudioInfo(id, info, src){
    vm.updateCurrTools(id, 'audio');
    info = info == '' ? '请选择歌曲' : info;
    $('.set-audio-src-desc').html(info);
    // 更新模型
    store.elements[store.currElemId].src = src;
    store.elements[store.currElemId].info = info;
}

audioCtrls.prototype = {
    init: function(){
        var _this = this;
        $('.audio-window').unbind('mousedown').bind('mousedown', function(e){e.stopPropagation();});
        $('.set-audio-width').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-audio-height').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-audio-top').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-audio-left').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-audio-bottom').unbind('keyup').bind('keyup', this.styleChangeHandler);
        $('.set-audio-right').unbind('keyup').bind('keyup', this.styleChangeHandler);
        // 层级设置
        $('.set-audio-zIndex').unbind('keyup').bind('keyup', function(){ _this.zIndexChangeHandler(this.value) });
        $('.set-audio-zIndex-add').unbind('click').bind('click', this.zIndexAddHandler.bind(this));
        $('.set-audio-zIndex-reduce').unbind('click').bind('click', this.zIndexReduceHandler.bind(this));
        // 音频地址设置
        $('.set-audio-src').unbind('click').bind('click', onAudioWindowShow.bind(this));
        // 音频播放图标设置
        $('.set-audio-playIcon-input').unbind('change').bind('change', function(){ _this.uploadIconHandler(this, 'play'); });
        // 音频暂停图标设置
        $('.set-audio-pauseIcon-input').unbind('change').bind('change', function(){ _this.uploadIconHandler(this, 'pause'); });
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
            undo: vm.move.bind(_this, oldValue, function () { try { vm.updateCurrTools(id, 'audio'); } catch(ex){} }),
            execute: vm.move.bind(_this, newValue, function () { try { vm.updateCurrTools(id, 'audio'); } catch(ex){} }), 
            title: '移动音频元素', 
        });
    },
    zIndexChangeHandler: function(value, callback){
        callback ? callback() : void 0;
        if (!store.currElemId) return;
        var id = store.currElemId;
        if (!callback) {
            // 添加历史记录
            vm.execute({
                undo: this.zIndexChangeHandler.bind(this, store.elements[store.currElemId].style.zIndex, function () { try { vm.updateCurrTools(id, 'audio'); } catch(ex){} }),
                execute: this.zIndexChangeHandler.bind(this, value, function () { try { vm.updateCurrTools(id, 'audio'); } catch(ex){} }), 
                title: '修改音频层级', 
            });
        }
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    zIndexAddHandler: function(){
        if (!store.currElemId) return;
        var elem = $('.set-audio-zIndex');
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
        var elem = $('.set-audio-zIndex');
        var value = parseInt(elem[0].value);
        value = value - 1;
        // 更新表单视图
        elem.val(value);
        // 更新模型
        store.elements[store.currElemId].style.zIndex = value;
        // 更新预览视图
        $('#' + store.currElemId).css('z-index', value);
    },
    selectedAudio: function(){
        if (!$('.audio-ok-btn').attr('data-src')) {
            alert('请选择音频');
            return;
        }
        var id = store.currElemId;
        var currElem = store.elements[id];
        var info = $('.audio-name').html();
        var src = $('.audio-ok-btn').attr('data-src');
        // 添加历史记录
        vm.execute({
            undo: updateAudioInfo.bind(this, id, currElem.info, currElem.src),
            execute: updateAudioInfo.bind(this, id, info, src), 
            title: '修改音频信息', 
        });
        // 更新音频信息
        updateAudioInfo(id, info, src);
        // 关闭音频弹窗
        closeAudioWindow();
    },
    // 上传图片处理
    uploadIconHandler: function(input, type){
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
                var oldValue = store.elements[store.currElemId].image[type];
                var newValue = res.path;
                imageObj = {src: res.path, width: res.width, height: res.height};
                // 移除loading层
                $('.loading-window').fadeOut();
                // 存储至本地缓存
                Cache.add('edit_m_img', imageObj);
                // 更新状态视图图和模型
                setAudioIcon(id, type, res.path);
                // 添加历史记录
                vm.execute({
                    undo: setAudioIcon.bind(_this, id, type, oldValue),
                    execute: setAudioIcon.bind(_this, id, type, newValue), 
                    title: (type === 'play' ? '修改音频播放图标' : '修改音频暂停图标'), 
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
        $('.set-audio-left').val(currElem.style.left);
        $('.set-audio-top').val(currElem.style.top);
        $('.set-audio-width').val(currElem.style.width);
        $('.set-audio-height').val(currElem.style.height);
        // 层级
        $('.set-audio-zIndex').val(currElem.style.zIndex);
        // 音频信息
        currElem.info == '' ? 
        $('.set-audio-src-desc').html('请选择歌曲') : 
        $('.set-audio-src-desc').html(currElem.info);
        // 音频图标
        currElem.image.play ?
        $('.set-audio-playIcon').css('backgroundImage', 'url(' + currElem.image.play + ')') :
        $('.set-audio-playIcon').css('backgroundImage', '');
        currElem.image.pause ?
        $('.set-audio-pauseIcon').css('backgroundImage', 'url(' + currElem.image.pause + ')') :
        $('.set-audio-pauseIcon').css('backgroundImage', '');
    }
};

module.exports = audioCtrls;