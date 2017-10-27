var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');
var Gallery = require('../component/gallery');  // 图库功能

function viewPanel () {
    this.init();
}

viewPanel.prototype = {
    /**
     * 初始化控制面板-容器
     */
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-video-src',
                '.set-video-poster',
                '.video-poster-delete',
            ],
            methods: {
                /**
                 * 设置视频src
                 */
                setVideo: this.changeVideo,
                /**
                 * 显示图库弹窗
                 * 默认显示我的图库
                 */
                getGalleryWin: function (e, $el) {
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(_this.changePoster);
                },
                deletePoster: this.deletePoster
            }
        });
    },
    /**
     * 更新视频src模型
     */
    changeVideo: function (e, $el) {
        var value = $el.val();
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].src = value;
    },
    /**
     * 修改播视频默认图
     * 更新播视频默认图模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    changePoster: function (src) {
        var currentPage = model.currentPage - 1;
        // 更新播放状态图模型
        model.pages[currentPage].component[model.currentId].poster = src;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 更新表单视图
        $('.video-poster-preview').css('backgroundImage', 'url(' + src + ')');
    },
    /**
     * 删除视频默认图
     * 删除视频默认图模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    deletePoster: function () {
        var currentPage = model.currentPage - 1;
        // 更新视频默认图模型
        model.pages[currentPage].component[model.currentId].poster = null;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', 'url(/images/video_poster_icon.png)', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', 'url(/images/video_poster_icon.png)', 'style');
        // 更新表单视图
        $('.video-poster-preview').css('backgroundImage', '');
    }
};

module.exports = viewPanel;