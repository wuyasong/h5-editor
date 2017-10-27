var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

module.exports = {
    create: function(ups_input) {
        // 音乐按钮显示
        $('.musicIcon').show();
        // 检测歌曲类型
        if (!this.checkType(ups_input)) {
            return;
        }
        // 检测歌曲文件大小
        if (!this.checkSize(ups_input)) {
            return;
        }
        // 上传服务器歌曲
        this.uploadSong(ups_input);
    },
    // 检测歌曲是否符合要求
    checkType: function(ups_input) {
        var pattern = /\.mp3|\.aac|\.m4a|\.mka|\.mpeg/gi;
        var value = ups_input.value;
        if (!pattern.test(value)) {
            alert('歌曲格式必须为：mp3，m4a，aac，mka格式');
            return false;
        } else {
            return true;
        }
    },
    checkSize: function(ups_input) {
        var file = ups_input.files[0];
        if (file.size / 1024 / 1024 > 5) {
            alert('上传歌曲不能超过5MB');
            return false;
        } else {
            return true;
        }
    },
    uploadSong: function(ups_input) {
        var xhr = new XMLHttpRequest(),
            formData = new FormData(),
            file = ups_input.files[0];

        // 显示loading icon
        $('.loading').show();
        // 显示进度条
        $('.upsong_progress').show();
        // 添加表单项
        formData.append(ups_input.name, file);

        // 上传进度
        xhr.upload.onprogress = function(e) {
                // 判断进度信息是否可用的布尔值
                if (e.lengthComputable) {
                    // 获取已经传输的字节
                    var loaded = e.loaded;
                    // 获取要传输的总字节
                    var total = e.total;
                    // 计算百分比
                    $('#song_currProgress').width(Math.ceil(loaded / total * 100) + '%');
                }
            }
            // 服务器响应成功后
        xhr.onload = function() {
            // 返回歌曲url
            var data = JSON.parse(xhr.responseText);
            ups_input.value = '';
            // 移除loading
            $('.loading').hide();
            // 进度条移除
            setTimeout(function() {
                $('.upsong_progress').hide();
                $('#song_currProgress').width('1%');
            }, 200);

            if (data.retcode === 1) {
                // 如果之前有歌曲 首先清除掉
                if ($('#page_music').get(0)) {
                    $('#page_music').get(0).pause();
                }
                // 显示歌曲地址
                $('.music_mod').val(data.path);
                // 创建歌曲元素
                $('.musicArea').html(appstore.template.audioItem(data.path));
                // 显示播放加载状态
                $('.songPlayState').show();
                // 当歌曲不会因缓冲卡顿时 隐藏播放加载状态
                $('#page_music').unbind('canplay').bind('canplay', function() {
                    $('.songPlayState').hide();
                });
                // 播放暂停监听
                $('.musicIcon').unbind('click').bind('click', function() {
                    if ($('#page_music').get(0).paused) {
                        $('.musicIcon').removeClass('songpause').addClass('songplay');
                        $('#page_music').get(0).play();
                    } else {
                        $('.musicIcon').removeClass('songplay').addClass('songpause');
                        $('#page_music').get(0).pause();
                    }
                });
                // 创建歌曲唯一id
                appstore.music.src = data.path;
            } else {
                $('.loading').hide();
                $('.upsong_progress').hide();
                $('#song_currProgress').width('1%');
                alert('上传失败，错误原因：' + data.errMsg);
            }
        };
        xhr.onerror = function() {
            ups_input.value = '';
            alert('上传失败');
        };
        // 请求服务器接口文件
        xhr.open('POST', '/h5/uploadSong');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(formData);
    },
    add: function(src) {
        // 如果之前有歌曲 首先清除掉
        if ($('#page_music').get(0)) {
            $('#page_music').get(0).pause();
        }
        // 显示歌曲地址
        $('.music_mod').val(src);
        // 创建歌曲元素
        $('.musicArea').html(appstore.template.audioItem(src));
        // 显示播放加载状态
        $('.songPlayState').show();
        // 当歌曲不会因缓冲卡顿时 隐藏播放加载状态
        $('#page_music').unbind('canplay').bind('canplay', function() {
            $('.songPlayState').hide();
        });
        // 播放暂停监听
        $('.musicIcon').unbind('click').bind('click', function() {
            if ($('#page_music').get(0).paused) {
                $('.musicIcon').removeClass('songpause').addClass('songplay');
                $('#page_music').get(0).play();
            } else {
                $('.musicIcon').removeClass('songplay').addClass('songpause')
                $('#page_music').get(0).pause();
            }
        });
    },
    realease: function(ups_input) {
        // 判断是否有歌曲现存
        if (appstore.music.src) {
            // 停止歌曲
            $('#page_music').get(0).pause();
            // 清空preview中展示歌曲
            $('.musicArea').html('');
            // 移除歌曲地址
            $('.music_mod').val('');
            // 更新模型
            appstore.music.src = null;
        }
    }
};