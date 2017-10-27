var $ = require('jquery');
// 全局数据堆
var appstore = require('appStore');
// page公用方法
var page = require('page');
// 引入预览方法
// var preview = require('../comm/page.preview.js');
// 引入公用model方法
var toolbar_model = require('../comm/toolbar.model.js');

var pageControls = {
	init: function(){
		var pageId, currentPage, pageuuId;

		/*$('.expand_logo').unbind('click').bind('click', function(){
			var currentPageIndex = appstore.currentPage;
			var id = appstore.state.currentId;
			var model = appstore.pages[currentPageIndex].UIitem[id];
		});*/

		// 如果是编辑应用 更新模型视图
		if (exp.store) {
			// 当前索引页
			currentPage = appstore.currentPage = 0;
			// 创建pageId
			pageId = appstore.pages[0].id;
			appstore.state.currentPageId = pageId;
			for (var i = 0; i < appstore.expandPage - 1; i++) {
				// 新增navlist中page
				$('#pageNavList li').eq(i).after( appstore.template.pageNavItem(parseInt(i + 1)) );

				// preview创建page
				$('#previewList li').eq(i).after( appstore.template.previewItem() );
				// 预览窗设置id
				$('#previewList li').eq(parseInt(i + 1)).attr('id', appstore.pages[parseInt(i + 1)].id);
				// 缩略窗设置data-id
				$('#pageNavList li').eq(parseInt(i + 1)).attr('data-id', appstore.pages[parseInt(i + 1)].id);
			}
		} else {
			// 当前索引页
			currentPage = appstore.currentPage = 0;
			pageuuId = 'sid_' + toolbar_model.uuid();
			// 初始化创建页对象
			appstore.pages.push({
				id: pageuuId,
				background: toolbar_model.setKeyValue(appstore.defaultsProp.background),
				UIitem: {}
			});
			// 创建pageId
			pageId = toolbar_model.createPageId();
			appstore.state.currentPageId = pageId;
		}
		// 点击页面导航操作
		pageControls.navClickHandler();
		// 键盘delete和上下控制
		pageControls.keyboardController();
		// 添加页面处理
		$('#createPage').unbind('click').bind('click', pageControls.createPageHandler);

		// 预览窗设置id
		$('#previewList li').eq(currentPage).attr('id', pageId);
		// 缩略窗设置data-id
		$('#pageNavList li').eq(currentPage).attr('data-id', pageId);

		// 预览动画
		$('.preview_arrow_play').unbind('click').bind('click', function(){
			// preview.start();
			// 获取当前page索引
			var currentPageIndex = appstore.currentPage;
			var UIItem = appstore.pages[currentPageIndex].UIitem;
			var cssText = '';
			for (var id in UIItem) {
				// UIItem[key]

				// 复制样式
				for (var key in UIItem[id].styles) {
					if (key === 'left' || key === 'top' || key === 'width' || key === 'height' || key === 'border-radius') {
						cssText += key + ':' + UIItem[id].styles[key] + 'px;';
					} else {
						cssText += key + ':' + UIItem[id].styles[key] + ';';
					}
				}
				key = null;
				// 动画样式
				for (var key in UIItem[id].animate) {
					cssText += key + ':' + UIItem[id].animate[key] + ';';
				}
				key = null;
				$('#' + id).attr('style', cssText);
			}
			// toolbar_model.setAnimateStyle();
		});
		// 添加删除页面事件
		$('.page_del').unbind('click').bind('click', function(){
			// 当前页数
			var currentPageIndex = $(this).attr('data-index');
			// 获取新的当前page索引
			var newCurrPage = parseInt(currentPageIndex - 1);
			newCurrPage = newCurrPage < 0 ? 0 : newCurrPage;
			// 总页数
			var pageCount = appstore.expandPage;
			// 获取新的page总数
			var newPageCount = parseInt(appstore.expandPage - 1);

			if (newPageCount <= 0) return;

			var warn = confirm('确定删除该页？');

			if (warn == true) {
				// 重新渲染整个page nav列表
				var newPageNavListHtml = '';
				// navlist中移除page
				$('#pageNavList li').eq(currentPageIndex).remove();
				// preview移除page
				$('#previewList li').eq(currentPageIndex).remove();

				pageControls.navClickHandler();
				
				// 切换page状态
				page.tab(newCurrPage);
				// 删除页对象
				appstore.pages.splice(currentPageIndex, 1);
				// 置空currentId
				appstore.state.currentPageId = $('#pageNavList li').eq(newCurrPage).attr('data-id');;
				appstore.state.currentId = null;
				// 更新显示页数索引
				for (var i = 0; i < $('#pageNavList li').length; i++) {
					$('.page_number').eq(i).html( parseInt(i + 1) );
					$('#pageNavList li').eq(i).attr('data-index', parseInt(i + 1));
				}



				// 更新page数量
				appstore.expandPage = newPageCount;
			}
		});
		// 点击空白处移除元素编辑状态
		// document.body.onmousedown = function(event){
		// 	for (var i = 0; i < appstore.UIArr.length; i++) {
		// 		var id = appstore.UIArr[i];
		// 		if (event.target.id != id && 
		// 			!/create_font/g.test(event.target.className) && 
		// 			!/create_image/g.test(event.target.className) && 
		// 			!/ui-resizable/g.test(event.target.className)) {
		// 			$('#' + id).removeClass('editing').removeClass('active');
		// 			$('#' + id).find('.create_font').attr('contenteditable', false);
		// 			// $('#' + id).find('.create_font').blur();
		// 			// document.execCommand("Unselect");
		// 		}
		// 	}
		// 	// toolbar_model.blurUIItem(id);
		// }
		$('.toolbar_form').bind('mousedown', function(event){
			event.stopPropagation();
		});
		$(document).bind('mousedown', function(event){
			for (var i = 0; i < appstore.UIArr.length; i++) {
				var id = appstore.UIArr[i];
				$('#' + id).removeClass('editing').removeClass('active');
				$('#' + id).find('.create_font').attr('contenteditable', false);
			}
		});
	},
	// 页面导航点击操作
	navClickHandler: function(){
		$('#pageNavList li').unbind('click').bind('click', this.navTabHandler);
	},
	// 切换页面操作
	navTabHandler: function (){
		var currentIndex = $(this).index();
		var pageId = $(this).attr('data-id');
		// 切换page状态
		page.tab(currentIndex);
		// 切换state中当前页id
		appstore.state.currentPageId = pageId;
	},
	// 键盘按键操作
	keyboardController: function (){
		var _this = this;
		$(document).unbind('keydown').bind('keydown', function(event){
			switch (event.keyCode) {
				case 38: //上
					page.keyboard.move('up');
					break;
				case 40: //下
					page.keyboard.move('down');
					break;
				case 46: //delete
					page.keyboard.delete(_this.navTabHandler);
					break;
			}
		});
	},
	// 点击添加页面的操作
	createPageHandler: function (){
		var _this = this;
		// 获取最后一页索引
		var oldPageIndex = parseInt(appstore.expandPage - 1);
		// 获取新的当前page索引
		var newCurrPage = parseInt(oldPageIndex + 1);
		// 获取新的page总数
		var newPageCount = parseInt(appstore.expandPage + 1);

		// 新增navlist中page
		$('#pageNavList li').eq(oldPageIndex).after( appstore.template.pageNavItem(newCurrPage) );

		// preview创建page
		$('#previewList li').eq(oldPageIndex).after( appstore.template.previewItem() );
		// 重置点击页面导航操作
		pageControls.navClickHandler();

		// 当前索引页
		var currentPage = appstore.currentPage;
		var pageuuId = 'sid_' + toolbar_model.uuid();
		// 初始化创建页对象
		appstore.pages.push({
			id: pageuuId,
			background: toolbar_model.setKeyValue(appstore.defaultsProp.background),
			UIitem: {}
		});
		// 创建pageId
		var pageId = toolbar_model.createPageId();
		appstore.state.currentPageId = pageId;
		// 预览窗设置id
		$('#previewList li').eq(currentPage).attr('id', pageId);
		// 缩略窗设置data-id
		$('#pageNavList li').eq(currentPage).attr('data-id', pageId);
		// 切换page状态
		page.tab(newCurrPage);

		// 更新page数量
		appstore.expandPage = newPageCount;

		// 添加删除页面事件
		$('.page_del').unbind('click').bind('click', function(){
			// 当前页数
			var currentPageIndex = $(this).attr('data-index');
			// 获取新的当前page索引
			var newCurrPage = parseInt(currentPageIndex - 1);
			newCurrPage = newCurrPage < 0 ? 0 : newCurrPage;
			// 总页数
			var pageCount = appstore.expandPage;
			// 获取新的page总数
			var newPageCount = parseInt(appstore.expandPage - 1);

			if (newPageCount <= 0) return;

			var warn = confirm('确定删除该页？');

			if (warn == true) {
				// 重新渲染整个page nav列表
				var newPageNavListHtml = '';
				// navlist中移除page
				$('#pageNavList li').eq(currentPageIndex).remove();
				// preview移除page
				$('#previewList li').eq(currentPageIndex).remove();

				pageControls.navClickHandler();
				
				// 切换page状态
				page.tab(newCurrPage);
				// 删除页对象
				appstore.pages.splice(currentPageIndex, 1);
				// 置空currentId
				appstore.state.currentPageId = $('#pageNavList li').eq(newCurrPage).attr('data-id');;
				appstore.state.currentId = null;
				// 更新显示页数索引
				for (var i = 0; i < $('#pageNavList li').length; i++) {
					$('.page_number').eq(i).html( parseInt(i + 1) );
					$('#pageNavList li').eq(i).attr('data-index', parseInt(i + 1));
				}



				// 更新page数量
				appstore.expandPage = newPageCount;
			}
		});
	}
};

module.exports = pageControls.init;