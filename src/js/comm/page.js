var $ = require('jquery');
// 全局数据堆
var appstore = require('appStore');
// 引入公用model方法
var toolbar_model = require('../comm/toolbar.model.js');

var tabPage = {
	tab: function(index){
		var model = appstore.pages[index];
		var cssText = '';
		var imgId, playbtn, pausebtn;
		// 当前li高亮其他移除
		$('#pageNavList li').eq(index).addClass('current').siblings().removeClass('current');
		// preview展示当前位置
		$('#previewList').css('-webkit-transform', 'translateY(' + (-(appstore.preview.height * index)) + 'px)');
		// 背景图预览区更新背景图
		for (var key in model.background) {
			cssText += key + ':' + model.background[key] + ';';
		}
		// 更新背景图片表单侧预览视图
		$('.create_item_bg_thumbPic').attr('style', cssText);
		// 更新背景色表单侧预览视图
		$('.create_item_bgColor').css('background-color', model.background['background-color']);
		// 更新背景色表单侧16进制值
		$('.toolbar_bg_color').val(model.background['background-color']);
		// toolbar_model.setPageStyle();
		// 更新当前page状态
		appstore.currentPage = index;

		// 更新音频界面
		$('#audioCurrPage').html(parseInt(index + 1));
		toolbar_model.setAudioListView(appstore.audioList[index]);
		// 已做音频关联
		if (appstore.audioList[index] && appstore.audioList[index].imgId) {
			imgId = appstore.audioList[index].imgId;
			if (model.UIitem[imgId]) {
				playbtn = model.UIitem[imgId].audio.playbtn;
				pausebtn = model.UIitem[imgId].audio.pausebtn;
				toolbar_model.setConcatAudioView({playbtn: playbtn, pausebtn: pausebtn});
			}
		} else {
			toolbar_model.setConcatAudioView(null);
		}
		// if (appstore.audioList[index]) {
		// 	$('.pageSongNone').hide();
		// 	toolbar_model.setAudioListView(appstore.audioList[index]);
		// } else {
		// 	$('.pageSongNone').show();
		// }
	},
	keyboard: {
		move: function(dir){
			// 当前页数
			var currentPageIndex = appstore.currentPage;
			// 总页数
			var pageCount = appstore.expandPage;
			if (dir === 'up') {
				currentPageIndex = currentPageIndex <= 0 ? 0 : (currentPageIndex - 1);
			} else if (dir === 'down') {
				currentPageIndex = currentPageIndex >= (pageCount - 1) ? currentPageIndex : (currentPageIndex + 1);
			}
			// 切换page状态
			tabPage.tab(currentPageIndex);
		},
		delete: function(navTabCallback){
			// 当前页数
			var currentPageIndex = appstore.currentPage;
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
				// 遍历新的list中li元素html
				// for (var i = 0; i < newPageCount; i++) {
				// 	newPageNavListHtml += appstore.template.pageNavItem(i);
				// }
				// // 整个list中更新html
				// $('#pageNavList').html( newPageNavListHtml  );

				$('#pageNavList li').unbind('click').bind('click', navTabCallback);
				// $('#pageNavList li').unbind('click').bind('click', function(){
				// 	var currentIndex = $(this).index();
				// 	// 切换page状态
				// 	tabPage.tab(currentIndex);
				// 	// 切换object的currentId
				// 	appstore.toolbar.currentId = $('#previewList li').eq(currentIndex).attr('data-id');
				// 	appstore.toolbar.currentBgId = $('#previewList li').eq(currentIndex).attr('data-id');
				// 	// 更新右侧表单项视图
				// 	var fontObj = appstore.toolbar.object[appstore.toolbar.currentBgId];
				// 	toolbar_model.setBgFormView({'toolbar_bg_color': fontObj['background-color']});
				// 	// 缩略图展示
				// 	$('.create_item_bg_thumbPic').css('background-image', fontObj['background-image']);
				// });

				// 切换page状态
				tabPage.tab(newCurrPage);
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
				// 删除背景对象
				// delete appstore.toolbar.object[appstore.toolbar.currentBgId];
				// 切换对象背景对象id
				// appstore.toolbar.currentId = $('#previewList li').eq(newCurrPage).attr('data-id');
				// appstore.toolbar.currentBgId = $('#previewList li').eq(newCurrPage).attr('data-id');
				// console.info(appstore.toolbar.object)



				// 更新page数量
				appstore.expandPage = newPageCount;
			}
		}
	}
};

module.exports = tabPage;