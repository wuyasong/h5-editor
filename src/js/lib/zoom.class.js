var $ = require('jquery');


function Zoom(options){
	this.draggable = options.view;
	this.resizable = options.resizable;
	this.resizing = null;
	this.onResizeStart = options.onResizeStart;
	this.onResizeMove = options.onResizeMove;
	this.bind();
}

Zoom.prototype.bind = function() {
	var $resizable = $(this.resizable);
	var _this = this;

	// 遍历resizable中的缩放点元素 绑定mousedown事件
	for (var i = 0; i < $resizable.length; i++) {
		$resizable.eq(i).unbind('mousedown').bind('mousedown', function(e){
			_this.start(e, this);
		});
	}
};

Zoom.prototype.start = function(e, self) {
	var _this = this;
	var target_className = e.target.className;
	e.stopPropagation();

	// 记录坐标
	this.startX = e.pageX;
	this.startY = e.pageY;
	this.draggableWidth = this.draggable.width();
	this.draggableHeight = this.draggable.height();
	this.draggableLeft = this.draggable.get(0).offsetLeft;
	this.draggableTop = this.draggable.get(0).offsetTop;
	this.draggableRatio = this.draggableWidth / this.draggableHeight;

	// 判断拖动元素
	if (target_className.indexOf('ui-resizable-nw') != -1) {  // 左上角
		this.resizing = 'ui-resizable-nw';  // 赋值为左上角
	} else if (target_className.indexOf('ui-resizable-ne') != -1) {  // 右上角
		this.resizing = 'ui-resizable-ne';  // 赋值为右上角
	} else if (target_className.indexOf('ui-resizable-sw') != -1) {  // 左下角
		this.resizing = 'ui-resizable-sw';  // 赋值为左下角
	} else if (target_className.indexOf('ui-resizable-se') != -1) {  // 右下角
		this.resizing = 'ui-resizable-se';  // 赋值为右下角
	}

	// 更新currentId
	// console.info(self.parentNode.id)

	if (this.onResizeStart) {
		this.onResizeStart(self.parentNode.id);
	}

	document.onmousemove = function(e){
		_this.move(e);
	}
	document.onmouseup = _this.end;
};

Zoom.prototype.move = function(e) {
	// 判断拖动元素
	switch (this.resizing) {
		case 'ui-resizable-nw':
			// 左上角
			resize_leftTop.call(this, e);
			break;
		case 'ui-resizable-ne':
			// 右上角
			resize_rightTop.call(this, e);
			break;
		case 'ui-resizable-sw':
			// 左下角
			resize_leftBottom.call(this, e);
			break;
		case 'ui-resizable-se':
			// 右下角
			resize_rightBottom.call(this, e);
			break;
	}
	return false;
};

Zoom.prototype.end = function() {
	document.onmousemove =  null;
	document.onmouseup =  null;
	this.draggable = null;
	this.resizable = null;
};

