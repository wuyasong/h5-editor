
<!--图片预览区域-->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">图片</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-image-src" data-hdy-ev="click:getGalleryWin">选择图片</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview image-src-preview"></div>
            <div class="options-item-imgview-topbar">
                <!--<div class="options-item-imgview-close image-src-delete" data-hdy-ev="click:deleteImage"></div>-->
            </div>
        </div>
    </div>
</div>
<!-- 边框 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">边框</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-image-border-input" value="无" data-hdy-ev="change:setBorderWidthInput">
                </div>
                <div class="drop-down-menu-selected-btn set-image-border-btn" data-hdy-ev="click:getBorderWidthList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list image-border-width-list" style="display: none;">
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
        <div class="options-item-color set-image-border-color" style="background-color:{{style.borderColor}};"></div>
    </div>
</div>
<!--链接-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">链接</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box options-item-input-link">
            <input type="text" class="text-input set-image-link" value="" placeholder="请输入跳转链接" data-hdy-ev="change:setLink">
        </div>
    </div>
</div>
<!--圆角-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">圆角</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar image-border-radius-progress-bar">
                    <div class="progress-curr-btn set-image-border-radius" data-hdy-ev="mousedown:getBorderRadiusProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num image-border-radius-txt">{{style.borderRadius}}px</div>
    </div>
</div>
<!--透明度-->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">透明度</div>
    <div class="options-item-content-hor">
        <div class="options-item-progress progress-wrapper">
            <div class="progress-bar">
                <div class="progress-curr-bar image-opacity-progress-bar" style="width:100%">
                    <div class="progress-curr-btn set-image-opacity" data-hdy-ev="mousedown:getOpacityProps">
                        <div class="progress-curr-icon"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="options-item-progress-num image-opacity-txt">100%</div>
    </div>
</div>
<div class="splitline"></div>
<!--宽-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">宽度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-width set-image-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-image-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-image-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-image-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-image-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
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
            <input type="text" class="text-input set-base-left set-image-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-image-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>