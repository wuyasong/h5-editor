var musicView = require('../../views/win/audioItem.tpl');
var uploadMedia = require('../component/uploadMedia');
var Cache = require('./cache');

var MusicLib = {
    music: null, // 选择的音频对象
    /**
     * 显示乐库视图
     * 切换tab为乐库
     * 刷新audio-list数据（从乐库中拿）
     */
    getLib: function () {
        $('.win-audio-header-tabs li').eq(1).addClass('current').siblings().removeClass('current');
    },
    /**
     * 更新音频列表视图操作
     * 本地获取音频列表
     * 刷新音频列表视图
     * 绑定选择音频事件
     */
    audioHandler: function () {
        var audioList = Cache.get('edit_ppt_audio');
        $('.win-audio-header-tabs li').eq(0).addClass('current').siblings().removeClass('current');
        // 刷新audio-list视图
        audioList && $('.audio-list').html(musicView(audioList));
        // 重置选择音频事件
        this.selectAudio();
    },
    /**
     * 显示我的音乐视图
     * 切换tab为我的音乐
     * 刷新audio-list数据（从本地存储中拿）
     */
    getLocal: function (callback) {
        var _this = this;
        // 更新音频列表视图操作
        this.audioHandler();
        // 绑定指令
        handy.create({
            el: [
                '.upload-music',  // 上传歌曲按钮
                '.win-set-audio-src',   // 添加外链按钮
                '.win-audio-cancel',  //音乐弹窗取消按钮
                '.win-link-btn-ok',   // 链接弹窗确定按钮
                '.win-link-btn-cancel',  // 链接弹窗取消按钮
                '.win-audio-ok',
                '.win-header-close'
            ],
            methods: {
                /**
                 * 上传歌曲
                 * 显示我的音乐视图
                 * 选择音乐后
                 * 更新背景音乐模型
                 * 更新视图（主编辑区）
                 */
                pushMusic: function (e, $el) {
                    uploadMedia($el[0], function (music) {
                        // 更新音频列表视图操作
                        _this.audioHandler();
                        $('.audio')[0].pause();
                    });
                },
                /**
                 * 显示链接弹窗
                 */
                getLinkWin: function (e, $el) {
                    $('.window-link').show();
                },
                /**
                 * 确认修改链接操作
                 */
                changeLink: function (e, $el) {
                    var value = $('.win-set-link-input').val();
                    if (!value) {
                        alert('链接不能为空');
                        return;
                    }
                    // 修改链接为背景音乐
                    var music = {};
                    music.src = value;
                    music.name = value.substring(value.lastIndexOf('\/') + 1);
                    // 存储至本地缓存
                    Cache.add('edit_ppt_audio', music);
                    // 隐藏链接弹窗
                    $('.window-link').hide();
                    $('.win-set-link-input').val('');
                    // 更新音频列表视图操作
                    _this.audioHandler();
                },
                /**
                 * 关闭弹层
                 */
                closeWin: function (e, $el) {
                    $el.parents('.container-window').hide();
                },
                /**
                 * 确认选择背景音乐
                 */
                setMusic: function (e, $el) {
                    $('.window-audio').hide();
                    callback && callback(_this.music);
                },
                /**
                 * 关闭弹层
                 */
                closeAudioWin: function (e, $el) {
                    $el.parents('.container-window').hide();
                },
            }
        });
    },
    /**
     * 选择音频
     * 刷新完视图执行
     */
    selectAudio: function () {
        var _this = this;
        handy.create({
            el: [
                '.audio-list li', 
                '.win-audio-playbtn', 
            ],
            methods: {
                /**
                 * 选择音频
                 * 更新选择的音频对象（本地修改，非模型树）
                 */
                selectMusic: function (e, $el) {
                    $el.addClass('current').siblings().removeClass('current');
                    _this.music = $el.attr('data-src');
                },
                /**
                 * 播放音频
                 */
                playMusic: function (e, $el) {
                    e.stopPropagation();
                    if ($el.hasClass('play')) { // 开始播放
                        $('.audio-list li .win-audio-playbtn').addClass('play').removeClass('paused');
                        $el.addClass('paused').removeClass('play');
                        $('.audio').attr('src', $el.attr('data-src'))[0].play();
                    } else {  // 停止播放
                        $('.audio-list li .win-audio-playbtn').addClass('play').removeClass('paused');
                        $el.addClass('play').removeClass('paused');
                        $('.audio')[0].pause();
                    }
                },
            }
        });
    }
};

module.exports = MusicLib;