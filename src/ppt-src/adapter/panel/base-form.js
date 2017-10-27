var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var mainEdit = require('../mainEdit/main-editor');
// var thumbList = require('../thumb/index'); 不能引入  会导致循环依赖

function baseForm () {}

baseForm.prototype = {
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.set-base-width',
                '.set-base-height',
                '.set-base-zIndex',
                '.set-base-zIndex-add',
                '.set-base-zIndex-reduce',
                '.set-base-left',
                '.set-base-top'
            ],
            methods: {
                /**
                 * 修改宽度
                 */
                changeWidth: function (e, $el) {
                    _this.changeProps('width', parseInt($el.val()));
                },
                /**
                 * 修改高度
                 */
                changeHeight: function (e, $el) {
                    _this.changeProps('height', parseInt($el.val()));
                },
                /**
                 * 修改z-index
                 */
                changeZIndex: function (e, $el) {
                    _this.changeProps('zIndex', parseInt($el.val()));
                },
                /**
                 * 增加z-index
                 */
                setZIndexAdd: function (e, $el) {
                    var value = parseInt($el.siblings('input').val());
                    ++value;
                    _this.changeProps('zIndex', value);
                },
                /**
                 * 减少z-index
                 */
                setZIndexReduce: function (e, $el) {
                    var value = parseInt($el.siblings('input').val());
                    --value;
                    value > 0 ? value : 1;
                    _this.changeProps('zIndex', value);
                },
                /**
                 * 修改left
                 */
                changeLeft: function (e, $el) {
                    _this.changeProps('left', parseInt($el.val()));
                },
                /**
                 * 修改top
                 */
                changeTop: function (e, $el) {
                    _this.changeProps('top', parseInt($el.val()));
                },
            }
        });
    },
    /**
     * 更新模型
     * 更新主编辑区视图
     * 更新缩略列表区视图
     * 更新表单视图
     */
    changeProps: function (key, value) {
        var currentPage = model.currentPage - 1;
        var type = model.currentTools;
        var suffix = '';
        model.pages[currentPage].component[model.currentId].style[key] = value;
        // 主编辑区更新视图
        mainEdit.setProps(key, value, 'style');
        // 缩略图区更新视图
        this.setProps(key, value, 'style');
        // 更新表单视图
        if (key === 'width' || key === 'height') {
            suffix = '像素';
        }
        $('.set-' + type + '-' + key).val(value + suffix);
    },
    // 修改缩略列表元素属性
    setProps: function (key, value, type) {
        var currentPage = model.currentPage - 1;
        var currentId = model.currentId;
        if (type === 'style') {
            $('.' + currentId + '_thumb').css(key, value);
            if (key === 'height') $('.' + currentId + '_thumb').css('line-height', value + 'px');
        }
        else if (type === 'props') {
            $('.' + currentId + '_thumb')[key](value);
        }
    }
};

module.exports = baseForm;