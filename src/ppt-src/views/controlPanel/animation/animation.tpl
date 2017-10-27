
<!-- 动画方式 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">动画</div>
    <div class="options-item-content-hor">
        <div class="drop-down-menu">
            <div class="drop-down-menu-selected set-animate-type-btn" data-hdy-ev="click:getAnimateTypeList"><p>无</p><span class="drop-down-menu-selected-arrow"></span></div>
            <ul class="drop-down-menu-list animate-type-list" style="display: none;">
                <li data-animate="" data-hdy-ev="click:setAnimateType" class="selected">无</li>
                <li data-animate="fadeInUp" data-hdy-ev="click:setAnimateType">从上淡入</li>
                <li data-animate="fadeInLeft" data-hdy-ev="click:setAnimateType">从左淡入</li>
                <li data-animate="fadeInRight" data-hdy-ev="click:setAnimateType">从右淡入</li>
                <li data-animate="fadeInDown" data-hdy-ev="click:setAnimateType">从下淡入</li>

                <li data-animate="slideUp" data-hdy-ev="click:setAnimateType">从上弹入</li>
                <li data-animate="slideLeft" data-hdy-ev="click:setAnimateType">从左弹入</li>
                <li data-animate="slideRight" data-hdy-ev="click:setAnimateType">从右弹入</li>
                <li data-animate="slideDown" data-hdy-ev="click:setAnimateType">从下弹入</li>

                <li data-animate="bounceInUp" data-hdy-ev="click:setAnimateType">从上飞入</li>
                <li data-animate="bounceInLeft" data-hdy-ev="click:setAnimateType">从左飞入</li>
                <li data-animate="bounceInRight" data-hdy-ev="click:setAnimateType">从右飞入</li>
                <li data-animate="bounceInDown" data-hdy-ev="click:setAnimateType">从下飞入</li>

                <li data-animate="rotateInUpRight" data-hdy-ev="click:setAnimateType">右上旋入</li>
                <li data-animate="rotateInDownRight" data-hdy-ev="click:setAnimateType">右下旋入</li>
                <li data-animate="rotateInDownLeft" data-hdy-ev="click:setAnimateType">左下旋入</li>
                <li data-animate="rotateInUpLeft" data-hdy-ev="click:setAnimateType">左上旋入</li>

                <li data-animate="fadeIn" data-hdy-ev="click:setAnimateType">淡入</li>
                <li data-animate="bounceIn" data-hdy-ev="click:setAnimateType">飞入</li>
                <li data-animate="rotate" data-hdy-ev="click:setAnimateType">正向旋转</li>
                <li data-animate="rotateReverse" data-hdy-ev="click:setAnimateType">逆向旋转</li>
                <li data-animate="zoomIn" data-hdy-ev="click:setAnimateType">从小到大</li>
                <li data-animate="zoomOut" data-hdy-ev="click:setAnimateType">从大到小</li>
                <li data-animate="bounceOut" data-hdy-ev="click:setAnimateType">弹性放大</li>
            </ul>
        </div>
    </div>
</div>
<!-- 动画时间 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">时间</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-animate-duration-input" data-hdy-ev="change:setAnimateDurationInput" value="1秒">
                </div>
                <div class="drop-down-menu-selected-btn set-animate-duration-btn" data-hdy-ev="click:getAnimateDurationList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list animate-duration-list" style="display: none;">
                <li data-animate="1s" data-hdy-ev="click:setAnimateDuration" class="selected">1秒</li>
                <li data-animate="1.5s" data-hdy-ev="click:setAnimateDuration">1.5秒</li>
                <li data-animate="2s" data-hdy-ev="click:setAnimateDuration">2秒</li>
                <li data-animate="2.5s" data-hdy-ev="click:setAnimateDuration">2.5秒</li>
                <li data-animate="3s" data-hdy-ev="click:setAnimateDuration">3秒</li>
                <li data-animate="3.5s" data-hdy-ev="click:setAnimateDuration">3.5秒</li>
                <li data-animate="4s" data-hdy-ev="click:setAnimateDuration">4秒</li>
                <li data-animate="4.5s" data-hdy-ev="click:setAnimateDuration">4.5秒</li>
            </ul>
        </div>
    </div>
</div>
<!-- 动画次数 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">次数</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-animate-count-input" data-hdy-ev="change:setAnimateCountInput" value="1">
                </div>
                <div class="drop-down-menu-selected-btn set-animate-count-btn" data-hdy-ev="click:getAnimateCountList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list animate-count-list" style="display: none;">
                <li data-animate="1" data-hdy-ev="click:setAnimateCount" class="selected">1</li>
                <li data-animate="2" data-hdy-ev="click:setAnimateCount">2</li>
                <li data-animate="3" data-hdy-ev="click:setAnimateCount">3</li>
                <li data-animate="4" data-hdy-ev="click:setAnimateCount">4</li>
                <li data-animate="infinite" data-hdy-ev="click:setAnimateCount">无限循环</li>
            </ul>
        </div>
    </div>
</div>
<!-- 动画延迟 -->
<div class="options-item clearfix">
    <div class="options-item-title-hor lh26">延迟</div>
    <div class="options-item-content-hor">
        <div class="drop-down-input-menu">
            <div class="drop-down-input-menu-selected">
                <div class="drop-down-input-wrapper">
                    <input type="text" class="drop-down-input set-animate-delay-input" data-hdy-ev="change:setAnimateDelayInput" value="0秒">
                </div>
                <div class="drop-down-menu-selected-btn set-animate-delay-btn" data-hdy-ev="click:getAnimateDelayList">
                    <span class="drop-down-menu-selected-btn-arrow"></span>
                </div>
            </div>
            <ul class="drop-down-input-menu-list animate-delay-list" style="display: none;">
                <li data-animate="0s" data-hdy-ev="click:setAnimateDelay" class="selected">0秒</li>
                <li data-animate="0.5s" data-hdy-ev="click:setAnimateDelay">0.5秒</li>
                <li data-animate="1s" data-hdy-ev="click:setAnimateDelay">1秒</li>
                <li data-animate="1.5s" data-hdy-ev="click:setAnimateDelay">1.5秒</li>
                <li data-animate="2s" data-hdy-ev="click:setAnimateDelay">2秒</li>
                <li data-animate="2.5s" data-hdy-ev="click:setAnimateDelay">2.5秒</li>
                <li data-animate="3s" data-hdy-ev="click:setAnimateDelay">3秒</li>
                <li data-animate="3.5s" data-hdy-ev="click:setAnimateDelay">3.5秒</li>
                <li data-animate="4s" data-hdy-ev="click:setAnimateDelay">4秒</li>
                <li data-animate="4.5s" data-hdy-ev="click:setAnimateDelay">4.5秒</li>
            </ul>
        </div>
    </div>
</div>
