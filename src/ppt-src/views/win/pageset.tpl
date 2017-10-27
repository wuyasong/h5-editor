<div class="container-window window-pageset" style="display: none;">
    <div class="mask-layer"></div>
    <div class="pageset-box win-box">
        <div class="win-header">
            <ul class="win-header-tabs-1 pageset-tabs">
                <li class="current">页面配置</li>
            </ul>
            <div class="win-header-close" data-hdy-ev="click:closeWin"></div>
        </div>
        <div class="win-body pageset-body">
            <div class="pageset-item">
                <div class="pageset-item-checkbox {{if isOpenLikes}}checked{{/if}}" data-model="isOpenLikes" data-hdy-ev="click:setOptions">
                    <div class="pageset-item-checkbox-icon"></div>
                </div>
                <p class="pageset-item-txt">开启点赞</p>
            </div>
            <div class="pageset-item">
                <div class="pageset-item-checkbox {{if isOpenLook}}checked{{/if}}" data-model="isOpenLook" data-hdy-ev="click:setOptions">
                    <div class="pageset-item-checkbox-icon"></div>
                </div>
                <p class="pageset-item-txt">开启浏览次数</p>
            </div>
            <div class="pageset-item">
                <div class="pageset-item-checkbox {{if isOpenCmt}}checked{{/if}}" data-model="isOpenCmt" data-hdy-ev="click:setOptions">
                    <div class="pageset-item-checkbox-icon"></div>
                </div>
                <p class="pageset-item-txt">开启评论</p>
            </div>
            <div class="pageset-item">
                <div class="pageset-item-checkbox pageset-item-showlayer-checkbox {{if isShowLayer}}checked{{/if}}" data-model="isShowLayer" data-hdy-ev="click:setOptions">
                    <div class="pageset-item-checkbox-icon"></div>
                </div>
                <p class="pageset-item-txt">开启图层列表</p>
            </div>
        </div>
    </div>
</div>