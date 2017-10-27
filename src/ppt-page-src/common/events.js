var eventHandler = {
    init: function () {
        // 遍历页对象
        $.each(pageData.pages, function(i, page){
            // 遍历元素集合
            $.each(page.component, function(id, element){
                // 有添加过事件
                if (element.events.length) {
                    // 遍历元素的所有事件
                    $.each(element.events, function(i, event){
                        // 监听事件
                        $('#' + id).unbind(event.eventType).bind(event.eventType, function(){
                            $('#' + event.eventId)[event.eventHandle]();
                        });
                    });
                }
            });
        });
    }
};

module.exports = eventHandler;