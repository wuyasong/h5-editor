{{each $data as event}}
    <li class="options-event-item" data-index="{{$index}}">
        <div class="options-event-item-topbar">
            事件-{{$index + 1}}
            <span class="options-event-item-topbar-arrow"></span>
            <span class="options-event-item-del event-del-btn" data-hdy-ev="click:deleteEvent"></span>
        </div>
        <div class="options-event-item-content clearfix">
            <div class="options-event-item-content-title">事件</div>
            <div class="options-event-item-content-selectbox">
                <div class="drop-down-menu">
                    <div class="drop-down-menu-selected set-event-type-btn" data-hdy-ev="click:getEventTypeList"><p>{{event.eventTypeName}}</p><span class="drop-down-menu-selected-arrow"></span></div>
                    <ul class="drop-down-menu-list event-type-list" style="display: none;">
                        <li data-name="无" data-event="" data-hdy-ev="click:setEventType" {{if event.eventType == ''}}class="selected"{{/if}}>无</li>
                        <li data-name="点击时" data-event="click" data-hdy-ev="click:setEventType" {{if event.eventType == 'click'}}class="selected"{{/if}}>点击时</li>
                        <li data-name="长按时" data-event="longTap" data-hdy-ev="click:setEventType" {{if event.eventType == 'longTap'}}class="selected"{{/if}}>长按时</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="options-event-item-content clearfix">
            <div class="options-event-item-content-title">效果</div>
            <div class="options-event-item-content-selectbox">
                <div class="drop-down-menu">
                    <div class="drop-down-menu-selected set-event-effect-btn" data-hdy-ev="click:getEventEffectList"><p>{{event.eventHandleName}}</p><span class="drop-down-menu-selected-arrow"></span></div>
                    <ul class="drop-down-menu-list event-effect-list" style="display: none;">
                        <li data-name="无" data-event="" data-hdy-ev="click:setEventEffect" {{if event.eventHandle == ''}}class="selected"{{/if}}>无</li>
                        <li data-name="显示" data-event="show" data-hdy-ev="click:setEventEffect" {{if event.eventHandle == 'show'}}class="selected"{{/if}}>显示</li>
                        <li data-name="隐藏" data-event="hide" data-hdy-ev="click:setEventEffect" {{if event.eventHandle == 'hide'}}class="selected"{{/if}}>隐藏</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="options-event-item-content clearfix">
            <div class="options-event-item-content-title">元素</div>
            <div class="options-event-item-content-selectbox">
                <div class="drop-down-menu">
                    <div class="drop-down-menu-selected set-event-elem-btn" data-hdy-ev="click:getEventElemList"><p>{{event.name}}</p><span class="drop-down-menu-selected-arrow"></span></div>
                    <ul class="drop-down-menu-list event-elem-list" style="display: none;">
                    </ul>
                </div>
            </div>
        </div>
    </li>
    {{/each}}