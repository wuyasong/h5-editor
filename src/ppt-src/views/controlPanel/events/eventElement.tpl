<li data-name="无" data-id="" data-hdy-ev="click:setEventElem">无</li>
{{each $data as element}}
    <li data-id="{{element.id}}" data-name="{{element.name}}" data-hdy-ev="click:setEventElem">{{element.name}}</li>
{{/each}}