{{each $data.pages as page}}
<div class="main-preview-page-item" style="
{{if currentPage==$index + 1}}display: block;{{else}}display: none;{{/if}}
background-color: {{page.background.backgroundColor}}; 
background-size:{{page.background.backgroundSize}};
{{if page.background.backgroundImage}}background-image: url({{page.background.backgroundImage}});{{/if}}">
</div>
{{/each}}