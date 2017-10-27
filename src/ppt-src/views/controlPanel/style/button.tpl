<!--文字-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">文字</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-button-text" value="{{text}}" placeholder="" data-hdy-ev="change:setText">
        </div>
    </div>
</div>
<!-- 字体 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">字体</div>
    <div class="options-item-content-hor">
        <div class="drop-down-menu">
            <div class="drop-down-menu-selected set-button-font-family-btn" data-hdy-ev="click:getFontFamilyList"><p>默认</p><span class="drop-down-menu-selected-arrow"></span></div>
            <ul class="drop-down-menu-list button-font-family-list" style="display: none;">
                <li data-font="" data-hdy-ev="click:setFontFamily" class="selected">默认</li>
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
        <div class="options-item-color set-button-color" style="background-color:{{style.color}};"></div>
    </div>
</div>
<!-- 字号 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">字号</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-button-font-size-input" value="{{style.fontSize}}像素" data-hdy-ev="change:setFontSizeInput">
                </div>
                <div class="drop-down-menu-selected-btn set-button-font-size-btn" data-hdy-ev="click:getFontSizeList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list button-font-size-list" style="display: none;">
                <li data-font="12" data-hdy-ev="click:setFontSize">12像素</li>
                <li data-font="14" data-hdy-ev="click:setFontSize">14像素</li>
                <li data-font="16" data-hdy-ev="click:setFontSize" class="selected">16像素</li>
                <li data-font="18" data-hdy-ev="click:setFontSize">18像素</li>
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
<!-- 背景色 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">背景色</div>
    <div class="options-item-content-hor">
        <div class="options-item-color set-button-bgcolor" style="background-color:{{style.backgroundColor}};"></div>
    </div>
</div>
<!-- 边框 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">边框</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-button-border-input" value="无" data-hdy-ev="change:setBorderWidthInput">
                </div>
                <div class="drop-down-menu-selected-btn set-button-border-btn" data-hdy-ev="click:getBorderWidthList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list button-border-width-list" style="display: none;">
                <li data-border="0" data-hdy-ev="click:setBorderWidth" class="selected">无</li>
                <li data-border="1" data-hdy-ev="click:setBorderWidth">1像素</li>
                <li data-border="2" data-hdy-ev="click:setBorderWidth">2像素</li>
                <li data-border="3" data-hdy-ev="click:setBorderWidth">3像素</li>
                <li data-border="4" data-hdy-ev="click:setBorderWidth">4像素</li>
                <li data-border="5" data-hdy-ev="click:setBorderWidth">5像素</li>
            </ul>
        </div>
    </div>
</div>
<!-- 边框色 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">边框色</div>
    <div class="options-item-content-hor">
        <div class="options-item-color set-button-border-color" style="background-color:{{style.borderColor}};"></div>
    </div>
</div>
<!--链接-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">链接</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box options-item-input-link">
            <input type="text" class="text-input set-button-link" value="" placeholder="请输入跳转链接" data-hdy-ev="change:setLink">
        </div>
    </div>
</div>
<!--圆角-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">圆角</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar button-border-radius-progress-bar">
                    <div class="progress-curr-btn set-button-border-radius" data-hdy-ev="mousedown:getBorderRadiusProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num button-border-radius-txt">{{style.borderRadius}}px</div>
    </div>
</div>
<!--透明度-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">透明度</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar button-opacity-progress-bar" style="width:100%">
                    <div class="progress-curr-btn set-button-opacity" data-hdy-ev="mousedown:getOpacityProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num button-opacity-txt">100%</div>
    </div>
</div>
<div class="splitline"></div>
<!--宽-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">宽度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-width set-button-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-button-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-button-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-button-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-button-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
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
            <input type="text" class="text-input set-base-left set-button-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-button-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>