{{each $data.pages as page}}
    <div class="screen" style="
            background-color:{{page.background.backgroundColor}};
            {{if page.background.backgroundImage}}background-image:url({{page.background.backgroundImage}});{{/if}}
            background-position:{{page.background.backgroundPosition}};
            background-size:{{page.background.backgroundSize}};">
        <div class="screen_box">
            {{each page.component as element}}
                <div class="page_elem" id="{{element.id}}" data-type="{{element.type}}" style="
                    width:{{element.style.width * 2 / 100}}rem;
                    height:{{element.style.height * 2 / 100}}rem;
                    left:{{element.style.left / 320 * 100}}%;
                    top:{{element.style.top / 504 * 100}}%;
                    z-index:{{element.style.zIndex}};
                    {{if element.animation.name}}
                        -webkit-animation: {{element.animation.name}} {{element.animation.duration}} {{element.animation.delay}} {{element.animation.count}} both;
                        -moz-animation: {{element.animation.name}} {{element.animation.duration}} {{element.animation.delay}} {{element.animation.count}} both;
                        animation: {{element.animation.name}} {{element.animation.duration}} {{element.animation.delay}} {{element.animation.count}} both;
                    {{/if}}">
                    <!--文本-->
                    {{if element.type === 'text'}}
                        <div class="page_inner" style="
                            font-family:{{element.style.fontFamily}};
                            font-size:{{element.style.fontSize * 2 / 100}}rem;
                            line-height:{{element.style.lineHeight}};
                            color:{{element.style.color}};">
                            {{#element.text}}
                        </div>
                    <!--容器-->
                    {{else if element.type === 'view'}}
                        <div class="page_inner_view" style="
                        border:{{element.style.borderWidth}}px solid {{element.style.borderColor}};
                        border-radius:{{element.style.borderRadius}}px;
                        opacity:{{element.style.opacity}};
                        background:{{if element.style.backgroundImage}}url({{element.style.backgroundImage}}) {{element.style.backgroundPosition}} no-repeat{{/if}} {{element.style.backgroundColor}};
                        background-size:{{element.style.backgroundSize}};">
                        </div>
                    <!--按钮-->
                    {{else if element.type === 'button'}}
                        <div class="page_inner" style="
                            text-align:center;
                            border-radius:{{element.style.borderRadius}}px;
                            opacity:{{element.style.opacity}};
                            background:{{element.style.backgroundColor}};
                            border:{{element.style.borderWidth}}px solid {{element.style.borderColor}};
                            font-family:{{element.style.fontFamily}};
                            font-size:{{element.style.fontSize * 2 / 100}}rem;
                            color:{{element.style.color}};">
                            {{element.text}}
                        </div>
                    <!--图片-->
                    {{else if element.type === 'image'}}
                        <div class="page_inner" style="
                            border:{{element.style.borderWidth}}px solid {{element.style.borderColor}};
                            border-radius:{{element.style.borderRadius}}px;
                            opacity:{{element.style.opacity}};
                            overflow:hidden;">
                            {{if element.link != null}}
                                <a href="{{element.link}}">
                                    <img src="{{element.src}}" class="page_inner_img" draggable="false">
                                </a>
                            {{else}}
                                <img src="{{element.src}}" class="page_inner_img" draggable="false">
                            {{/if}}
                        </div>
                    <!--音频-->
                    {{else if element.type === 'audio'}}
                        <div class="page_inner" data-playImg="{{element.image.play}}" data-pauseImg="{{element.image.pause}}" style="
                            background:{{if element.image.play}}url({{element.image.play}}) no-repeat{{/if}} center center;
                            background-size:cover;">
                            <audio src="{{element.src}}" class="page_inner_audio"></audio>
                        </div>
                    <!--视频-->
                    {{else if element.type === 'video'}}
                        <div class="page_inner" style="
                            background:{{if element.poster}}url({{element.poster}}) no-repeat{{/if}} #ddd;
                            background-size:cover;">
                            <video src="{{element.src}}" class="page_inner_video" controls></video>
                        </div>
                    {{/if}}
                </div>
            {{/each}}
        </div>
    </div>
{{/each}}