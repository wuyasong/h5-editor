<div class="container-window window-publish" style="display: none;">
    <div class="mask-layer"></div>
    <div class="publish-box win-box">
        <div class="win-header">
            <ul class="win-header-tabs-1 publish-tabs">
                <li class="current">完善信息</li>
            </ul>
            <div class="win-header-close"></div>
        </div>
        <div class="win-body publish-body clearfix">
            <div class="publish-content-l fl">
                <p class="publish-content-title">应用名称</p>
                <div class="text-input-box input-box-publish fl">
                    <input type="text" class="text-input set-issue-title" value="{{title}}">
                </div>
                <p class="publish-content-title">应用描述</p>
                <div class="text-input-box textarea-box-publish fl">
                    <textarea type="text" class="text-input set-issue-desc">{{description}}</textarea>
                </div>
            </div>
            <div class="publish-content-r fr">
                <p class="publish-content-title">应用封面</p>
                <div class="publish-content-cover-wrapper">
                    <div class="publish-content-cover default-cover set-issue-shareImg" style="background-image: url({{shareImg ? shareImg : '/images/default-logo.png'}});">
                        <div class="publish-select-pic-btn select-btn-1">修改封面<input type="file" class="file-upload issue-upload-img" data-hdy-ev="change:setAppImg"></div>
                    </div>
                </div>
            </div>
            <div class="win-selectbtn win-selectbtn-ok win-issue-ok" data-hdy-ev="click:saveApp">发布</div>
            <div class="win-selectbtn win-selectbtn-cancel win-issue-cancel" data-hdy-ev="click:closeWin">取消</div>
        </div>
    </div>
</div>