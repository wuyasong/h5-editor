<div class="ui-draggable controls-view active" id="{{id}}" style="width:{{style.width}}px;height:{{style.height}}px;display:{{style.display}};left:{{style.left}}px;top:{{style.top}}px;z-index:{{style.zIndex}};" data-hdy-ev="contextmenu:onContextmenu">
    <em class="ui-resizable ui-resizable-top" data-type="top"></em>
    <em class="ui-resizable ui-resizable-left" data-type="left"></em>
    <em class="ui-resizable ui-resizable-bottom" data-type="bottom"></em>
    <em class="ui-resizable ui-resizable-right" data-type="right"></em>
    <em class="ui-resizable ui-resizable-nw" data-type="lefttop"></em>
    <em class="ui-resizable ui-resizable-ne" data-type="righttop"></em>
    <em class="ui-resizable ui-resizable-sw" data-type="leftbottom"></em>
    <em class="ui-resizable ui-resizable-se" data-type="rightbottom"></em>
    <div class="drag-ele" style="background-color:{{style.backgroundColor}};
    background-size:{{style.backgroundSize}};
    border-radius:{{style.borderRadius}}px;
    border:{{style.borderWidth}}px {{style.borderStyle}} {{style.borderColor}};
    opacity:{{style.opacity}};
    {{if style.backgroundImage}}background-image: url({{style.backgroundImage}});{{/if}}"></div>
</div>