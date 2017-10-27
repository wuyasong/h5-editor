
var VideoWin = {
    video: null,  // 视频链接地址
    /**
     * 显示我的音乐视图
     * 切换tab为我的音乐
     * 刷新audio-list数据（从本地存储中拿）
     */
    handler: function (callback) {
        var _this = this;
        // 绑定指令
        handy.create({
            el: [
                '.win-header-close',
                '.win-video-link-btn-ok',
                '.win-video-link-btn-cancel'
            ],
            methods: {
                /**
                 * 确认修改链接操作
                 */
                changeLink: function (e, $el) {
                    var value = $('.win-set-video-link-input').val();
                    if (!value) {
                        alert('链接不能为空');
                        return;
                    }
                    _this.video = value;
                    // 隐藏链接弹窗
                    $('.window-video').hide();
                    $('.win-set-video-link-input').val('');
                    callback && callback(_this.video);
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
            }
        });
    }
};

module.exports = VideoWin;