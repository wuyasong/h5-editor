var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

// 引入验证组件
var validate = require('../lib/validate.class.js');

// 引入拖拽组件
var Drag = require('../lib/drag.class.js');

module.exports = {
	create: function(){
		var _this = this;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		// 设置索引键并为本元素新建独立模型
		var objId = toolbar_model.setKey('button');
		// 设置当前id
		appstore.state.currentId = objId;

		// 创建DOM结构并赋值id 插入DOM
		var $input = $( appstore.template.buttonItem() );
		$input.attr('id', objId);
		$('#previewList li').eq(currentPageIndex).append($input);

		// 创建缩略图dom并插入文档
		var $input_thumb = $( appstore.template.buttonItem() );
		$input_thumb.attr('id', objId + '_th');
		$('.page_thumb').eq(currentPageIndex).append($input_thumb);

		// 添加元素数组
		appstore.UIArr.push(objId);
		// 初始化样式
		toolbar_model.setStyle();

		// 绑定拖拽事件
		this.dragHandler($input);

		// 添加删除事件
		$('.del_button').unbind('click').bind('click', function(){
			_this.delete();
		});

		// 表单视图修改事件
		toolbar_model.setFormView.button();
	},
	add: function(currentPageIndex, objId){
		var _this = this;
		// 获取当前page索引
		// var currentPageIndex = appstore.currentPage;
		// 设置索引键并为本元素新建独立模型
		// var objId = toolbar_model.setKey('button');
		// 设置当前id
		appstore.state.currentId = objId;
		appstore.currentPage = currentPageIndex;

		// 创建DOM结构并赋值id 插入DOM
		var $input = $( appstore.template.buttonItem() );
		$input.attr('id', objId);
		$('#previewList li').eq(currentPageIndex).append($input);

		// 创建缩略图dom并插入文档
		var $input_thumb = $( appstore.template.buttonItem() );
		$input_thumb.attr('id', objId + '_th');
		$('.page_thumb').eq(currentPageIndex).append($input_thumb);

		// 添加元素数组
		// appstore.UIArr.push(objId);
		$('#' + objId).html(appstore.pages[currentPageIndex].UIitem[objId].text);
		// 初始化样式
		toolbar_model.setStyle();
		toolbar_model.setAnimateStyle();

		// 绑定拖拽事件
		this.dragHandler($input);

		// 添加删除事件
		$('.del_button').unbind('click').bind('click', function(){
			_this.delete();
		});

		// 表单视图修改事件
		toolbar_model.setFormView.button();
	},
	dragHandler: function(node) {
		var _this = this;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		//实例化拖拽类并执行
		var drag = new Drag('button', node, function(id){
			var buttonObj = appstore.pages[currentPageIndex].UIitem[id];
			// 显示当前navtable
			var navIndex = node.attr('data-navIndex');
			node.addClass('editing');
			// 其余UI元素失去焦点（编辑状态）
			toolbar_model.blurUIItem(id);
			$('#toolbarNavList li').eq(navIndex).trigger('click');
			// 所有input失去焦点
			$('.toolbar_input').blur();
			// 有动画的动画中按钮高亮
			if (buttonObj.animate.animationType) {
				// $('#' + buttonObj.animate.animationType).addClass('current').siblings().removeClass('current');
				$('.toolbar_box').eq(2).find('.btn_' + buttonObj.animate.animationType).addClass('current').siblings().removeClass('current');
				// 切换持续延迟时间状态
				$('.toolbar_box').eq(2).find('.animation_duration').val(parseFloat(buttonObj.animate['-webkit-animation-duration']));
				$('.toolbar_box').eq(2).find('.animation_delay').val(parseFloat(buttonObj.animate['-webkit-animation-delay']));
			} else {
				$('.toolbar_box').eq(2).find('.animate_button').removeClass('current');
				$('.toolbar_box').eq(2).find('.btn_none').addClass('current');
				$('.toolbar_box').eq(2).find('.animation_duration').val(1);
				$('.toolbar_box').eq(2).find('.animation_delay').val(0);
			}
			// 更新右侧表单项视图
			toolbar_model.setView.button();
			// console.info(buttonObj)
		}, function(x, y){
			// 更新模型
			toolbar_model.setFormViewModel({styles:{left: x, top: y}});
			// 更新缩略图样式
			toolbar_model.setStyle();
		});
		drag.init();
	},
	delete: function(){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var id = appstore.state.currentId;
		var _this = this;
		var r;
		if (id && /button_/.test(id)) {
			r = confirm('确认删除按钮？');

			if (r) {
				// 删除对应模型
				delete appstore.pages[currentPageIndex].UIitem[id];
				// DOM移除
				$('#' + id).remove();
				$('#' + id + '_th').remove();
			}
		} else {
			alert('请选中按钮');
		}
	}
};