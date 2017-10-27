var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

function Drag(type, node, callback_start, callback_move){
	this.node = node;
	this.type = type;
	this.callback_start = callback_start;
	this.callback_move = callback_move;
}

Drag.prototype.init = function() {
	var _this = this;
	this.node.unbind('mousedown').bind('mousedown', function(e){
		e.stopPropagation();
		if (!$(this).hasClass('active')) {
			_this.start(e, this);
		}
	});
};

Drag.prototype.start = function(e, self) {
	var _this = this;
	self.startX = e.pageX;
	self.startY = e.pageY;
	e.stopPropagation();
	document.onmousemove = function(e){
		_this.move(e, self);
	};
	document.onmouseup = function(e){
		_this.end(e, self);
	};
	// 更新currentId
	appstore.state.currentId = self.id;

	if (_this.callback_start) {
		_this.callback_start(appstore.state.currentId);
	}
	
};

Drag.prototype.move = function(e, self) {
	var disX = e.pageX - self.startX;
	var disY = e.pageY - self.startY;
	var left = parseInt(self.style.left || 0) + disX;
	var top = parseInt(self.style.top || 0) + disY;
	self.style.left = left + 'px';
	self.style.top = top + 'px';
	self.startX = e.pageX;
	self.startY = e.pageY;

	// 回调更新操作
	if (this.callback_move) {
		this.callback_move(left, top);
	}
};

Drag.prototype.end = function(e, self) {
	document.onmousemove =  null;
	document.onmouseup =  null;
	this.node = null;
};

module.exports = Drag;