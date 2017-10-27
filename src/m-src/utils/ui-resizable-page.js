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
            targetEle = this.draggable;
            // targetEle = this.setResizeDom();
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
        resizeMove: function(e){
            e.preventDefault();
            // 计算缩放位置
            this.calcResizeMove(e);
            // 改变缩放位置
            targetEle.css({
                'height':  resizes.height
            });
            this.options.onResizeMove ? this.options.onResizeMove(resizes) : void 0;
        },
        calcResizeMove: function(e){
            resizes.dx = e.pageX - resizes.oriX;
            resizes.dy = e.pageY - resizes.oriY;
            switch (this.type) {
                case 'top':
                    this.pageView.css({'bottom': 0, 'top': ''});
                    resizes.height = Math.round(-resizes.dy + resizes.oriH);
                    if (resizes.dy > 0) {
                        this.pageView.height(resizes.height);
                    }
                    break;
                case 'bottom':
                    this.pageView.css({'top': 0, 'bottom': ''});
                    $('.main-preview-box')[0].scrollTop = 99999;
                    resizes.height = Math.round(resizes.dy + resizes.oriH);
                    if (resizes.dy < 0) {
                        this.pageView.height(resizes.height);
                    }
                    break;
            }
        },
        resizeEnd: function(e){
            // 移动缩放元素位置
            this.pageView.css({
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