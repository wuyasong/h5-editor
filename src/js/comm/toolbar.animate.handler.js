var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');


var Animation = {
	open: function(){
		$('.animate_button').unbind('click').bind('click', function(){
			// toolbar_animate.open(this);
			// 获取当前对象id
			var currentId = appstore.state.currentId;
			// 获取当前按钮的动画类型
			var animationName = $(this).attr('data-animation');
			// var animationDuration = $('.animation_duration').val() || 1;
			// var animationDelay = $('.animation_delay').val() || 0;
			if (currentId) {
				// 更新模型
				// var currentPageIndex = appstore.currentPage;
				// var id = appstore.state.currentId;
				// var model = appstore.pages[currentPageIndex].UIitem[id];

				// appstore.pages[currentPageIndex].UIitem[id].animate['animationType'] = animationName;
				// appstore.pages[currentPageIndex].UIitem[appstore.state.currentId]['animate']['-webkit-animation-name'] = animationName;
				if (animationName !== 'none') {
					toolbar_model.setModel({animate:{'animationType': animationName, '-webkit-animation-name': animationName}});
				} else {
					toolbar_model.setModel({animate:{'animationType': '', '-webkit-animation-name': ''}});
				}
				console.info(appstore)

				/*toolbar_model.setModel({
					'animationType': animationName,
					'-webkit-animation-name': animationName,
					'-webkit-animation-duration': animationDuration + 's',
					'-webkit-animation-timing-function': 'ease-out',
					'-webkit-animation-delay': animationDelay + 's',
					'-webkit-animation-fill-mode': 'both'
				});*/
				// 绑定动画结束事件
				$('#' + currentId).unbind('webkitAnimationEnd').bind('webkitAnimationEnd', function(){
					$(this).css('-webkit-animation', 'resetAnimate 0s 0s forwards');
				});
				// 更新页面样式视图
				toolbar_model.setAnimateStyle();

				$(this).addClass('current').siblings().removeClass('current');
			}
		});
		toolbar_model.setFormView.animate();
	}
};

module.exports = Animation;