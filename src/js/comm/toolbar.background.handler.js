var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

// 引入验证组件
var validate = require('../lib/validate.class.js');

var toolbar_bg_controls = {
	changeColor: function(self){
		var value = self.value;
		
		// 更新模型视图
		toolbar_model.setPageViewModel({background: {'background-color': value}});
	},
	changeImage: function(self){
		var _this = this;
		var xhr = new XMLHttpRequest(),
			formData = new FormData(),
			file = self.files[0],
			img = new Image();

		if (!/jpeg|jpg|png|bmp/gi.test(file.type)) {
			alert('请上传jpg|png|bmp类型图片');
			return;
		}
		// 检测图片大小
		if (file.size > 2 * 1024 * 1024) {
			alert('请上传小于2MB的图片');
			return false;
		}

		// 显示loading状态
		$('.loading').show();
		// 显示进度条
		$('.upbg_progress').show();

		// 添加表单项
		formData.append('create_bg_img', file);
		// 上传进度
		xhr.upload.onprogress = function(e){
			// 判断进度信息是否可用的布尔值
			if (e.lengthComputable) {
				// 获取已经传输的字节
				var loaded = e.loaded;
				// 获取要传输的总字节
				var total = e.total;
				// 计算百分比
				$('#bg_currProgress').width( Math.ceil(loaded / total * 100) + '%' );
			}
		}
		// 服务器响应成功后
		xhr.onload = function(){
			self.value = '';
			// 返回背景路径
			var data = JSON.parse(xhr.responseText);
			if (data.retcode === 1) {
				// 添加背景路径
				img.src = data.path;
				img.onload = function(){
					$('.loading').hide();
					// 进度条移除
					setTimeout(function() {
						$('.upbg_progress').hide();
						$('#bg_currProgress').width( '1%' );
					}, 200);
					// 插入图片库
					// _this.insertIntoImgLib(this.width, this.height, data.path.replace(/\.\//g, '/'));
					// 更新模型视图
					toolbar_model.setPageViewModel({background: {'background-image': 'url(' + data.path.replace(/\.\//g, '/') + ')'}});
					// 绑定删除背景事件
					$('.create_item_bg_close').unbind('click').bind('click', _this.deleteBg);
				}
			} else {
				$('.loading').hide();
				$('.upbg_progress').hide();
				$('#bg_currProgress').width( '1%' );
				alert('上传失败，错误原因：' + data.errMsg);
			}
		}
		xhr.onerror = function(){
			$('.loading').hide();
			$('.upbg_progress').hide();
			$('#bg_currProgress').width( '1%' );
			self.value = '';
			alert('上传失败');
		}
		// 请求服务器接口文件
		xhr.open('POST', '/h5/uploadBg');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(formData);
	},
	add: function(){
		toolbar_model.setPageStyle();
		// 绑定删除背景事件
		$('.create_item_bg_close').unbind('click').bind('click', this.deleteBg);
	},
	deleteBg: function(){
		toolbar_model.setPageViewModel({background: {'background-image': ''}});
	},
	insertIntoImgLib: function(width, height, path){
		$.ajax({
			type: 'GET',
			url: '/insertImageLib',
			data: {src: path, width: width, height: height},
			success: function(data){
				if (JSON.parse(data).retcode == 1) {
					// console.info('存储到图片资源库成功');
				} else {
					// console.info('存储到图片资源库失败');
				}
			}
		});
	}
};

module.exports = toolbar_bg_controls;