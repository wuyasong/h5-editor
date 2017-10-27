{{each pages as page}}
<li class="main-thumb-item{{if currentPage==$index + 1}} current{{/if}}" data-hdy-ev="click:select,contextmenu:onContextmenu">
    <div class="main-thumb-number">{{$index + 1}}</div>
    <div class="main-thumb-preview" style="background: {{page.background.backgroundColor}};">
        <div class="main-thumb-preview-content" {{if page.background.backgroundImage}}style="background-image: url({{page.background.backgroundImage}});"{{/if}}>
            {{each page.component as element}}
                {{if element.type === 'text'}}
                    {{include './textView' element}}
                {{else if element.type === 'view'}}
                    {{include './divView' element}}
                {{else if element.type === 'image'}}
                    {{include './imageView' element}}
                {{else if element.type === 'button'}}
                    {{include './buttonView' element}}
                {{else if element.type === 'audio'}}
                    {{include './audioView' element}}
                {{else if element.type === 'video'}}
                    {{include './videoView' element}}
                {{/if}}
            {{/each}}
        </div>
        <div class="main-thumb-preview-topbar">
            <div class="main-thumb-preview-topbar-del" data-hdy-ev="click:delete"></div>
        </div>
        <div class="main-thumb-preview-add" data-hdy-ev="click:create">
            <div class="main-thumb-preview-add-icon">
                <span class="main-thumb-preview-add-line main-thumb-preview-add-s"></span>
                <span class="main-thumb-preview-add-line main-thumb-preview-add-h"></span>
            </div>
        </div>
    </div>
</li>
{{/each}}