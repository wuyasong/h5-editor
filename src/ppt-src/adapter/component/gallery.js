var galleryView = require('../../views/win/galleryItem.tpl');
var Cache = require('./cache');
var uploadImg = require('../component/uploadImg');

var Gallery = {
    /**
     * 显示图库视图
     * 切换tab为图库
     * 刷新gallery-list数据（从图库中拿）
     */
    getLib: function () {
        $('.win-gallery-header-tabs li').eq(0).addClass('current').siblings().removeClass('current');
    },
    /**
     * 更新图片列表视图操作
     * 本地获取图片列表
     * 刷新图片列表视图
     * 绑定选择图片事件
     */
    imageHandler: function (callback) {
        var imgList = Cache.get('edit_ppt_img');
        $('.win-gallery-header-tabs li').eq(1).addClass('current').siblings().removeClass('current');
        // 刷新gallery-list视图
        imgList && $('.gallery-list').html(galleryView(imgList));
        // 重置选择图片事件
        this.selectImage(callback);
    },
    /**
     * 显示我的图库视图
     * 切换tab为我的图库
     * 刷新gallery-list数据（从本地存储中拿）
     */
    getLocal: function (callback) {
        var _this = this;
        // 更新图片列表视图操作
        this.imageHandler(callback);
        // 绑定指令
        handy.create({
            el: [
                '.upload-img',   // 上传图片按钮
                '.win-header-close'
            ],
            methods: {
                /**
                 * 上传图片
                 * 显示我的图库视图
                 * 选择图片后
                 * 更新背景图片模型
                 * 更新视图（主编辑区，缩略图，表单）
                 */
                pushGallery: function (e, $el) {
                    uploadImg($el[0], function (img) {
                        // 重置选择图片事件
                        _this.imageHandler(callback);
                    });
                },
                /**
                 * 关闭弹层
                 */
                closeWin: function (e, $el) {
                    $el.parents('.container-window').hide();
                }
            }
        });
    },
    selectImage: function (callback) {
        var _this = this;
        handy.create({
            el: ['.gallery-list li'],
            methods: {
                /**
                 * 选择图片
                 */
                selectImg: function (e, $el) {
                    $('.container-window').hide();
                    callback($el.attr('data-src'), $el.attr('data-width'), $el.attr('data-height'));
                }
            }
        });
    }
};

module.exports = Gallery;