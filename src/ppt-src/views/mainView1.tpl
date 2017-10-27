<div class="header" data-hdy-ev="mousedown:resetState">
    <h1 class="top-logo">微展 h5编辑器</h1>
    <div class="top-menu">
        <ul class="top-menu-list">
            <li class="top-menu-save" data-hdy-ev="click:saveHandler"><em></em></li>
            <li class="top-menu-publist" data-hdy-ev="click:issueHandler"><em></em></li>
            <li class="top-menu-qrcode" data-hdy-ev="click:getPreviewWin"><em></em></li>
            <li class="top-menu-set" data-hdy-ev="click:getPageSetWin"><em></em></li>
        </ul>
    </div>
    <div class="top-title">
        <input type="text" class="top-title-input" value="{{model.title}}" placeholder="请输入标题" data-hdy-ev="change:titleHandler">
    </div>
</div>
<div class="main-body">
    <!--toolbar-->
    <div class="main-toolbar" data-hdy-ev="mousedown:resetState">
        <div class="main-toolbar-topbar"></div>
        <div class="main-toolbar-item main-toolbar-text">
            <div class="main-toolbar-icon main-toolbar-text-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-text-tip">添加文本</div>
        </div>
        <div class="main-toolbar-item main-toolbar-view">
            <div class="main-toolbar-icon main-toolbar-view-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-view-tip">添加容器</div>
        </div>
        <div class="main-toolbar-item main-toolbar-button">
            <div class="main-toolbar-icon main-toolbar-button-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-button-tip">添加按钮</div>
        </div>
        <div class="main-toolbar-item main-toolbar-image">
            <div class="main-toolbar-icon main-toolbar-image-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-image-tip">添加图片</div>
        </div>
        <div class="main-toolbar-item main-toolbar-audio">
            <div class="main-toolbar-icon main-toolbar-audio-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-audio-tip">添加音频</div>
        </div>
        <div class="main-toolbar-item main-toolbar-video">
            <div class="main-toolbar-icon main-toolbar-video-icon" data-hdy-ev="click:create"></div>
            <div class="main-toolbar-tip main-toolbar-video-tip">添加视频</div>
        </div>
    </div>
    <!--options-->
    <div class="main-options">
        <!--background-->
        <div class="main-options-container main-options-page">
            <div class="main-options-header">
                <ul class="main-options-nav">
                    <li class="current">页面属性</li>
                </ul>
            </div>
            <div class="main-options-box main-options-box-style">
                {{include './controlPanel/style/bg' model.pages[0].background}}
            </div>
            <!--<div class="main-options-box main-options-box-animate" style="display: none;"></div>
            <div class="main-options-box main-options-box-event" style="display: none;"></div>-->
        </div>
        <div class="main-options-container main-options-component" style="display: none;">
            {{include './controlPanel/tabs'}}
            <div class="main-options-body main-options-body-style">
                <!--text-->
                <div class="main-options-box main-options-text" style="display: none;">
                    {{include './controlPanel/style/text' $data.default.text}}
                </div>
                <!--view-->
                <div class="main-options-box main-options-view" style="display: none;">
                    {{include './controlPanel/style/view' $data.default.view}}
                </div>
                <!--image-->
                <div class="main-options-box main-options-image" style="display: none;">
                    {{include './controlPanel/style/image' $data.default.image}}
                </div>
                <!--button-->
                <div class="main-options-box main-options-button" style="display: none;">
                    {{include './controlPanel/style/button' $data.default.button}}
                </div>
                <!--audio-->
                <div class="main-options-box main-options-audio" style="display: none;">
                    {{include './controlPanel/style/audio' $data.default.audio}}
                </div>
                <!--video-->
                <div class="main-options-box main-options-video" style="display: none;">
                    {{include './controlPanel/style/video' $data.default.video}}
                </div>
            </div>
            <!--animation-->
            <div class="main-options-body main-options-body-animate" style="display: none;">
                {{include './controlPanel/animation/animation'}}
            </div>
            <!--event-->
            <div class="main-options-body main-options-body-event" style="display: none;">
                {{include './controlPanel/events/event'}}
            </div>
        </div>
    </div>
    <!--preview-->
    <div class="main-preview" data-hdy-ev="mousedown:resetState,contextmenu:bindContextMenu">
        <div class="main-preview-page">
            {{include './mainEdit/editlist' model}}
        </div>
        <div class="main-preview-play" data-hdy-ev="click:animationHandler,mousedown:stopPropagation"></div>
    </div>
    <!--thumb-->
    <div class="main-thumb" data-hdy-ev="mousedown:resetState">
        <div class="main-thumb-topbar"></div>
        <div class="main-thumb-box">
            <ul class="main-thumb-list">
                {{include './thumb/thumblist_empty' model}}
            </ul>
        </div>
        <div class="main-thumb-mask"></div>
    </div>
</div>
<div class="window">
    {{include './win/fav' favourite}}
    {{include './win/gallery'}}
    {{include './win/audio'}}
    {{include './win/video'}}
    {{include './win/link'}}
    {{include './win/publish' model}}
    {{include './win/pageset' model.setOptions}}
    {{include './win/layerlist' model}}
    {{include './win/preview'}}
    <div class="tip-window tip-favourite">页面收藏中</div>
</div>
<!--右键菜单-->
<ul class="contextmenu-list" style="display: none;"></ul>
<!--ui-loading-->
<div class="loading-window">
    <img src="/images/spinner.gif" class="loading-window-spinner">
</div>
<!-- 保存弹层 -->
<div class="saveState layer"></div>