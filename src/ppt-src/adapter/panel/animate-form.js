var model = require('../../model/store');
var defaultData = require('../../model/defaultData');

var animationForm = function () {};

animationForm.prototype = {
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-animate-type-btn',
                '.animate-type-list li',
                '.set-animate-duration-input',
                '.set-animate-duration-btn',
                '.animate-duration-list li',
                '.set-animate-count-btn',
                '.set-animate-delay-btn',
                '.set-animate-count-input',
                '.animate-count-list li',
                '.set-animate-delay-input',
                '.animate-delay-list li'
            ],
            methods: {
                /**
                 * 显示动画方式列表
                 */
                getAnimateTypeList: function (e, $el) {
                    e.stopPropagation();
                    $('.animate-type-list').show();
                },
                /**
                 * 设置动画方式
                 */
                setAnimateType: this.changeAnimateType,
                /**
                 * 显示动画时间列表
                 */
                getAnimateDurationList: function (e, $el) {
                    e.stopPropagation();
                    $('.animate-duration-list').show();
                },
                /**
                 * 设置动画时间按钮
                 */
                setAnimateDuration: function (e, $el) {
                    var duration = $el.attr('data-animate');
                    _this.changeAnimateDuration(duration);
                },
                /**
                 * 设置动画时间输入框
                 */
                setAnimateDurationInput: function (e, $el) {
                    var duration = $el.val().replace(/[^\d+\.\d+]/g,'') + 's';
                    _this.changeAnimateDuration(duration);
                },

                /**
                 * 显示动画次数列表
                 */
                getAnimateCountList: function (e, $el) {
                    e.stopPropagation();
                    $('.animate-count-list').show();
                },
                /**
                 * 设置动画次数按钮
                 */
                setAnimateCount: function (e, $el) {
                    var count = $el.attr('data-animate');
                    _this.changeAnimateCount(count);
                },
                /**
                 * 设置动画次数输入框
                 */
                setAnimateCountInput: function (e, $el) {
                    var count = parseInt($el.val());
                    _this.changeAnimateCount(count);
                },

                /**
                 * 显示动画延迟列表
                 */
                getAnimateDelayList: function (e, $el) {
                    e.stopPropagation();
                    $('.animate-delay-list').show();
                },
                /**
                 * 设置动画延迟按钮
                 */
                setAnimateDelay: function (e, $el) {
                    var delay = $el.attr('data-animate');
                    _this.changeAnimateDelay(delay);
                },
                /**
                 * 设置动画延迟输入框
                 */
                setAnimateDelayInput: function (e, $el) {
                    var delay = $el.val().replace(/[^\d+\.\d+]/g,'') + 's';
                    _this.changeAnimateDelay(delay);
                },
            }
        });
    },
    /**
     * 修改动画方式
     * 更新模型
     * 主编辑区视图执行动画
     * 更新表单视图
     */
    changeAnimateType: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var currentId = model.currentId;
        var animation = model.pages[currentPage].component[model.currentId].animation;  // 当前元素动画模型
        // 修改动画模型
        animation.name = $el.attr('data-animate');
        // 获取css动画属性
        var style = animation.name + ' ' + animation.duration + ' ' + animation.delay + ' ' + animation.count + ' both';
        // 执行动画
        $('#' + model.currentId).css({'animation': style});
        // 动画结束后进行重置 以便下次再执行
        setTimeout(function() {
            $('#' + currentId).css({'animation': 'resetAnimate 0s 0s forwards'});
        }, (parseInt(animation.duration) + parseInt(animation.delay)) * 1000);
        // 更新表单视图
        $('.set-animate-type-btn p').html($el.html());
        $el && $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 修改动画时间
     * 更新模型
     * 更新表单视图
     */
    changeAnimateDuration: function (value) {
        var currentPage = model.currentPage - 1;
        var animation = model.pages[currentPage].component[model.currentId].animation;  // 当前元素动画模型
        // 修改动画模型
        animation.duration = value;
        // 更新表单视图
        $('.set-animate-duration-input').val(value.slice(0, -1) + '秒');
        $('.animate-duration-list li[data-animate="' + value + '"]').addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 修改动画次数
     * 更新模型
     * 更新表单视图
     */
    changeAnimateCount: function (value) {
        var currentPage = model.currentPage - 1;
        var animation = model.pages[currentPage].component[model.currentId].animation;  // 当前元素动画模型
        // 修改动画模型
        animation.count = value;
        // 更新表单视图
        $('.set-animate-count-input').val(value);
        $('.animate-count-list li[data-animate="' + value + '"]').addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 修改动画延迟
     * 更新模型
     * 更新表单视图
     */
    changeAnimateDelay: function (value) {
        var currentPage = model.currentPage - 1;
        var animation = model.pages[currentPage].component[model.currentId].animation;  // 当前元素动画模型
        // 修改动画模型
        animation.delay = value;
        // 更新表单视图
        $('.set-animate-delay-input').val(value.slice(0, -1) + '秒');
        $('.animate-delay-list li[data-animate="' + value + '"]').addClass('selected').siblings().removeClass('selected');
    }
};

module.exports = animationForm;