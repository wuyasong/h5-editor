<div class="fav-window">
    <div class="main-options-header">
        <ul class="main-options-nav">
            <li class="current">收藏模板</li>
        </ul>
    </div>
    <div class="fav-container">
        <ul class="fav-list clearfix">
            <li class="fav-item-blank" data-hdy-ev="click:createBlankPage">
                <span class="fav-add-icon"></span>
                <div class="fav-add-txt">空白模板</div>
            </li>
            {{each $data as item}}
                <li class="fav-item-temp" data-hdy-ev="click:createFavPage" data-key="{{item.imgUrl}}"><img src="{{item.imgUrl}}" class="fav-item-pic"></li>
            {{/each}} 
        </ul>
    </div>
</div>