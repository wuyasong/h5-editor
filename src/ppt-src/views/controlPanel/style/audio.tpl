<!-- 选择歌曲 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">歌曲</div>
    <div class="options-item-content-hor">
        <div class="options-item-select-btn select-btn-1 set-audio-src" data-hdy-ev="click:getAidioWin">选择歌曲</div>
    </div>
</div>
<div class="options-item pr30 clearfix">
    <p class="options-item-title-hor lh26" style="width:100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">当前背景音乐：<span class="currElemMusic"></span></p>
</div>
<!--图片预览区域-->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">播放状态图</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-audio-play-img" data-hdy-ev="click:getGalleryWin_play">选择图片</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview audio-playImg-preview"></div>
            <div class="options-item-imgview-topbar">
                <div class="options-item-imgview-close audio-playImg-delete" data-hdy-ev="click:deletePlayImg"></div>
            </div>
        </div>
    </div>
</div>
<!--图片预览区域-->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">暂停状态图</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-audio-pause-img" data-hdy-ev="click:getGalleryWin_pause">选择图片</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview audio-pauseImg-preview"></div>
            <div class="options-item-imgview-topbar">
                <div class="options-item-imgview-close audio-pauseImg-delete" data-hdy-ev="click:deletePauseImg"></div>
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
            <input type="text" class="text-input set-base-width set-audio-width" value="{{style.width}}像素" data-hdy-ev="change:changeWidth">
        </div>
    </div>
</div>
<!--高-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">高度</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-height set-audio-height" value="{{style.height}}像素" data-hdy-ev="change:changeHeight">
        </div>
    </div>
</div>
<!--层级-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">层级</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-zIndex set-audio-zIndex" value="{{style.zIndex}}" data-hdy-ev="change:changeZIndex">
            <div class="options-item-input-btn options-item-input-add set-base-zIndex-add set-audio-zIndex-add" data-hdy-ev="click:setZIndexAdd">
                <div class="options-item-input-add-icon"></div>
            </div>
            <div class="options-item-input-btn options-item-input-reduce set-base-zIndex-reduce set-audio-zIndex-reduce" data-hdy-ev="click:setZIndexReduce">
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
            <input type="text" class="text-input set-base-left set-audio-left" value="{{style.left}}" data-hdy-ev="change:changeLeft">
        </div>
    </div>
</div>
<!--Y-->
<div class="options-item clearfix">
    <div class="options-item-title-hor w26 lh26">Y</div>
    <div class="options-item-content-hor">
        <div class="text-input-box options-item-input-box">
            <input type="text" class="text-input set-base-top set-audio-top" value="{{style.top}}" data-hdy-ev="change:changeTop">
        </div>
    </div>
</div>