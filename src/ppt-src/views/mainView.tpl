<div class="header">
    <h1 class="top-logo">微展 h5编辑器</h1>
    <div class="top-menu">
        <ul class="top-menu-list">
            <li class="top-menu-save"><em></em></li>
            <li class="top-menu-publist"><em></em></li>
            <li class="top-menu-qrcode"><em></em></li>
            <li class="top-menu-set"><em></em></li>
        </ul>
    </div>
    <div class="top-title">
        <input type="text" class="top-title-input" value="" placeholder="请输入标题">
    </div>
</div>
<div class="main-body">
    <!--toolbar-->
    <div class="main-toolbar">
        <div class="main-toolbar-topbar"></div>
        <div class="main-toolbar-item main-toolbar-text">
            <div class="main-toolbar-icon main-toolbar-text-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-text-tip">添加文本</div>
        </div>
        <div class="main-toolbar-item main-toolbar-view">
            <div class="main-toolbar-icon main-toolbar-view-icon"></div>
            <div class="main-toolbar-tip main-toolbar-view-tip">添加容器</div>
        </div>
        <div class="main-toolbar-item main-toolbar-button">
            <div class="main-toolbar-icon main-toolbar-button-icon"></div>
            <div class="main-toolbar-tip main-toolbar-button-tip">添加按钮</div>
        </div>
        <div class="main-toolbar-item main-toolbar-image" title="图片">
            <div class="main-toolbar-icon main-toolbar-image-icon"></div>
            <div class="main-toolbar-arrow-icon"></div>
            <div class="main-toolbar-menu main-toolbar-image-menu">
                <div class="main-toolbar-menu-item" data-type="upload">
                    <div class="main-toolbar-menu-item-txt">上传图片</div>
                    <input type="file" class="main-toolbar-menu-upload">
                </div>
                <div class="main-toolbar-menu-item main-toolbar-menu-gallery" data-type="gallery">
                    <div class="main-toolbar-menu-item-txt">从图库选择</div>
                </div>
                <div class="main-toolbar-menu-item main-toolbar-menu-mypic" data-type="mypic">
                    <div class="main-toolbar-menu-item-txt">我的图片</div>
                </div>
            </div>
        </div>
        <div class="main-toolbar-item main-toolbar-audio">
            <div class="main-toolbar-icon main-toolbar-audio-icon"></div>
            <div class="main-toolbar-tip main-toolbar-audio-tip">添加音频</div>
        </div>
        <div class="main-toolbar-item main-toolbar-video">
            <div class="main-toolbar-icon main-toolbar-video-icon"></div>
            <div class="main-toolbar-tip main-toolbar-video-tip">添加视频</div>
        </div>
    </div>
    <!--options-->
    <div class="main-options">
        <!--background-->
        <div class="main-options-body main-options-body-background">
            <div class="main-options-header">
                <ul class="main-options-nav">
                    <li class="current">页面属性</li>
                </ul>
            </div>
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/bg'}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;"></div>
            <div class="main-options-box main-options-box-event" style="display: none;"></div>-->
        </div>
        <!--text-->
        <div class="main-options-body main-options-body-text" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-text'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/text' $data.default.text}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--view-->
        <div class="main-options-body main-options-body-view" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-view'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/view' $data.default.view}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--image-->
        <div class="main-options-body main-options-body-image" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-image'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/image' $data.default.image}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--button-->
        <div class="main-options-body main-options-body-button" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-button'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/button' $data.default.button}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--audio-->
        <div class="main-options-body main-options-body-audio" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-audio'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/audio' $data.default.audio}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--video-->
        <div class="main-options-body main-options-body-video" style="display: none;">
            {{include './controlPanel/tabs' '.main-options-body-video'}}
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/video' $data.default.video}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <div class="main-options-box main-options-box-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>-->
        </div>
        <!--animation-->
        <div class="main-options-box main-options-box-animate" style="display: none;">
            {{include './controlPanel/animation/animation'}}
        </div>
        <!--event-->
        <div class="main-options-box main-options-box-event" style="display: none;">
            {{include './controlPanel/events/event'}}
        </div>
    </div>
    <!--preview-->
    <div class="main-preview">
        <div class="main-preview-page">
            {{each model.pages}}
            <div class="main-preview-page-item"></div>
            {{/each}}
        </div>
        <div class="main-preview-play"></div>
    </div>
    <!--thumb-->
    <div class="main-thumb">
        <div class="main-thumb-topbar"></div>
        <div class="main-thumb-box">
            <ul class="main-thumb-list">
                {{include './thumb/thumblist' model}}
            </ul>
        </div>
    </div>
</div>
<div class="window">
    {{include './win/gallery'}}
    {{include './win/audio'}}
    {{include './win/video'}}
    {{include './win/link'}}
    {{include './win/publish'}}
    {{include './win/pageset'}}
    {{include './win/layerlist'}}
    {{include './win/preview'}}
</div>
<!--右键菜单-->
<ul class="contextmenu-list" style="display: none;"></ul>
<!--ui-loading-->
<div class="loading-window">
    <img src="/images/spinner.gif" class="loading-window-spinner">
</div>