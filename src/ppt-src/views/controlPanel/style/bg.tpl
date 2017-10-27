<!-- 背景颜色 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh22">背景色</div>
    <div class="options-item-content-hor">
        <div class="options-item-color set-page-bgcolor" style="background:{{backgroundColor}};"></div>
    </div>
</div>
<!-- 背景图片 -->
<div class="options-item clearfix">
    <div class="options-item-title-vert">
        <span class="fl">背景图</span>
        <div class="options-item-select-btn select-btn-1 fr mr20 set-page-bgImg" data-hdy-ev="click:getGalleryWin">选择背景</div>
    </div>
    <div class="options-item-content-vert">
        <div class="options-item-imgview-box">
            <div class="options-item-imgview bgimg-preview" {{if backgroundImage}}style="background-image: url({{backgroundImage}});"{{/if}}></div>
            <div class="options-item-imgview-topbar">
                <div class="options-item-imgview-close bgimg-delete" data-hdy-ev="click:deleteBgImg"></div>
            </div>
        </div>
    </div>
</div>
<!-- 背景音乐 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">背景音乐</div>
    <div class="options-item-content-hor">
        <div class="options-item-select-btn select-btn-1 set-page-bgMusic" data-hdy-ev="click:getAidioWin">选择音频</div>
    </div>
</div>
<div class="options-item pr30 clearfix">
    <p class="options-item-title-hor lh26" style="width:100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">当前背景音乐：<span class="currBgMusic"></span></p>
</div>