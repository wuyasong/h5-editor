var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
// var mainEdit = require('../mainEdit/main-editor'); 不可引用 循环依赖
// var layerlist = require('../component/layer'); 不可引用 循环依赖
var uiDraggable = require('../../lib/ui-draggable');
var uiResizable = require('../../lib/ui-resizable');
var textView = require('../../views/mainEdit/textPlugin.tpl');
var eventItemView = require('../../views/controlPanel/events/eventItem.tpl');

var common = {
    /**
     * 实例化拖拽事件
     * @param {String} elemId 元素ID
     * @param {String} type 元素类型
     */
    dragEvent: function (elemId, type) {
        var _this = this,
            element = $('#' + elemId);
        var draggleable = new uiDraggable(element, {
            pageView: '.main-preview-page',
            onDragStart: function(draggable, elem){
                $('input').blur();
                // 更新当前状态
                _this.updateEditState(elem.attr('id'), type);
                // 重置文本编辑器及拖拽状态
                _this.updateDragState();
                // 显示表单-样式面板
                $('.panel-tabs li').eq(0).addClass('current').siblings().removeClass('current');
                $('.main-options-component').show().siblings().hide();
                $('.main-options-body-style').show().siblings('.main-options-body').hide();
                $('.main-options-' + type).show().siblings().hide();
                // 更新表单视图
                _this.panel.updateComponentController(type);
            },
            onDragMove: function(draggable){
                var width = parseInt(draggable.width),
                    height = parseInt(draggable.height),
                    left = parseInt(draggable.offsetX),
                    top = parseInt(draggable.offsetY);
                $('.' + model.currentId + '_thumb').css({'width': width, 'height': height, 'left': left, 'top': top});
                // 更新表单视图
                $('.set-' + type + '-width').val(width + '像素');
                $('.set-' + type + '-height').val(height + '像素');
                $('.set-' + type + '-left').val(left);
                $('.set-' + type + '-top').val(top);
            },
            onDragEnd: function(draggable){
                var currentPage = model.currentPage - 1;
                var currentComponent = model.pages[currentPage].component[model.currentId];
                // 更新模型
                currentComponent.style.left = draggable.offsetX;
                currentComponent.style.top = draggable.offsetY;
                currentComponent.style.width = draggable.width;
                currentComponent.style.height = draggable.height;
            }
        });
        // 添加拖拽类到索引表中
        model.elemKey[elemId].draggable = draggleable;
    },
    /**
     * 实例化缩放事件
     * @param {String} elemId 元素ID
     * @param {String} type 元素类型
     */
    resizeEvent: function (elemId, type) {
        var _this = this;
        new uiResizable({
            resizable: $('#' + elemId + ' .ui-resizable'),
            pageView: '.main-preview-page',
            onResizeStart: function(resizable, elem){
                // 更新当前状态
                _this.updateEditState(elem.attr('id'), type);
                // 重置文本编辑器及拖拽状态
                _this.updateDragState();
                // 更新表单视图
                _this.panel.updateComponentController(type);
            },
            onResizeMove: function(resizable){
                var width = parseInt(resizable.width),
                    height = parseInt(resizable.height),
                    left = parseInt(resizable.left),
                    top = parseInt(resizable.top);
                $('.' + model.currentId + '_thumb').css({'width': width, 'height': height, 'left': left, 'top': top});
                // 更新表单视图
                $('.set-' + type + '-width').val(width + '像素');
                $('.set-' + type + '-height').val(height + '像素');
                $('.set-' + type + '-left').val(left);
                $('.set-' + type + '-top').val(top);
            },
            onResizeEnd: function(resizable){
                var currentPage = model.currentPage - 1;
                var currentComponent = model.pages[currentPage].component[model.currentId];
                // 更新模型
                currentComponent.style.left = resizable.left;
                currentComponent.style.top = resizable.top;
                currentComponent.style.width = resizable.width;
                currentComponent.style.height = resizable.height;
            }
        });
    },
    /**
     * 更新模型状态
     */
    updateEditState: function (id, type) {
        // 更新当前选中元素id
        model.currentId = id;
        model.currentTools = type;
        // 添加拖拽框
        $('#' + id).addClass('active').siblings().removeClass('active');
        // 切换tab 并显示对应的表单-样式视图
        $('.panel-tabs li').eq(0).addClass('current').siblings().removeClass('current');
        $('.main-options-component').show().siblings().hide();
        $('.main-options-body-style').show().siblings('.main-options-body').hide();
        $('.main-options-' + type).show().siblings().hide();
        // 图层列表视图选中当前项
        $('.' + id + '_layerItem').addClass('active').siblings().removeClass('active');
    },
    /**
     * 更新图层列表选中状态
     */
    updateLayerState: function (id) {
        $('.' + id + '_layerItem').addClass('active').siblings().removeClass('active');
    },
    /**
     * 重置文本编辑器状态
     * 重置拖拽状态
     */
    updateDragState: function () {
        // 所有文本编辑器取消正在编辑状态
        $('.txtEditor').removeClass('editing').attr('contenteditable', false).unbind('selectstart').bind('selectstart', function(){return false;});
        // 可拖拽
        $.each(model.elemKey, function(i, element){
            element.draggable && (element.draggable.activate = true);
        });
    },
    /**
     * 更新模型为页面类型
     */
    resetModel: function () {
        // 更新当前选中元素和选中类型
        model.currentId = null;
        model.currentTools = 'page';
        // 控制面板切换
        $('.main-options-page').show().siblings().hide();
    },
    panel: {
        updateComponentController: function (type) {
            switch (type) {
                case 'text':
                    this.updateTextView();
                    break;
                case 'view':
                    this.updateDivView();
                    break;
                case 'button':
                    this.updateButtonView();
                    break;
                case 'image':
                    this.updateImageView();
                    break;
                case 'audio':
                    this.updateAudioView();
                    break;
                case 'video':
                    this.updateVideoView();
                    break;
            }
        },
        // 更新页面属性视图
        updatePageView: function () {
            var currentPage = model.currentPage - 1;
            $('.set-page-bgcolor').css('backgroundColor', model.pages[currentPage].background.backgroundColor);
            model.pages[currentPage].background.backgroundImage ?
            $('.bgimg-preview').css('backgroundImage', 'url(' + model.pages[currentPage].background.backgroundImage + ')') :
            $('.bgimg-preview').css('backgroundImage', '');
        },
        // 更新基础样式视图
        updateBaseView: function (type) {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            $('.set-' + type + '-width').val(currentComponent.style.width + '像素');
            $('.set-' + type + '-height').val(currentComponent.style.height + '像素');
            $('.set-' + type + '-zIndex').val(currentComponent.style.zIndex);
            $('.set-' + type + '-left').val(currentComponent.style.left);
            $('.set-' + type + '-top').val(currentComponent.style.top);
        },
        // 更新动画表单视图
        updateAnimationView: function (type) {
            var currentPage = model.currentPage - 1;
            var currentAni = model.pages[currentPage].component[model.currentId].animation;
            var name = $('.animate-type-list li[data-animate="' + (currentAni.name) + '"]').html();
            $('.set-animate-type-btn p').html(name);
            $('.animate-type-list li[data-animate="' + (currentAni.name) + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-animate-duration-input').val(currentAni.duration.slice(0, -1) + '秒');
            $('.animate-duration-list li[data-animate="' + currentAni.duration + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-animate-count-input').val(currentAni.count);
            $('.animate-count-list li[data-animate="' + currentAni.count + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-animate-delay-input').val(currentAni.delay.slice(0, -1) + '秒');
            $('.animate-delay-list li[data-animate="' + currentAni.delay + '"]').addClass('selected').siblings().removeClass('selected');
        },
        // 更新事件表单视图
        updateEventView: function () {
            var currentPage = model.currentPage - 1;
            var currentEvent = model.pages[currentPage].component[model.currentId].events;
            $('.options-event-list').html(eventItemView(currentEvent));
            model.eventComponent && model.eventComponent.optionsEvent();
        },
        // 更新文本表单视图
        updateTextView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            var fontFamily = currentComponent.style.fontFamily || '默认';
            var fontSize = currentComponent.style.fontSize;
            var lineHeight = currentComponent.style.lineHeight;
            $('.set-text-font-family-btn p').html(fontFamily);
            $('.text-font-family-list li[data-font="' + fontFamily + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-text-color').css('backgroundColor', currentComponent.style.color);
            $('.set-text-font-size-input').val(fontSize + '像素');
            $('.text-font-size-list li[data-font="' + fontSize + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-text-line-height-input').val(lineHeight);
            $('.text-line-height-list li[data-font="' + lineHeight + '"]').addClass('selected').siblings().removeClass('selected');
            this.updateBaseView('text');
            this.updateAnimationView();
            this.updateEventView();
        },
        // 更新容器表单视图
        updateDivView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            var borderWidth = currentComponent.style.borderWidth == 0 ? '无' : currentComponent.style.borderWidth + '像素';
            $('.set-view-bgcolor').css('backgroundColor', currentComponent.style.backgroundColor);
            $('.set-view-border-input').val(borderWidth);
            $('.view-border-list li[data-border="' + currentComponent.style.borderWidth + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-view-border-color').css('borderColor', currentComponent.style.borderColor);
            $('.set-view-link').val(currentComponent.link);
            $('.view-border-radius-progress-bar').css('width', currentComponent.style.borderRadius / currentComponent.style.width * 100 + '%');
            $('.view-border-radius-txt').html(currentComponent.style.borderRadius + 'px');
            $('.view-opacity-progress-bar').css('width', currentComponent.style.opacity * 100 + '%');
            $('.view-opacity-txt').html(currentComponent.style.opacity * 100 + '%');
            currentComponent.style.backgroundImage ?
            $('.view-bgImg-preview').css('backgroundImage', 'url(' + currentComponent.style.backgroundImage + ')') :
            $('.view-bgImg-preview').css('backgroundImage', '');
            $('.set-view-bg-position p').html( $('.view-bg-position-list li[data-position="' + currentComponent.style.backgroundPosition + '"]').html() );
            $('.view-bg-position-list li[data-position="' + currentComponent.style.backgroundPosition + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-view-bg-size p').html(currentComponent.style.backgroundSize);
            $('.view-bg-size-list li[data-size="' + currentComponent.style.backgroundSize + '"]').addClass('selected').siblings().removeClass('selected');
            this.updateBaseView('view');
            this.updateAnimationView();
            this.updateEventView();
        },
        // 更新按钮表单视图
        updateButtonView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            var borderWidth = currentComponent.style.borderWidth == 0 ? '无' : currentComponent.style.borderWidth + '像素';
            $('.set-button-color').css('backgroundColor', currentComponent.style.color);
            $('.set-button-bgcolor').css('backgroundColor', currentComponent.style.backgroundColor);
            $('.set-button-border-color').css('backgroundColor', currentComponent.style.borderColor);
            $('.set-button-text').val(currentComponent.text);
            $('.set-button-font-family-btn p').html(currentComponent.style.fontFamily || '默认');
            $('.button-font-family-list li[data-font="' + currentComponent.style.fontFamily + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-button-font-size-input').val(currentComponent.style.fontSize + '像素');
            $('.button-font-size-list li[data-font="' + currentComponent.style.fontSize + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-button-border-input').val(borderWidth);
            $('.button-border-width-list li[data-border="' + currentComponent.style.borderWidth + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-button-link').val(currentComponent.link);
            $('.button-border-radius-progress-bar').css('width', currentComponent.style.borderRadius / currentComponent.style.width * 100 + '%');
            $('.button-border-radius-txt').html(currentComponent.style.borderRadius + 'px');
            $('.button-opacity-progress-bar').css('width', currentComponent.style.opacity * 100 + '%');
            $('.button-opacity-txt').html(currentComponent.style.opacity * 100 + '%');
            this.updateBaseView('button');
            this.updateAnimationView();
            this.updateEventView();
        },
        updateImageView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            var borderWidth = currentComponent.style.borderWidth == 0 ? '无' : currentComponent.style.borderWidth + '像素';
            $('.image-src-preview').css('background-image', 'url(' + currentComponent.src + ')');
            $('.set-image-border-color').css('backgroundColor', currentComponent.style.borderColor);
            $('.set-image-border-input').val(borderWidth);
            $('.image-border-width-list li[data-border="' + currentComponent.style.borderWidth + '"]').addClass('selected').siblings().removeClass('selected');
            $('.set-image-link').val(currentComponent.link);
            $('.image-border-radius-progress-bar').css('width', currentComponent.style.borderRadius / currentComponent.style.width * 100 + '%');
            $('.image-border-radius-txt').html(currentComponent.style.borderRadius + 'px');
            $('.image-opacity-progress-bar').css('width', currentComponent.style.opacity * 100 + '%');
            $('.image-opacity-txt').html(currentComponent.style.opacity * 100 + '%');
            this.updateBaseView('image');
            this.updateAnimationView();
            this.updateEventView();
        },
        updateAudioView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            $('.currElemMusic').html(currentComponent.src).attr('title', currentComponent.src);
            currentComponent.image.play ?
            $('.audio-playImg-preview').css('backgroundImage', 'url(' + currentComponent.image.play + ')') :
            $('.audio-playImg-preview').css('backgroundImage', '');
            currentComponent.image.pause ?
            $('.audio-pauseImg-preview').css('backgroundImage', 'url(' + currentComponent.image.pause + ')') :
            $('.audio-pauseImg-preview').css('backgroundImage', '');
            this.updateBaseView('audio');
            this.updateAnimationView();
            this.updateEventView();
        },
        updateVideoView: function () {
            var currentPage = model.currentPage - 1;
            var currentComponent = model.pages[currentPage].component[model.currentId];
            $('.set-video-src').val(currentComponent.src || '');
            currentComponent.poster ?
            $('.video-poster-preview').css('backgroundImage', 'url(' + currentComponent.poster + ')') :
            $('.video-poster-preview').css('backgroundImage', '');
            this.updateBaseView('video');
            this.updateAnimationView();
            this.updateEventView();
        }
    }
};

module.exports = common;