var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

// 引入验证组件
var validate = require('../lib/validate.class.js');

// 引入拖拽组件
var Drag = require('../lib/drag.class.js');

var toolbarControls = {
	// 创建文本元素操作
	create: function(){
		var _this = this;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		// 设置索引键并为本元素新建独立模型
		var objId = toolbar_model.setKey('font');
		// 设置当前id
		appstore.state.currentId = objId;

		// 预览窗口创建DOM结构并赋值id
		var $fontbox = $( appstore.template.fontItem() );
		$fontbox.attr('id', objId).addClass('editing');
		$('#previewList li').eq(currentPageIndex).append($fontbox);

		// 缩略窗口创建DOM结构并赋值id
		var $fontbox_thumb = $( appstore.template.fontItemThumb() );
		$fontbox_thumb.attr('id', objId + '_th');
		$('.page_thumb').eq(currentPageIndex).append($fontbox_thumb);

		// 添加元素数组
		appstore.UIArr.push(objId);
		// 初始化样式
		toolbar_model.setStyle();
		// 绑定单击事件
		$fontbox.unbind('click').bind('click', function(event){
			event.stopPropagation();
			$(this).addClass('editing');
			// 其余UI元素失去焦点（编辑状态）
			toolbar_model.blurUIItem(objId);
		});
		// 绑定双击事件
		$fontbox.unbind('dblclick').bind('dblclick', function(event){
			event.preventDefault();
			$(this).addClass('editing').addClass('active');
			$(this).find('.create_font').attr('contenteditable', true);
			$(this).find('.create_font').focus();
			// 全选文本
			document.execCommand("selectall");
			// 其余UI元素失去焦点（编辑状态）
			toolbar_model.blurUIItem(objId);
		});
		// 绑定拖拽事件
		this.dragHandler($fontbox);
		
		// 表单视图修改事件
		toolbar_model.setFormView.font();

		$fontbox.unbind('keyup').bind('keyup', function(){
			// 更新模型
			var height = $(this).find('.create_font').height();
			toolbar_model.setFormViewModel({text: this.innerText, styles: {height: height}});
			// 更新预览视图
			toolbar_model.setStyle();
		});
		// 添加删除事件
		$('.del_font').unbind('click').bind('click', function(){
			_this.delete();
		});
		// 添加属性data-navIndex
		$fontbox.attr('data-navIndex', 0);
	},
	add: function(currentPageIndex, objId){
		var _this = this;
		// 获取当前page索引
		// var currentPageIndex = appstore.currentPage;
		// 设置索引键并为本元素新建独立模型
		// var objId = toolbar_model.setKey('font');
		// 设置当前id
		appstore.state.currentId = objId;
		appstore.currentPage = currentPageIndex;

		// 预览窗口创建DOM结构并赋值id
		var $fontbox = $( appstore.template.fontItem() );
		$fontbox.attr('id', objId).addClass('editing');
		$('#previewList li').eq(currentPageIndex).append($fontbox);

		// 缩略窗口创建DOM结构并赋值id
		var $fontbox_thumb = $( appstore.template.fontItemThumb() );
		$fontbox_thumb.attr('id', objId + '_th');
		$('.page_thumb').eq(currentPageIndex).append($fontbox_thumb);

		// 添加元素数组
		// appstore.UIArr.push(objId);
		$('#' + objId).children('.create_font').html(appstore.pages[currentPageIndex].UIitem[objId].text);
		// 初始化样式
		toolbar_model.setStyle();
		toolbar_model.setAnimateStyle();

		// 绑定单击事件
		// $fontbox.unbind('click').bind('click', function(event){
		// 	event.stopPropagation();
		// 	$(this).addClass('editing');
		// 	// 其余UI元素失去焦点（编辑状态）
		// 	toolbar_model.blurUIItem(objId);
		// });
		// 绑定双击事件
		$fontbox.unbind('dblclick').bind('dblclick', function(event){
			event.preventDefault();
			$(this).addClass('editing').addClass('active');
			$(this).find('.create_font').attr('contenteditable', true);
			$(this).find('.create_font').focus();
			// 全选文本
			document.execCommand("selectall");
			// 其余UI元素失去焦点（编辑状态）
			toolbar_model.blurUIItem(objId);
		});
		// 绑定拖拽事件
		this.dragHandler($fontbox);
		
		// 表单视图修改事件
		toolbar_model.setFormView.font();

		$fontbox.unbind('keyup').bind('keyup', function(){
			// 更新模型
			var height = $(this).find('.create_font').height();
			toolbar_model.setFormViewModel({text: this.innerText, styles: {height: height}});
			// 更新预览视图
			toolbar_model.setStyle();
		});
		// 添加删除事件
		$('.del_font').unbind('click').bind('click', function(){
			_this.delete();
		});
	},
	dragHandler: function(node) {
		var _this = this;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		//实例化拖拽类并执行
		drag = new Drag('font', node, function(id){
			var fontObj = appstore.pages[currentPageIndex].UIitem[id];
			// 显示当前navtable
			var navIndex = node.attr('data-navIndex');
			node.addClass('editing');
			// 其余UI元素失去焦点（编辑状态）
			toolbar_model.blurUIItem(id);
			$('#toolbarNavList li').eq(navIndex).trigger('click');
			// 所有input失去焦点
			$('.toolbar_input').blur();
			// 有动画的动画中按钮高亮
			if (fontObj.animate.animationType) {
				// $('#' + fontObj.animate.animationType).addClass('current').siblings().removeClass('current');
				$('.toolbar_box').eq(0).find('.btn_' + fontObj.animate.animationType).addClass('current').siblings().removeClass('current');
				// 切换持续延迟时间状态
				$('.toolbar_box').eq(0).find('.animation_duration').val(parseFloat(fontObj.animate['-webkit-animation-duration']));
				$('.toolbar_box').eq(0).find('.animation_delay').val(parseFloat(fontObj.animate['-webkit-animation-delay']));
			} else {
				$('.toolbar_box').eq(0).find('.animate_button').removeClass('current');
				$('.toolbar_box').eq(0).find('.btn_none').addClass('current');
				$('.toolbar_box').eq(0).find('.animation_duration').val(1);
				$('.toolbar_box').eq(0).find('.animation_delay').val(0);
			}
			// 更新右侧表单项视图
			toolbar_model.setView.font();
			// console.info(fontObj)
		}, function(x, y){
			// 更新模型
			toolbar_model.setFormViewModel({styles:{left: x, top: y}});
			// 更新缩略图样式
			toolbar_model.setStyle();
		});
		drag.init();
	},
	// 绑定键盘事件 删除文本
	delete: function(){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var id = appstore.state.currentId;
		var _this = this;
		var r;
		if (id && /font_/.test(id)) {
			r = confirm('确认删除文本？');

			if (r) {
				// 删除对应模型
				delete appstore.pages[currentPageIndex].UIitem[id];
				// DOM移除
				$('#' + id).remove();
				$('#' + id + '_th').remove();
			}
		} else {
			alert('请选中文本');
		}
	}
};

module.exports = toolbarControls;