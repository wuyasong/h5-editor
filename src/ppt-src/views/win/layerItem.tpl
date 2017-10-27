{{each $data as data i}}
<li class="{{data.id}}_layerItem" data-id="{{data.id}}">
    <div class="layerlist-item-look {{data.style.display}}" data-id="{{data.id}}" data-type="{{data.type}}" data-hdy-ev="click:toggleElement">
        <div class="layerlist-item-look-icon"></div>
    </div>
    <div class="layerlist-item-txt" data-id="{{data.id}}" data-type="{{data.type}}" data-hdy-ev="click:selectElement">{{data.name}}</div>
</li>
{{/each}}