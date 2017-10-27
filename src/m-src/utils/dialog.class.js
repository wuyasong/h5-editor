module.exports = {
	show: function(txt, select){
		var $dialog = select || $('.layer');
		$dialog.html(txt);
		// 淡入元素
		$dialog.css('display', 'block')
		setTimeout(function() {
			$dialog.removeClass('fadeOut').addClass('fadeIn');
		}, 10);
		
		// 延迟2.6s淡出元素
		setTimeout(function() {
			$dialog.removeClass('fadeIn').addClass('fadeOut');
			// 动画完成后隐藏元素
			setTimeout(function() {
				$dialog.css('display', 'none').removeClass('fadeOut');
			}, 600);
		}, 2600);
	}
};