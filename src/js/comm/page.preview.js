var $ = require('jquery');
// 全局数据堆
var appstore = require('appStore');

module.exports = {
	start: function(){
		// console.info(appstore.currentPage)
		console.info(appstore.toolbar.object)
		// 执行预览动画
		for (var key in appstore.toolbar.object) {
			// 选取本屏的元素
			if (new RegExp('_' + appstore.currentPage + '_').test(key)) {
				console.info(key)
				this.setStyle(key);
			}
		}
		
	},
	// 设置元素的样式(更新视图)
	setStyle: function(currentId){
		var id = currentId;
		var styles = appstore.toolbar.object[id];
		var cssText = '';
		for (var key in styles) {
			switch (key){
				case 'left':
					cssText += key + ':' + styles[key] + 'px;';
					break;
				case 'top':
					cssText += key + ':' + styles[key] + 'px;';
					break;
				case 'text':
					continue;
					break;
				case 'src':
					continue;
					break;
				default:
					cssText += key + ':' + styles[key] + ';';
					break;
			}
		}

		$('#' + id).attr('style', cssText);
	},
};