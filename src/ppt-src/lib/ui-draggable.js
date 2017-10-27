/**
 * 拖拽组件
 * 依赖jQuery类库
 * 兼容所有浏览器
 * author: owys
 * @param {Object} dragEle 拖拽元素
 * @param {Object} options 可选参数 包括onDragStart onDragMove
 * @param {Object} activate 是否可执行拖拽的依赖参数
 */

(function(){
    var drags = {
        oriX: null, // 起始拖拽点x
        oriY: null, // 起始拖拽点y
        dx: null, // 移动距离x
        dy: null, // 移动距离y
        offsetX: null,
        offsetY: null,
        width: null,
        height: null,
        left: 0,
        top: 0
    };

    var _getWindow = function(){
        return {
            width: window.innerWidth ? window.innerWidth : document.body.clientWidth,
            height: window.innerHeight ? window.innerHeight : document.body.clientHeight
        }
    }
    
    var uiDraggable = function(dragEle, options){
        this.dragEle = dragEle;
        this.options = options || {};
        this.TimeFn = null;
        this.activate = true;
        this.init();
    };

    uiDraggable.prototype.init = function(){
        var self = this;
        var $dragEle = this.dragEle;
        $dragEle.attr('draggable', false).find('img').attr('draggable', false);
        $dragEle.unbind('mousedown').bind('mousedown', function(e){
            e.stopPropagation();
            // self.options.beforeDrag ? self.options.beforeDrag($dragEle) : void 0;
            self.activate ? self.beginDrag(e) : void 0;
        });
    }

    uiDraggable.prototype.beginDrag = function(e){
        e.preventDefault();
        var self = this;
        document.execCommand('unselect');
        drags.oriX = drags.currX = e.pageX;
        drags.oriY = drags.currY = e.pageY;
        // 计算拖拽元素自身属性
        var startProps = this.calcDragStart(e);
        // 创建拖拽效果DOM
        this.$dragMask = this.setDragDom(startProps);
        // 开始拖拽callback
        this.options.onDragStart ? this.options.onDragStart(drags, this.dragEle) : void 0;
        // 每次开始拖拽时监听mousemove，mouseup事件
        $(document).on('mousemove', function(e){ self.dragMove(e, startProps); });
        $(document).on('mouseup', function(e){ self.dragEnd(startProps); });
    }

    uiDraggable.prototype.calcDragStart = function(e){
        // 获取拖拽元素的宽高和偏移值
        var $dragEle = this.dragEle;
        drags.width = $dragEle.width();
        drags.height = $dragEle.height();
        drags.offsetX = $dragEle.position().left;
        drags.offsetY = $dragEle.position().top;
        
        return {
            width: $dragEle.width(),
            height: $dragEle.height(),
            offsetX: $dragEle.position().left,
            offsetY: $dragEle.position().top,
            limOffsetX: $dragEle.offset().left,
            limOffsetY: $dragEle.offset().top
        };
    }

    uiDraggable.prototype.setDragDom = function(props){
        // 获取拖拽蒙版元素
        var $dragMask = $('#drag-mask').length ? $('#drag-mask') : $('<div id="drag-mask" class="drag-mask">').appendTo(this.options.pageView ?  this.options.pageView : '.pageView');
        // 创建蒙版并先隐藏
        $dragMask.css({
            'position': 'absolute',
            'width':props.width + 'px',
            'height':props.height + 'px',
            'left':props.offsetX + 'px',
            'top':props.offsetY + 'px',
            'background': '#000',
            'opacity': 0.5,
            'visibility': 'hidden'
        });

        return $dragMask;
    }

    // 移除拖拽蒙版操作
    uiDraggable.prototype.unsetDragDom = function(){
        this.$dragMask.css({
            'width': 0,
            'height': 0,
            'visibility': 'hidden'
        });
    }

    // mousemove操作
    uiDraggable.prototype.dragMove = function(e, dragbox){
        e.preventDefault();
        // 计算移动距离
        this.calcDragMove(e, dragbox);
        // 移动拖拽蒙版位置
        this.$dragMask.css({
            'visibility': 'visible',
            'left': dragbox.offsetX + drags.dx + 'px',
            'top': dragbox.offsetY + drags.dy + 'px'
        }); 
        drags.left = drags.offsetX = Math.round(dragbox.offsetX + drags.dx);
        drags.top = drags.offsetY = Math.round(dragbox.offsetY + drags.dy);
        // 拖拽过程callback
        this.options.onDragMove ? this.options.onDragMove(drags) : void 0;
    }

    uiDraggable.prototype.calcDragMove = function(e, dragbox){
        // 计算拖拽范围内的距离
        this.calcDragLimit(e.pageX - drags.oriX, e.pageY - drags.oriY, dragbox);
    }
    
    // 限制拖拽范围
    uiDraggable.prototype.calcDragLimit = function(dx, dy, dragbox){
        var minX = -dragbox.limOffsetX,
            maxX = _getWindow().width - dragbox.limOffsetX - dragbox.width,
            minY = -dragbox.limOffsetY,
            maxY = _getWindow().height - dragbox.limOffsetY - dragbox.height;

        drags.dx = dx < minX ? minX : (dx > maxX ? maxX : dx);
        // drags.dy = dy < minY ? minY : (dy > maxY ? maxY : dy);
        drags.dy = dy;
    }

    uiDraggable.prototype.dragEnd = function(dragbox){
        var $dragEle = this.dragEle;
        // 移除拖拽蒙版
        this.unsetDragDom();
        // 移动拖拽元素位置
        $dragEle.css({
            'left': dragbox.offsetX + drags.dx + 'px',
            'top': dragbox.offsetY + drags.dy + 'px'
        });
        if (drags.dx > 0 || drags.dy > 0) {
            // 拖拽结束callback
            this.options.onDragEnd ? this.options.onDragEnd(drags) : void 0;
        }
        // 重置移动距离
        drags.dx = drags.dy = 0;
        // 清除事件监听
        $(document).off('mousemove').off('mouseup');
    }

    module.exports = uiDraggable;
    window.uiDraggable = uiDraggable;
})();