<!-- 背景色 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">背景色</div>
    <div class="options-item-content-hor">
        <div class="options-item-color set-view-bgcolor" style="background-color: {{style.backgroundColor}};"></div>
    </div>
</div>
<!-- 边框 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">边框</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-view-border-input" value="无" data-hdy-ev="change:setBorderWidthInput">
                </div>
                <div class="drop-down-menu-selected-btn set-view-border-btn" data-hdy-ev="click:getBorderWidth">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list view-border-list" style="display: none;">
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
        <div class="options-item-color set-view-border-color" style="background-color: {{style.borderColor}};"></div>
    </div>
</div>
<!--链接-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">链接</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box options-item-input-link">
            <input type="text" class="text-input set-view-link" value="" placeholder="请输入跳转链接" data-hdy-ev="change:setLink">
        </div>
    </div>
</div>
<!--圆角-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">圆角</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar view-border-radius-progress-bar">
                    <div class="progress-curr-btn set-view-border-radius" data-hdy-ev="mousedown:getBorderRadiusProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num view-border-radius-txt">0px</div>
    </div>
</div>
<!--透明度-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">透明度</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar view-opacity-progress-bar" style="width:100%;">
                    <div class="progress-curr-btn set-view-opacity" data-hdy-ev="mousedown:getOpacityProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num view-opacity-txt">100%</div>
    </div>
</div>
<!--背景图预览区域-->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">背景图</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-view-bgImg" data-hdy-ev="click:getGalleryWin">选择背景</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview view-bgImg-preview"></div>
            <div class="options-item-imgview-topbar">
                <div class="options-item-imgview-close view-bgImg-delete" data-hdy-ev="click:deleteBgImg"></div>
            </div>
        </div>
    </div>
</div>
<!-- 背景位置 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">位置</div>
    <div class="options-item-content-hor">
        <div class="drop-down-menu">
            <div class="drop-down-menu-selected set-view-bg-position" data-hdy-ev="click:getBgPositionList"><p>居中对齐</p><span class="drop-down-menu-selected-arrow"></span></div>
            <ul class="drop-down-menu-list view-bg-position-list" style="display: none;">
                <li data-position="center" data-hdy-ev="click:setBgPosition" class="selected">居中对齐</li>
                <li data-position="top" data-hdy-ev="click:setBgPosition">顶对齐</li>
                <li data-position="bottom" data-hdy-ev="click:setBgPosition">底对齐</li>
                <li data-position="left" data-hdy-ev="click:setBgPosition">左对齐</li>
                <li data-position="right" data-hdy-ev="click:setBgPosition">右对齐</li>
            </ul>
        </div>
    </div>
</div>
<!-- 背景尺寸 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">尺寸</div>
    <div class="options-item-content-hor">
        <div class="drop-down-menu">
            <div class="drop-down-menu-selected set-view-bg-size" data-hdy-ev="click:getBgSizeList"><p>cover</p><span class="drop-down-menu-selected-arrow"></span></div>
            <ul class="drop-down-menu-list view-bg-size-list" style="display: none;">
                <!--<li data-size="" data-hdy-ev="click:setBgSize" class="selected">默认</li>-->
                <li data-size="cover" data-hdy-ev="click:setBgSize" class="selected">cover</li>
                <li data-size="contain" data-hdy-ev="click:setBgSize">contain</li>
            </ul>
        </div>
    </div>
</div>
<div class="splitline"></div>
<!--宽-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">宽度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-width set-view-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-view-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-view-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-view-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-view-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
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
            <input type="text" class="text-input set-base-left set-view-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-view-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>