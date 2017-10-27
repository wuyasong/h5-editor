/**
 * 缩放组件
 * 依赖jQuery类库
 * 兼容所有浏览器
 * author: owys
 */
(function(){
    var vm = require('../adapter/common/vm');
    var targetEle = null;
    var resizes = {
        oriL: null, // 起始拖拽元素偏移左测
        oriT: null, // 起始拖拽元素偏移顶部
        oriX: null, // 起始拖拽点x
        oriY: null, // 起始拖拽点y
        oriW: null, // 起始拖拽宽度
        oriH: null, // 起始拖拽高度
        dx: 0, // 移动距离x
        dy: 0, // 移动距离y
        limit: {
            left: null,
            top: null,
            width: null,
            height: null
        },
        left: null,
        top: null,
        width: null,
        height: null,
        scale: null
    }
    
    // 获取窗口宽高
    var _getWindow = function(){
        return {
            width: window.innerWidth ? window.innerWidth : document.body.clientWidth,
            height: window.innerHeight ? window.innerHeight : document.body.clientHeight
        }
    }

    // 限制范围计算
    var limitOpts = {
        left: function(value){
            return value >= -resizes.oriW ? (value >= resizes.limit.left ? resizes.limit.left : value) : -resizes.oriW;
        },
        top: function(value){
            return value >= -resizes.oriH ? (value >= resizes.limit.top ? resizes.limit.top : value) : -resizes.oriH;
        },
        right: function(value){
            return value >= -resizes.oriW ? (value >= resizes.limit.width - resizes.oriW ? resizes.limit.width - resizes.oriW : value) : -resizes.oriW;
        },
        bottom: function(value){
            return value >= -resizes.oriH ? (value >= resizes.limit.height - resizes.oriH ? resizes.limit.height - resizes.oriH : value) : -resizes.oriH;
        }
    }

    // 缩放类构造函数
    var resizable = function(options){
        this.options = options;
        this.pageView = options.pageView || '.pageView';  // 拖拽元素所在的视口元素
        this.resizable = options.resizable;  // 缩放元素数组
        this.draggable = options.draggable || options.resizable.parent();  // 拖拽元素默认为缩放元素的父元素
        this.activate = true; // 可拖拽状态
        this.init();
    }

    resizable.prototype = {
        init: function(){
            var self = this;
            this.resizable.unbind('mousedown').bind('mousedown', function(e){
                e.stopPropagation();
                self.activate ? self.resizeStart(e) : void 0;
            });
        },
        resizeStart: function(e){
            var self = this;
            e.stopPropagation();
            document.execCommand('unselect');
            // 计算缩放起源点
            this.calcResizeStart(e);
            // 设置缩放效果DOM
            targetEle = this.setResizeDom();
            this.type = e.target.getAttribute('data-type');
            this.options.onResizeStart ? this.options.onResizeStart(resizes, this.draggable) : void 0;
            // 计算缩放限制范围
            // 每次开始缩放时监听mousemove，mouseup事件
            $(document).on('mousemove', function(e){ self.resizeMove(e); });
            $(document).on('mouseup', function(e){ self.resizeEnd(e); });
        },
        calcResizeStart: function(e){
            resizes.oriX = e.pageX;
            resizes.oriY = e.pageY;
            resizes.left = resizes.oriL = this.draggable.position().left;
            resizes.top = resizes.oriT = this.draggable.position().top;
            resizes.width = resizes.oriW = this.draggable.width();
            resizes.height = resizes.oriH = this.draggable.height();
            resizes.scale = resizes.oriW / resizes.oriH;
            resizes.limit.left = this.draggable.offset().left;
            resizes.limit.top = this.draggable.offset().top;
            resizes.limit.width = _getWindow().width - resizes.limit.left;
            resizes.limit.height = _getWindow().height - resizes.limit.top;
        },
        setResizeDom: function(){
            // 获取拖拽蒙版元素
            var $dragMask = $('#drag-mask').length ? $('#drag-mask') : $('<div id="drag-mask" class="drag-mask">').appendTo(this.pageView);
            // 当缩放元素为页面背景时
            if (this.options.page) {
                $dragMask.css({
                    'position': 'absolute',
                    'top': '-1px',
                    'left': '-1px',
                    'width': '322px',  // 加上main-preview两边的边框宽度
                    'height': resizes.oriH + 2 + 'px',
                    'background': '#000',
                    'opacity': 0.5,
                    'visibility': 'visible'
                });
            } else {
                // 创建蒙版并先隐藏
                $dragMask.css({
                    'position': 'absolute',
                    'width': resizes.oriW + 'px',
                    'height': resizes.oriH + 'px',
                    'left': resizes.oriL + 'px',
                    'top': resizes.oriT + 'px',
                    'background': '#000',
                    'opacity': 0.5,
                    'visibility': 'visible'
                });
            }

            return $dragMask;
        },
        unsetResizeDom: function(){
            targetEle.css({
                'visibility': 'hidden'
            });
        },
        resizeMove: function(e){
            e.preventDefault();
            // 计算缩放位置
            this.calcResizeMove(e);
            // 改变缩放位置
            targetEle.css({
                'left': resizes.left + 'px',
                'top': resizes.top + 'px',
                'width': resizes.width + 'px',
                'height':  resizes.height
            });
            // 当缩放元素为页面背景时
            if (this.options.page) {
                var $dragMask = $('#drag-mask');
                $dragMask.css({
                    'position': 'absolute',
                    'top': '-1px',
                    'left': '-1px',
                    'width': '322px',  // 加上main-preview两边的边框宽度
                    'height':  resizes.height + 2 + 'px',
                    'background': '#000',
                    'opacity': 0.5,
                    'visibility': 'visible'
                });
            }
            this.options.onResizeMove ? this.options.onResizeMove(resizes) : void 0;
        },
        calcResizeMove: function(e){
            resizes.dx = e.pageX - resizes.oriX;
            resizes.dy = e.pageY - resizes.oriY;
            switch (this.type) {
                case 'lefttop':
                    // 固定left根据比例计算top 限宽
                    if (resizes.scale >= 1) {
                        resizes.dx = -limitOpts.left(-(resizes.dx));
                        resizes.dy = resizes.dx / resizes.scale;
                    } 
                    // 固定top根据比例计算left 限高
                    else {
                        resizes.dy = -limitOpts.top(-(resizes.dy));
                        resizes.dx = resizes.dy * resizes.scale;
                    }
                    resizes.width = Math.round(-resizes.dx + resizes.oriW);
                    resizes.height = Math.round(-resizes.dy + resizes.oriH);
                    resizes.left = Math.round(resizes.dx + resizes.oriL);
                    resizes.top = Math.round(resizes.dy + resizes.oriT);
                    break;
                case 'righttop':
                    if (resizes.scale >= 1) {
                        resizes.dx = limitOpts.right(resizes.dx);
                        resizes.dy = resizes.dx / resizes.scale;
                    }
                    else {
                        resizes.dy = limitOpts.top(-resizes.dy);
                        resizes.dx = resizes.dy * resizes.scale;
                    }
                    resizes.width = Math.round(resizes.dx + resizes.oriW);
                    resizes.height = Math.round(resizes.dy + resizes.oriH);
                    resizes.top = Math.round(-resizes.dy + resizes.oriT);
                    break;
                case 'leftbottom':
                    if (resizes.scale >= 1) {
                        resizes.dx = -limitOpts.left(-resizes.dx);
                        resizes.dy = resizes.dx / resizes.scale;
                    }
                    else {
                        resizes.dy = -limitOpts.bottom(resizes.dy);
                        resizes.dx = resizes.dy * resizes.scale;
                    }
                    resizes.width = Math.round(-resizes.dx + resizes.oriW);
                    resizes.height = Math.round(-resizes.dy + resizes.oriH);
                    resizes.left = Math.round(resizes.dx + resizes.oriL);
                    break;
                case 'rightbottom':
                    if (resizes.scale >= 1) {
                        resizes.dx = limitOpts.right(resizes.dx);
                        resizes.dy = resizes.dx / resizes.scale;
                    } 
                    else {
                        resizes.dy = limitOpts.bottom(resizes.dy);
                        resizes.dx = resizes.dy * resizes.scale;
                    }
                    resizes.width = Math.round(resizes.dx + resizes.oriW);
                    resizes.height = Math.round(resizes.dy + resizes.oriH);
                    break;
                case 'top':
                    resizes.dy = -limitOpts.top(-resizes.dy);
                    resizes.height = Math.round(-resizes.dy + resizes.oriH);
                    resizes.top = Math.round(resizes.dy + resizes.oriT);
                    break;
                case 'left':
                    resizes.dx = -limitOpts.left(-resizes.dx);
                    resizes.width = Math.round(-resizes.dx + resizes.oriW);
                    resizes.left = Math.round(resizes.dx + resizes.oriL);
                    break;
                case 'bottom':
                    resizes.dy = limitOpts.bottom(resizes.dy);
                    resizes.height = Math.round(resizes.dy + resizes.oriH);
                    break;
                case 'right':
                    resizes.dx = limitOpts.right(resizes.dx);
                    resizes.width = Math.round(resizes.dx + resizes.oriW);
                    break;
            }
        },
        resizeEnd: function(e){
            // 移除拖拽蒙版
            this.unsetResizeDom();
            // 移动缩放元素位置
            this.draggable.css({
                'left': resizes.left + 'px',
                'top': resizes.top + 'px',
                'width': resizes.width + 'px',
                'height': resizes.height + 'px'
            });
            this.options.onResizeEnd ? this.options.onResizeEnd(resizes) : void 0;
            resizes.dx = resizes.dy = 0;
            // 清除事件监听
            $(document).off('mousemove').off('mouseup');
        }
    };

    module.exports = resizable;
    window.resizable = resizable;
})();