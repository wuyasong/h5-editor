var enevts = require('./event/events');
var save = require('./save/save');
var issue = require('./save/issue');
var preview = require('./save/preview');

var pageController = {
    init: function () {
        // 页面事件处理
        this.eventHandler();
        
        handy.create({
            el: [
                '.main-preview-play',
                '.win-header-close',
                '.pageset-item-checkbox',
                '.top-title-input',
                '.top-menu-set',
                '.top-menu-save',
                '.top-menu-publist',
                '.top-menu-qrcode',
                '.window-preview-close-btn'
            ],
            methods: {
                stopPropagation: function (e, $el) {
                    e.stopPropagation();
                },
                // 标题控制
                titleHandler: function () {
                    model.title = this.value;
                },
                // 播放动画操作
                animationHandler: this.animationHandler,
                // 点击保存
                saveHandler: function () {
                    if (!model.title) {
                        alert('请输入标题');
                    } else {
                        save('保存');
                    }
                },
                // 点击发布
                issueHandler: function () {
                    issue();
                },
                // 显示页面设置弹窗
                getPageSetWin: function () {
                    $('.window-pageset').show();
                },
                // 更新选项
                setOptions: function (e, $el) {
                    var checked = $el.hasClass('checked');
                    var options = $el.attr('data-model');
                    // 已选中时
                    if (checked) {
                        $el.removeClass('checked');
                        model.setOptions[options] = false;  // 当前配置项设置为未选中
                        options === 'isShowLayer' && $('.window-layerlist').hide();
                    } 
                    // 未选中时
                    else {
                        $el.addClass('checked');
                        model.setOptions[options] = true;  // 当前配置项设置为已选中
                        options === 'isShowLayer' && $('.window-layerlist').show();
                    }
                },
                // 显示预览弹窗
                getPreviewWin: function () {
                    save('保存', function () {
                        $('.window-preview').show();
                        // 预览弹窗事件操作
                        preview();
                    });
                },
                closeWin: function (e, $el) {
                    $el.parents('.container-window').hide();
                }
            }
        });
    },
    // 页面事件处理
    eventHandler: function () {
        enevts();
    },
    // 播放动画操作
    animationHandler: function (e, $el) {
        var currentPage = model.currentPage - 1;
        // 遍历本屏所有元素
        $.each(model.pages[currentPage].component, function (id, element) {
            var animation = element.animation;
            var style = animation.name + ' ' + animation.duration + ' ' + animation.delay + ' ' + animation.count + ' both';
            // 执行动画
            $('#' + id).css({'animation': style});
            // 动画结束后进行重置 以便下次再执行
            setTimeout(function() {
                $('#' + id).css({'animation': 'resetAnimate 0s 0s forwards'});
            }, (parseInt(animation.duration) + parseInt(animation.delay)) * 1000);
        });
    }
};

module.exports = pageController;