{{each $data as music}}
<li data-src="{{music.src}}" data-hdy-ev="click:selectMusic">
    <span class="win-audio-name">{{music.name}}</span>
    <span class="win-audio-playbtn play" data-src="{{music.src}}" data-hdy-ev="click:playMusic"></span>
</li>
{{/each}}