var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
var thumbList = require('../thumb/index');
var Gallery = require('../component/gallery');  // 图库功能
var Music = require('../component/music');  // 乐库功能

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
                '.set-audio-src',
                '.set-audio-play-img',
                '.audio-playImg-delete',
                '.set-audio-pause-img',
                '.audio-pauseImg-delete',
            ],
            methods: {
                /**
                 * 显示音频弹窗
                 * 默认显示我的音乐
                 */
                getAidioWin: function (e, $el) {
                    $('.window-audio').show();
                    Music.getLocal(_this.changeMusic);
                },
                /**
                 * 显示图库弹窗
                 * 默认显示我的图库
                 */
                getGalleryWin_play: function (e, $el) {
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(_this.changePlayImg);
                },
                getGalleryWin_pause: function (e, $el) {
                    $('.window-gallery').show();
                    /**
                     * @param {Function} 点击选择图片后的回调操作
                     */
                    Gallery.getLocal(_this.changePauseImg);
                },
                deletePlayImg: this.deletePlayImg,
                deletePauseImg: this.deletePauseImg,
            }
        });
    },
    /**
     * 更新音乐src模型
     * 更新表单视图
     */
    changeMusic: function (src) {
        var currentPage = model.currentPage - 1;
        model.pages[currentPage].component[model.currentId].src = src;
        $('.currElemMusic').html(src).attr('title', src);
    },
    /**
     * 修改播放状态图片
     * 更新播放状态图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    changePlayImg: function (src) {
        var currentPage = model.currentPage - 1;
        // 更新播放状态图模型
        model.pages[currentPage].component[model.currentId].image.play = src;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', 'url(' + src + ')', 'style');
        // 更新表单视图
        $('.audio-playImg-preview').css('backgroundImage', 'url(' + src + ')');
    },
    /**
     * 修改暂停状态图片
     * 更新暂停状态图片模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    changePauseImg: function (src) {
        var currentPage = model.currentPage - 1;
        // 更新暂停状态图模型
        model.pages[currentPage].component[model.currentId].image.pause = src;
        // 更新表单视图
        $('.audio-pauseImg-preview').css('backgroundImage', 'url(' + src + ')');
    },
    /**
     * 删除播放状态图
     * 删除播放状态图模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    deletePlayImg: function () {
        var currentPage = model.currentPage - 1;
        // 更新播放状态图模型
        model.pages[currentPage].component[model.currentId].image.play = null;
        // 主编辑区更新视图
        mainEdit.setProps('backgroundImage', 'url(/images/audio_play_icon.jpg)', 'style');
        // 缩略图区更新视图
        thumbList.setProps('backgroundImage', 'url(/images/audio_play_icon.jpg)', 'style');
        // 更新表单视图
        $('.audio-playImg-preview').css('backgroundImage', '');
    },
    /**
     * 删除暂停状态图
     * 删除暂停状态图模型
     * 更新视图（主编辑区，缩略图，表单）
     */
    deletePauseImg: function () {
        var currentPage = model.currentPage - 1;
        // 更新暂停状态图模型
        model.pages[currentPage].component[model.currentId].image.pause = null;
        // 更新表单视图
        $('.audio-pauseImg-preview').css('backgroundImage', '');
    }
};

module.exports = viewPanel;