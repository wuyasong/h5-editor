<!-- 字体 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">字体</div>
    <div class="options-item-content-hor">
        <div class="drop-down-menu">
            <div class="drop-down-menu-selected set-text-font-family-btn" data-hdy-ev="click:getFontFamilyList"><p>默认</p><span class="drop-down-menu-selected-arrow"></span></div>
            <ul class="drop-down-menu-list text-font-family-list" style="display: none;">
                <li class="selected" data-font="" data-hdy-ev="click:setFontFamily">默认</li>
                <li data-font="黑体" data-hdy-ev="click:setFontFamily">黑体</li>
                <li data-font="宋体" data-hdy-ev="click:setFontFamily">宋体</li>
                <li data-font="微软雅黑" data-hdy-ev="click:setFontFamily">微软雅黑</li>
                <li data-font="Arial" data-hdy-ev="click:setFontFamily">Arial</li>
            </ul>
        </div>
    </div>
</div>
<!-- 字色 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">字色</div>
    <div class="options-item-content-hor">
        <div class="options-item-color set-text-color" style="background: #333333;"></div>
    </div>
</div>
<!-- 字号 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">字号</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-text-font-size-input" value="18像素" data-hdy-ev="change:setFontSizeInput">
                </div>
                <div class="drop-down-menu-selected-btn dropdown-font-size-btn" data-hdy-ev="click:getFontSizeList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list text-font-size-list" style="display: none;">
                <li data-font="12" data-hdy-ev="click:setFontSize">12像素</li>
                <li data-font="14" data-hdy-ev="click:setFontSize">14像素</li>
                <li data-font="18" data-hdy-ev="click:setFontSize" class="selected">18像素</li>
                <li data-font="22" data-hdy-ev="click:setFontSize">22像素</li>
                <li data-font="24" data-hdy-ev="click:setFontSize">24像素</li>
                <li data-font="30" data-hdy-ev="click:setFontSize">30像素</li>
                <li data-font="32" data-hdy-ev="click:setFontSize">32像素</li>
                <li data-font="36" data-hdy-ev="click:setFontSize">36像素</li>
                <li data-font="48" data-hdy-ev="click:setFontSize">48像素</li>
            </ul>
        </div>
    </div>
</div>
<!-- 行高 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">行高</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-text-line-height-input" value="1.2" data-hdy-ev="change:setLineHeightInput">
                </div>
                <div class="drop-down-menu-selected-btn set-text-line-height-btn" data-hdy-ev="click:getLineHeightList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list text-line-height-list" style="display: none;">
                <li data-font="1" data-hdy-ev="click:setLineHeight">1</li>
                <li data-font="1.2" data-hdy-ev="click:setLineHeight" class="selected">1.2</li>
                <li data-font="1.5" data-hdy-ev="click:setLineHeight">1.5</li>
                <li data-font="2" data-hdy-ev="click:setLineHeight">2</li>
                <li data-font="2.5" data-hdy-ev="click:setLineHeight">2.5</li>
                <li data-font="3" data-hdy-ev="click:setLineHeight">3</li>
            </ul>
        </div>
    </div>
</div>
<!--字体样式列表-->
<div class="options-item clearfix">
    <div class="text-font-style-box text-font-bold-box" data-hdy-ev="click:setBold">
        <div class="text-font-style-icon text-font-bold-icon"></div>
    </div>
    <div class="text-font-style-box text-font-underline-box" data-hdy-ev="click:setUnderline">
        <div class="text-font-style-icon text-font-underline-icon"></div>
    </div>
    <div class="text-font-style-box text-font-left-box" data-hdy-ev="click:setJustifyLeft">
        <div class="text-font-style-icon text-font-left-icon"></div>
    </div>
    <div class="text-font-style-box text-font-center-box" data-hdy-ev="click:setJustifyCenter">
        <div class="text-font-style-icon text-font-center-icon"></div>
    </div>
    <div class="text-font-style-box text-font-right-box" data-hdy-ev="click:setJustifyRight">
        <div class="text-font-style-icon text-font-right-icon"></div>
    </div>
    <!--<div class="text-font-style-box text-font-link-box" data-hdy-ev="click:setLink">
        <div class="text-font-style-icon text-font-link-icon"></div>
    </div>-->
</div>
<div class="splitline"></div>
<!--宽-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">宽度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-width set-text-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-text-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-text-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-text-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-text-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
                <div class="options-item-input-reduce-icon"></div>
            </div>
        </div>
    </div>
</div>
<!--X-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">X</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-left set-text-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-text-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>
