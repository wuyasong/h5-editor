var component = require('../../component/common');
var layerlist = require('../../component/layer');
var contextmenu = require('../../component/contextmenu');
var contextmenuView = require('../../../views/win/contextmenu.tpl');

var eventHandle = (function(){
    $('.main-toolbar-item').hover(function(){
        $(this).children('.main-toolbar-tip').stop(true, true).fadeIn();
    }, function(){
        $(this).children('.main-toolbar-tip').stop(true, true).fadeOut();
    });
    // 绑定事件指令
    handy.create({
        el: [
            'html',
            '.header',
            '.main-toolbar',
            '.main-preview',
            '.main-thumb',
            '.win-layerlist-close', 
            '.win-layerlist-header'
        ],
        methods: {
            // 重置选中状态到page
            resetState: function (e, $el) {
                // 先执行input的change事件，防止模型选中元素切换引起的bug
                $('input').blur();
                // 所有元素移除拖拽框
                $('.ui-draggable').removeClass('active');
                // 图层列表移除选中状态
                $('.layerlist li').removeClass('active');
                // 更新当前选中元素和选中类型
                model.currentId = null;
                model.currentTools = 'page';
                // 控制面板切换
                $('.main-options-page').show().siblings().hide();
            },
            // 隐藏各下拉列表
            rootHandle: function (e, $el) {
                $('.drop-down-menu-list, .contextmenu-list, .drop-down-input-menu-list, .main-thumb-mask').hide();
                $('.fav-window').fadeOut(200);
            },
            // 键盘事件
            keyboardEvents: function (e, $el) {
                switch (e.keyCode) {
                    case 46:   // del
                        e.preventDefault();
                        destory();
                        break;
                    case 37:   // 左
                        e.preventDefault();
                        moveTo('left', -1);
                        break;
                    case 38:   // 上
                        e.preventDefault();
                        moveTo('top', -1);
                        break;
                    case 39:   // 右
                        e.preventDefault();
                        moveTo('left', 1);
                        break;
                    case 40:   // 下
                        e.preventDefault();
                        moveTo('top', 1);
                        break;
                }
            },
            // 绑定右键菜单事件
            bindContextMenu: function (e, $el) {
                e.preventDefault();
                // 显示菜单
                $('.contextmenu-list').show().css({left: e.clientX, top: e.clientY}).html(contextmenuView({type: 'preview', clipboard: model.clipboard}));
                // 右键菜单项绑定指令
                contextmenu.element();
            },
            /**
             * 关闭弹层
             */
            closeWin: function (e, $el) {
                // 更新模型 设置-开启图层列表
                model.setOptions.isShowLayer = false;
                // 更新设置弹窗视图
                $('.pageset-item-showlayer-checkbox').removeClass('checked');
                $el.parents('.window-layerlist').hide();
            },
            // 图层弹窗按下操作
            layer_dragstart: function (e, $el) {
                var $layer = $('.layerlist-box');
                var oriX = e.pageX;
                var oriY = e.pageY;
                var offsetLeft = parseInt($layer.css('left'));
                var offsetTop = parseInt($layer.css('top'));
                $(document).on('mousemove', function(e){ 
                    moveLayer(e, oriX, oriY, offsetLeft, offsetTop); 
                });
                $(document).on('mouseup', function(e){ 
                    $(document).off('mousemove').off('mouseup'); 
                });
            }
        }
    });

    // 键盘控制元素移动
    function moveTo(key, value) {
        var currentId = model.currentId,
            currentPage = model.currentPage - 1,
            element,
            dis;
        if (currentId) {
            element = $('#' + currentId);
            element_thumb = $('.' + currentId + '_thumb');
            dis = parseInt(element.css(key)) + value;
            // 更新模型
            model.pages[currentPage].component[currentId].style[key] = dis;
            // 更新主编辑区视图
            element.css(key, dis + 'px');
            // 更新缩略图区视图
            element_thumb.css(key, dis + 'px');
            // 更新表单视图
            $('.set-' + model.currentTools + '-' + key).val(dis);
        }
    }

    // 销毁元素
    function destory() {
        var currentId = model.currentId;
        if (currentId) {
            var element = $('#' + currentId);
            var element_thumb = $('.' + currentId + '_thumb');
            // 销毁主编辑区视图和模型
            var currentPage = model.currentPage - 1;
            // 删除索引表中元素
            delete model.elemKey[currentId];
            // 删除模型内元素
            delete model.pages[currentPage].component[currentId];
            // 销毁主编辑区视图
            element.remove();
            // 删除图层列表视图
            layerlist.render();
            component.resetModel();
            // 销毁缩略列表区视图
            element_thumb.remove();
            $('.contextmenu-list').hide();
        }
    }
    
    // 图层弹窗移动操作
    function moveLayer(e, oriX, oriY, offsetLeft, offsetTop) {
        var $layer = $('.layerlist-box');
        e.preventDefault();
        // 移动图层弹窗
        $layer.css({
            left: e.pageX - oriX + offsetLeft,
            top: e.pageY - oriY + offsetTop
        });
    }
});

module.exports = eventHandle;