
<!-- 选择视频 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">视频链接</div>
    <!--<div class="options-item-content-hor">
        <div class="options-item-select-btn select-btn-1 set-video-src" data-hdy-ev="click:getVideoWin">选择视频</div>
    </div>-->
</div>
<div class="options-item options-item-video-link-box clearfix">
    <div class="text-input-box text-link-box">
        <textarea type="text" class="text-input set-video-src" data-hdy-ev="change:setVideo"></textarea>
    </div>
</div>
<!--图片预览区域-->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">视频封面</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-video-poster" data-hdy-ev="click:getGalleryWin">选择图片</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview video-poster-preview"></div>
            <div class="options-item-imgview-topbar">
                <div class="options-item-imgview-close video-poster-delete" data-hdy-ev="click:deletePoster"></div>
            </div>
        </div>
    </div>
</div>
<div class="splitline"></div>
<!--宽-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">宽度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-width set-video-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-video-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-video-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-video-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-video-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
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
            <input type="text" class="text-input set-base-left set-video-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-video-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>