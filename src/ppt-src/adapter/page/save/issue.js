var uploadImg = require('../../component/uploadImg');
var save = require('./save');

// 发布弹窗方法类
var IssueWin = {
    get: function () {
        // 显示发布弹窗
        $('.window-publish').show();
        // 重置文字内容
        this.restoreText();
        // 初始化弹窗里的事件
        this.initEvent();
    },
    initEvent: function () {
        handy.create({
            el: [
                '.issue-upload-img',
                '.win-issue-ok',
                '.win-issue-cancel'
            ],
            methods: {
                /**
                 * @method 修改应用封面
                 * 上传图片
                 * 修改模型
                 * 更新应用封面视图
                 */
                setAppImg: function (e, $el) {
                    uploadImg($el[0], function (img) {
                        // 修改模型
                        model.shareImg = img.src;
                        // 更新应用封面视图
                        $('.set-issue-shareImg').css('background-image', 'url(' + img.src + ')');
                    });
                },
                /**
                 * @method 发布应用
                 * 更新模型（应用名称，应用描述）
                 * 关闭弹窗
                 * 保存数据
                 */
                saveApp: function () {
                    var title_txt = $('.set-issue-title').val();
                    var desc_txt = $('.set-issue-desc').val();
                    title_txt && (model.title = title_txt);
                    desc_txt && (model.description = desc_txt);
                    $('.window-publish').hide();
                    save('发布');
                },
                // 关闭弹窗
                closeWin: function (e, $el) {
                    $el.parents('.container-window').hide();
                }
            }
        });
    },
    /**
     * @method 重置（应用名称，应用描述）
     */
    restoreText: function () {
        $('.set-issue-title').val(model.title);
        $('.set-issue-desc').val(model.description);
    }
};

// 发布操作
var Issue = function () {
    IssueWin.get();
}

module.exports = Issue;