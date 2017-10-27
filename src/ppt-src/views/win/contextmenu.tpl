<!--右键菜单-->
{{if type === 'text' || type === 'view' || type === 'image' || type === 'button' || type === 'audio' || type === 'video'}}
    <li class="contextmenu-item-copy" data-hdy-ev="click:copyElement">复制</li>
    <li class="contextmenu-item-destory" data-hdy-ev="click:destory">删除</li>
    <li class="contextmenu-item-copyAnimation" data-hdy-ev="click:copyAnimation">复制动画</li>
    <li class="contextmenu-item-paste {{if !clipboard.element}}disabled{{/if}}" data-hdy-ev="click:pasteElement">粘贴</li>
    <li class="contextmenu-item-pasteAnimation {{if !clipboard.animation}}disabled{{/if}}" data-hdy-ev="click:pasteAnimation">粘贴动画</li>
{{else if type === 'page'}}
    <li class="contextmenu-item-copyPage" data-hdy-ev="click:copyPage">复制本页</li>
    <li class="contextmenu-item-delPage" data-hdy-ev="click:delPage">删除本页</li>
    <li class="contextmenu-item-favPage" data-hdy-ev="click:favPage">收藏本页</li>
{{else if type === 'preview'}}
    <li class="contextmenu-item-paste {{if !clipboard.element}}disabled{{/if}}" data-hdy-ev="click:pasteElement">粘贴</li>
{{/if}}