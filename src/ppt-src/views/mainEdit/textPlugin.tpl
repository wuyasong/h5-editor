<div class="ui-draggable controls-image active" id="{{id}}" style="width:{{style.width}}px;display:{{style.display}};left:{{style.left}}px;top:{{style.top}}px;z-index:{{style.zIndex}};" data-hdy-ev="dblclick:onEdit,contextmenu:onContextmenu">
    <em class="ui-resizable ui-resizable-top" data-type="top"></em>
    <em class="ui-resizable ui-resizable-left" data-type="left"></em>
    <em class="ui-resizable ui-resizable-bottom" data-type="bottom"></em>
    <em class="ui-resizable ui-resizable-right" data-type="right"></em>
    <em class="ui-resizable ui-resizable-nw" data-type="lefttop"></em>
    <em class="ui-resizable ui-resizable-ne" data-type="righttop"></em>
    <em class="ui-resizable ui-resizable-sw" data-type="leftbottom"></em>
    <em class="ui-resizable ui-resizable-se" data-type="rightbottom"></em>
    <div id="{{id}}_txteditor" class="txtEditor" contenteditable="false" style="font-family: {{style.fontFamily}};font-size: {{style.fontSize}}px;line-height: {{style.lineHeight}};color: {{style.color}};" data-hdy-ev="blur:onBlur">
        <!--<p>请输入文字</p>-->
        {{#text ? text : '请输入文字'}}
    </div>
</div>