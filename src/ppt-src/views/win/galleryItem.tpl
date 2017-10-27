{{each $data as img}}
<li style="background-image: url({{img.src}});" data-src="{{img.src}}" data-width="{{img.width}}" data-height="{{img.height}}" data-hdy-ev="click:selectImg"></li>
{{/each}}