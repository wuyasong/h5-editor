var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var eventItemView = require('../../views/controlPanel/events/eventItem.tpl');
var eventElemView = require('../../views/controlPanel/events/eventElement.tpl');

var eventForm = function () {};

eventForm.prototype = {
    init: function () {
        var _this = this;
        /**
         * 绑定各指令
         */
        handy.create({
            el: [
                '.add-event-btn',
            ],
            methods: {
                /**
                 * 添加事件
                 */
                addEvent: function (e, $el) {
                    e.stopPropagation();
                    _this.addEvent();
                },
            }
        });
    },
    /**
     * 添加事件
     * 创建本元素的事件模型
     * 更新表单-事件视图
     * 绑定事件配置指令
     */
    addEvent: function () {
        var currentPage = model.currentPage - 1;
        var currElem = model.pages[currentPage].component[model.currentId];
        var currEvents = currElem.events;  // 当前元素事件模型
        // 模型中添加一条事件（拷贝默认模型中的事件）
        var event = $.extend(true, {}, defaultData.events);
        currEvents.push(event);
        // console.info(currEvents)
        // 更新表单-事件视图
        $('.options-event-list').html(eventItemView(currEvents));
        // 绑定事件
        this.optionsEvent();
    },
    /**
     * 绑定事件配置指令
     */
    optionsEvent: function () {
        var _this = this;
        handy.create({
            el: [
                '.set-event-type-btn',
                '.set-event-effect-btn',
                '.set-event-elem-btn',
                '.event-type-list li',
                '.event-effect-list li',
                '.event-del-btn'
            ],
            methods: {
                /**
                 * 显示事件类型列表
                 */
                getEventTypeList: function (e, $el) {
                    e.stopPropagation();
                    $('.drop-down-menu-list').hide();
                    $el.siblings('.event-type-list').show();
                },
                /**
                 * 显示事件效果列表
                 */
                getEventEffectList: function (e, $el) {
                    e.stopPropagation();
                    $('.drop-down-menu-list').hide();
                    $el.siblings('.event-effect-list').show();
                },
                /**
                 * 显示事件元素列表
                 */
                getEventElemList: function (e, $el) {
                    e.stopPropagation();
                    var currentPage = model.currentPage - 1;
                    var elems = model.pages[currentPage].component;
                    var index = $el.parents('li').attr('data-index');
                    var event = elems[model.currentId].events[index];  // 当前事件模型
                    $('.drop-down-menu-list').hide();
                    // 遍历本页所有元素 更新下拉列表视图
                    $('.event-elem-list').html(eventElemView(toArray(elems)));
                    $el.siblings('.event-elem-list').show();
                    // 当前选中项高亮
                    if (event.eventId) {
                        $el.siblings('.event-elem-list').find('li[data-id="' + event.eventId + '"]').addClass('selected').siblings().removeClass('selected');
                    } else {
                        $el.siblings('.event-elem-list').find('li').eq(0).addClass('selected').siblings().removeClass('selected');
                    }
                    // 事件元素列表项绑定点击事件
                    handy.create({
                        el: [
                            '.event-elem-list li'
                        ],
                        methods: {
                            setEventElem: _this.changeEventElem,
                        },
                    });
                    // 事件元素列表项绑定悬浮事件（悬浮时添加高亮）
                    $('.event-elem-list li').hover(function () {
                        var id = $(this).attr('data-id');
                        $('#' + id).addClass('hover').siblings().removeClass('hover');
                    }, function () {
                        var id = $(this).attr('data-id');
                        $('#' + id).removeClass('hover');
                    });
                },
                /**
                 * 设置事件类型
                 */
                setEventType: this.changeEventType,
                /**
                 * 设置事件效果
                 */
                setEventEffect: this.changeEventEffect,
                /**
                 * 点击删除事件
                 */
                deleteEvent: function (e, $el) {
                    _this.deleteEvent(e, $el);
                }
            }
        });
    },
    /**
     * 修改事件类型
     * 更新模型
     * 更新表单视图
     */
    changeEventType: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var index = $el.parents('li').attr('data-index');
        var event = model.pages[currentPage].component[model.currentId].events[index];  // 当前事件模型
        var value = $el.attr('data-event');
        var name = $el.attr('data-name');
        // 修改事件类型模型
        event.eventType = value;
        event.eventTypeName = name;
        // 更新表单视图
        $('.set-event-type-btn p').eq(index).html($el.html());
        $el && $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 修改事件效果
     * 更新模型
     * 更新表单视图
     */
    changeEventEffect: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var index = $el.parents('li').attr('data-index');
        var event = model.pages[currentPage].component[model.currentId].events[index];  // 当前事件模型
        var value = $el.attr('data-event');
        var name = $el.attr('data-name');
        // 修改事件类型模型
        event.eventHandle = value;
        event.eventHandleName = name;
        // 更新表单视图
        $('.set-event-effect-btn p').eq(index).html($el.html());
        $el && $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 修改事件触发元素
     * 更新模型
     * 更新表单视图
     */
    changeEventElem: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var index = $el.parents('li').attr('data-index');
        var event = model.pages[currentPage].component[model.currentId].events[index];  // 当前事件模型
        var value = $el.attr('data-id');
        // 修改事件触发元素模型
        event.eventId = value;
        event.name = $el.attr('data-name');
        // console.info($el);
        // 更新表单视图
        $('.set-event-elem-btn p').eq(index).html($el.html());
        $el.addClass('selected').siblings().removeClass('selected');
    },
    /**
     * 删除事件操作
     * 更新模型
     * 更新表单视图
     */
    deleteEvent: function (e, $el) {
        var currentPage = model.currentPage - 1;
        var index = $el.parents('li').attr('data-index');
        var event = model.pages[currentPage].component[model.currentId].events;  // 事件模型数组
        // 删除一条事件
        event.splice(index, 1);
        $('.options-event-list').html(eventItemView(event));
        // 绑定事件
        this.optionsEvent();
    }
};

function toArray(elems) {
    var array = [];
    for (var key in elems) {
        array.push(elems[key]);
    }
    return array;
}

module.exports = eventForm;