// 左上角操作
function resize_leftTop(e){
	// 改变的距离
	var changeWidth = e.pageX - this.startX;
	var changeHeight = e.pageY - this.startY;
	// 鼠标拖拽的宽高（非等比宽高）
	var width = this.draggableWidth - changeWidth;
	var height = this.draggableHeight - changeHeight;

	var imgW, imgH, imgX, imgY;

	var sratio = this.draggableRatio;
	var cratio = changeWidth / changeHeight;
	// 原始比例大于缩放比例：根据宽度缩放
	if (sratio > cratio) {
		imgW = width;
		imgH = (width / sratio);
		imgX = this.draggableLeft + this.draggableWidth - imgW;
		imgY = this.draggableTop + this.draggableHeight - imgH;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变top值
		this.draggable.css('top', imgY + 'px');
		// 改变left值
		this.draggable.css('left', imgX + 'px');
	}
	else {
		imgW = sratio * height;
		imgH = height;
		imgX = this.draggableLeft + this.draggableWidth - imgW;
		imgY = this.draggableTop + this.draggableHeight - imgH;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变top值
		this.draggable.css('top', imgY + 'px');
		// 改变left值
		this.draggable.css('left', imgX + 'px');
	}
	// 执行onResizeMove回调
	if (this.onResizeMove) {
		this.onResizeMove(
			parseInt(imgW), 
			parseInt(imgH), 
			parseInt(imgX), 
			parseInt(imgY)
		);
	}
}
// 右上角操作
function resize_rightTop(e){
	// 改变的距离
	var changeWidth = e.pageX - this.startX;
	var changeHeight = e.pageY - this.startY;
	// 鼠标拖拽的宽高（非等比宽高）
	var width = changeWidth + this.draggableWidth;
	var height = changeHeight + this.draggableHeight;

	var imgW, imgH, imgX, imgY;

	var sratio = this.draggableRatio;
	var cratio = changeWidth / changeHeight;
	// 原始比例大于缩放比例：根据宽度缩放
	if (sratio > cratio) {
		imgW = width;
		imgH = width / sratio;
		imgX = this.draggableLeft;
		imgY = this.draggableTop + this.draggableHeight - imgH;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变top值
		this.draggable.css('top', imgY + 'px');
	}
	else {
		imgW = sratio * height;
		imgH = height;
		imgX = this.draggableLeft;
		imgY = this.draggableTop + this.draggableHeight - imgH;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变top值
		this.draggable.css('top', imgY + 'px');
	}
	// 执行onResizeMove回调
	if (this.onResizeMove) {
		this.onResizeMove(
			parseInt(imgW), 
			parseInt(imgH), 
			parseInt(imgX), 
			parseInt(imgY)
		);
	}
}
// 左下角操作
function resize_leftBottom(e){
	// 改变的距离
	var changeWidth = e.pageX - this.startX;
	var changeHeight = e.pageY - this.startY;
	// 鼠标拖拽的宽高（非等比宽高）
	var width = this.draggableWidth - changeWidth;
	var height = this.draggableHeight - changeHeight;

	var imgW, imgH, imgX, imgY;

	var sratio = this.draggableRatio;
	var cratio = changeWidth / changeHeight;
	// 原始比例大于缩放比例：根据宽度缩放
	if (sratio > cratio) {
		imgW = width;
		imgH = width / sratio;
		imgX = this.draggableLeft + this.draggableWidth - imgW;
		imgY = this.draggableTop;

		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变left值
		this.draggable.css('left', imgX + 'px');
	}
	else {
		imgW = sratio * height;
		imgH = height;
		imgX = this.draggableLeft + this.draggableWidth - imgW;
		imgY = this.draggableTop;

		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
		// 改变left值
		this.draggable.css('left', imgX + 'px');
	}
	// 执行onResizeMove回调
	if (this.onResizeMove) {
		this.onResizeMove(
			parseInt(imgW), 
			parseInt(imgH), 
			parseInt(imgX), 
			parseInt(imgY)
		);
	}
}
// 右下角操作
function resize_rightBottom(e){
	// 改变的距离
	var changeWidth = e.pageX - this.startX;
	var changeHeight = e.pageY - this.startY;
	// 鼠标拖拽的宽高（非等比宽高）
	var width = changeWidth + this.draggableWidth;
	var height = changeHeight + this.draggableHeight;

	var imgW, imgH, imgX, imgY;

	var ratio = this.draggableRatio;
	var cratio = changeWidth / changeHeight;
	// 原始比例大于缩放比例：根据宽度缩放
	if (ratio > cratio) {
		imgW = width;
		imgH = width / ratio;
		imgX = this.draggableLeft;
		imgY = this.draggableTop;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
	}
	else {
		imgW = ratio * height;
		imgH = height;
		imgX = this.draggableLeft;
		imgY = this.draggableTop;
		// 改变宽高  等比缩放
		this.draggable.width(imgW + 'px');
		this.draggable.height(imgH + 'px');
	}
	// 执行onResizeMove回调
	if (this.onResizeMove) {
		this.onResizeMove(
			parseInt(imgW), 
			parseInt(imgH), 
			parseInt(imgX), 
			parseInt(imgY)
		);
	}
}

module.exports = Zoom;