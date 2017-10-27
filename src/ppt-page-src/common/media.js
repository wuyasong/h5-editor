var bgMusicView = require('../views/bgMusic.tpl');

var mediaHandler = {
    init: function () {
        var _this = this;
        // 音视频元素监听事件
        $('.page_elem').unbind('tap').bind('tap', function(){
            var type = $(this).attr('data-type');
            // 音频播放暂停切换
            type === 'audio' && (_this.audioEvent( $(this).children('.page_inner'), $(this).find('audio') ));
            // 视频播放暂停切换
            type === 'video' && (_this.videoEvent( $(this).children('.page_inner'), $(this).find('video') ));
        });
        // 渲染背景音乐icon
        if (pageData.bgMusic) {
            $('#contain').append(bgMusicView({src: pageData.bgMusic}));
            $('#bgMusic').get(0).play();
            // 播放暂停监听
            $('.musicIcon').unbind('click').bind('click', function() {
                if ($('#bgMusic').get(0).paused) {
                    $(this).removeClass('songpause').addClass('songplay');
                    $('#bgMusic').get(0).play();
                } else {
                    $(this).removeClass('songplay').addClass('songpause');
                    $('#bgMusic').get(0).pause();
                }
            });
        }
        
    },
    // 音频播放暂停事件
    audioEvent: function ($elem, $audio) {
        // 播放暂停切换
        // 背景图切换
        if ($audio[0].paused) {
            $audio[0].play();
            $elem.css('background-image', 'url(' + $elem.attr('data-pauseImg') + ')');
        } else {
            $audio[0].pause();
            $elem.css('background-image', 'url(' + $elem.attr('data-playImg') + ')');
        }
    },
    // 视频播放暂停事件
    videoEvent: function ($elem, $video) {
        $elem.css('background-image', '');
        // 播放暂停切换
        if ($video[0].paused) {
            $video[0].play();
        } else {
            $video[0].pause();
        }
    },
};

module.exports = mediaHandler;