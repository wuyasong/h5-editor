<div class="container-window window-audio" style="display: none;">
    <div class="mask-layer"></div>
    <div class="audio-box win-box">
        <div class="win-header">
            <ul class="win-header-tabs-1 win-audio-header-tabs">
                <li class="current">我的音乐</li>
                <li>乐库</li>
            </ul>
            <div class="win-header-close" data-hdy-ev="click:closeAudioWin"></div>
        </div>
        <div class="win-topbar">
            <div class="win-topbar-btn select-btn-2">上传歌曲<input type="file" class="file-upload upload-music" data-hdy-ev="change:pushMusic"></div>
            <div class="win-topbar-btn select-btn-2 win-set-audio-src" data-hdy-ev="click:getLinkWin">添加外链</div>
        </div>
        <div class="win-body audio-body">
            <ul class="audio-list clearfix">
            </ul>
            <audio src="" class="audio" style="display: none;"></audio>
            <div class="win-selectbtn win-selectbtn-ok win-audio-ok" data-hdy-ev="click:setMusic">确认</div>
            <div class="win-selectbtn win-selectbtn-cancel win-audio-cancel" data-hdy-ev="click:closeAudioWin">取消</div>
        </div>
    </div>
</div>