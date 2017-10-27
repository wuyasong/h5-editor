var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

toolbar_model = {
	uuid: function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	},
	// 混合对象(继承是指向并不能拷贝)
	mixin: function (params) {
		// 将参数列表转为数组
		var source = Array.prototype.slice.call(arguments),
			i = 0,
			prop;

		console.info(source);
		// prop只做指向source[i++]
		// 当source[i++]不为undefined时执行while循环
		while (prop = source[i++]) {
			// 遍历从参数数组中从第2位开始 对象中的所有属性
			for (var key in prop) {
				// 将所有属性都拷贝到参数第一位对象中（继承）
				// if (!params[key]) {
					params[key] = prop[key];
				// }
			}
		}
	},
	// 创建索引键
	setKey: function(type){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		// 创建16进制时间戳
		var id = Date.now();
		var key = type + '_' + currentPageIndex + '_' + id;
		// 浅复制
		var defaultObj = appstore.defaultsProp[type];
		var createObj = {
			id: key,
			type: type
		};
		// this.mixin(createObj, defaultObj);
		// createObj.id = key;
		// createObj.type = type;
		createObj.styles = {};
		createObj.animate = {};
		createObj.audio = {};
		for (var prop in defaultObj) {
			if (prop === 'styles') {
				for (var style in defaultObj[prop]) {
					createObj.styles[style] = defaultObj[prop][style];
				}
			} else if (prop === 'animate') {
				for (var animate in defaultObj[prop]) {
					createObj.animate[animate] = defaultObj[prop][animate];
				}
			} else if (prop === 'audio') {
				for (var audio in defaultObj[prop]) {
					createObj.audio[audio] = defaultObj[prop][audio];
				}
			} else {
				createObj[prop] = defaultObj[prop];
			}
		}
		appstore.pages[currentPageIndex].UIitem[key] = createObj;

		return key;
	},
	createPageId: function(){
		var currentPage = appstore.currentPage;
		return 'pages_' + (+new Date());
	},
	setKeyValue: function(object){
		var resultObj = {};
		for (var key in object) {
			resultObj[key] = object[key];
		}

		return resultObj;
	},
	// 设置元素的样式(更新视图)
	setStyle: function(){
		var id = appstore.state.currentId;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var UIItem = appstore.pages[currentPageIndex].UIitem;
		var styles = UIItem[id].styles, cssText = '';
		var animation = UIItem[id].animate;
		// 复制样式
		for (var key in styles) {
			if (key === 'left' || key === 'top' || key === 'width' || key === 'height' || key === 'border-radius') {
				cssText += key + ':' + styles[key] + 'px;';
			} else {
				cssText += key + ':' + styles[key] + ';';
			}
		}
		// 更新文本显示
		if (UIItem[id].text) {
			$('#' + id + '_th').html(UIItem[id].text);
		}
		$('#' + id).attr('style', cssText);
		$('#' + id + '_th').attr('style', cssText);
	},
	setAnimateStyle: function(){
		var id = appstore.state.currentId;
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var UIItem = appstore.pages[currentPageIndex].UIitem;
		var styles = UIItem[id].styles, 
			animate = UIItem[id].animate, 
			cssText = '';
		var animation = UIItem[id].animate;
		// 复制样式
		for (var key in styles) {
			if (key === 'left' || key === 'top' || key === 'width' || key === 'height' || key === 'border-radius') {
				cssText += key + ':' + styles[key] + 'px;';
			} else {
				cssText += key + ':' + styles[key] + ';';
			}
		}
		// 动画样式
		for (var key in animate) {
			cssText += key + ':' + animate[key] + ';';
		}
		$('#' + id).attr('style', cssText);
		// 绑定动画结束事件
		$('#' + id).unbind('webkitAnimationEnd').bind('webkitAnimationEnd', function(){
			$(this).css('-webkit-animation', 'resetAnimate 0s 0s forwards');
		});
	},
	setPageStyle: function(){
		var currentPageIndex = appstore.currentPage;
		var model = appstore.pages[currentPageIndex];
		var cssText = '';

		// 更新背景
		for (var key in model.background) {
			cssText += key + ':' + model.background[key] + ';';
		}

		$('.create_item_bg_thumbPic').attr('style', cssText);
		$('#previewList li').eq(currentPageIndex).attr('style', cssText);
		$('.page_thumb').eq(currentPageIndex).attr('style', cssText);
		$('.create_item_bgColor').css('background-color', model.background['background-color']);
	},
	// 更新模型（只更新模型）
	setModel: function(obj){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var id = appstore.state.currentId;
		var model = appstore.pages[currentPageIndex].UIitem[id];

		// 遍历要修改的键值对，更新本元素对应的模型树
		for (var key in obj) {
			if (key === 'styles') {
				for (var style in obj.styles) {
					appstore.pages[currentPageIndex].UIitem[id].styles[style] = obj.styles[style];
				}
			} else if (key === 'animate') {
				for (var animate in obj.animate) {
					appstore.pages[currentPageIndex].UIitem[id].animate[animate] = obj.animate[animate];
				}
			} else {
				appstore.pages[currentPageIndex].UIitem[id][key] = obj[key];
			}
		}
		return this;
	},
	setAllViewModel: function(obj){
		this.setFormViewModel(obj);
		this.setStyle();
	},
	// 更新模型（模型与表单视图绑定）
	setFormViewModel: function(obj){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var id = appstore.state.currentId;
		var model = appstore.pages[currentPageIndex].UIitem[id];
		var type = model.type;

		// 遍历要修改的键值对，更新本元素对应的模型树
		for (var key in obj) {
			if (key === 'styles') {
				for (var style in obj.styles) {
					model.styles[style] = obj.styles[style];
				}
			} else {
				model[key] = obj[key];
			}
		}

		// 更新表单项中视图
		this.setView[type]();
		
		return this;
	},
	// 更新单例模型（模型与预览视图绑定）
	setSingelViewModel: function(key, value, deep){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var id = appstore.state.currentId;
		var model = appstore.pages[currentPageIndex].UIitem[id];

		if (deep) {
			appstore.pages[currentPageIndex].UIitem[id][deep][key] = value;
		} else {
			appstore.pages[currentPageIndex].UIitem[id][key] = value;
		}

		if (deep === 'animate') {
			this.setAnimateStyle();
		} else {
			// 更新预览窗视图
			this.setStyle();
		}
	},
	// 更新pages模型（视图模型绑定）
	setPageViewModel: function(obj){
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var model = appstore.pages[currentPageIndex];

		// 遍历要修改的键值对，更新本元素对应的模型树
		for (var key in obj) {
			if (key === 'background') {
				for (var prop in obj.background) {
					model.background[prop] = obj.background[prop];
				}
			} else {
				model[key] = obj[key];
			}
		}

		toolbar_model.setPageStyle();
		return this;
	},
	// 更新音频模型
	setAudioListModel: function (obj) {
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var model = appstore.audioList;

		model[currentPageIndex] = obj;
	},
	// 关联音频播放图片
	setConcatAudioModel: function (data) {
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var currAudioModel = appstore.audioList[currentPageIndex];
		var imgId = data.imgId;
		var model = appstore.pages[currentPageIndex].UIitem[imgId];
		console.info(currentPageIndex);
		console.info(imgId);
		console.info(model.audio);
		// uiitem中当前img元素更新音频属性
		for (var key in data) {
			currAudioModel[key] = data[key];
		}
		key = null;
		for (var prop in currAudioModel) {
			model.audio[prop] = currAudioModel[prop];
		}
		prop = null;
		// this.mixin(model.audio, data, currAudioModel);
		// console.info(imgId);
		// console.info(appstore.pages[currentPageIndex]);
		// console.info(currAudioModel);
		// console.info(appstore.audioList);
		// console.info(model.audio);
		// 音频列表模型中关联图片元素id
		currAudioModel.imgId = imgId;
		return model.audio;
	},
	deleteAudioListModel: function () {
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var audioList = appstore.audioList;
		var imgId = audioList[currentPageIndex].imgId;  // 有imgid说明已关联图片
		var model = appstore.pages[currentPageIndex].UIitem[imgId];

		// 清除关联图片模型
		if (imgId) {
			model.audio = {};
		}
		audioList[currentPageIndex] = undefined;
	},
	// 更新音频列表界面
	setAudioListView: function (data) {
		var _this = this;
		if (data) {
			$('.pageSongNone').hide(); // '本页未添加音频'UI移除
			$('.pageSongInfoWrapper').html( appstore.template.moreAudio.listView(data) );
		} else {
			$('.pageSongNone').show(); // '本页未添加音频'UI显示
			$('.pageSongInfoWrapper').html('');
		}
		// 点击删除按钮操作
        $('.delsongbtn').unbind('click').bind('click', function () {
			_this.deleteAudioListModel();
			_this.setAudioListView(null);
			_this.setConcatAudioView(null);
		});
	},
	// 更新关联音频视图界面
	setConcatAudioView: function (data) {
		if (data) {
			$('#relaPicBox_preview_play').css('background-image', 'url(' + data.playbtn + ')');
			$('#relaPicBox_preview_pause').css('background-image', 'url(' + data.pausebtn + ')');
		} else {
			$('#relaPicBox_preview_play').css('background-image', '');
			$('#relaPicBox_preview_pause').css('background-image', '');
		}
	},
	// 更新视图（仅视图）
	setView: {
		font: function(){
			// 获取当前page索引
			var currentPageIndex = appstore.currentPage,
				model = appstore.pages[currentPageIndex].UIitem[appstore.state.currentId];

			$('.toolbar_font_family').val(model.styles['font-family']);
			$('.toolbar_font_color').val(model.styles['color']);
			$('.toolbar_font_size').val(model.styles['font-size']);
			$('.toolbar_font_lineheight').val(model.styles['line-height']);
			$('.toolbar_font_x').val(model.styles['left']);
			$('.toolbar_font_y').val(model.styles['top']);
			$('.toolbar_font_zindex').val(model.styles['z-index']);
			$('.toolbar_font_width').val(model.styles['width']);
			$('.toolbar_font_text').val(model.text);
		},
		image: function(){
			// 获取当前page索引
			var currentPageIndex = appstore.currentPage,
				model = appstore.pages[currentPageIndex].UIitem[appstore.state.currentId];

			$('.toolbar_image_x').val(model.styles['left']);
			$('.toolbar_image_y').val(model.styles['top']);
			$('.toolbar_image_width').val(model.styles['width']);
			$('.toolbar_image_height').val(model.styles['height']);
			$('.toolbar_image_zindex').val(model.styles['z-index']);
			$('.toolbar_image_link').val(model.link);
		},
		button: function(){
			// 获取当前page索引
			var currentPageIndex = appstore.currentPage,
				model = appstore.pages[currentPageIndex].UIitem[appstore.state.currentId];

			$('.toolbar_button_text').val(model['text']);
			$('.toolbar_button_link').val(model['link']);
			$('.toolbar_button_family').val(model.styles['font-family']);
			$('.toolbar_button_size').val(model.styles['font-size']);
			$('.toolbar_button_bgcolor').val(model.styles['background-color']);
			$('.toolbar_button_borderWidth').val(model.styles['border-width']);
			$('.toolbar_button_borderColor').val(model.styles['border-color']);
			$('.toolbar_button_lineheight').val(model.styles['line-height']);
			$('.toolbar_button_width').val(model.styles['width']);
			$('.toolbar_button_height').val(model.styles['height']);
			$('.toolbar_button_radius').val(model.styles['border-radius']);
			$('.toolbar_button_opacity').val(model.styles['opacity']);
			$('.toolbar_button_color').val(model.styles['color']);
			$('.toolbar_button_x').val(model.styles['left']);
			$('.toolbar_button_y').val(model.styles['top']);
			$('.toolbar_button_zindex').val(model.styles['z-index']);
		}
	},
	// 更新表单视图（视图模型绑定）
	setFormView:{
		font: function(){
			$('.toolbar_font_family').unbind('change').bind('change', this.tabOptions);
			$('.toolbar_font_color').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_size').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_lineheight').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_x').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_y').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_zindex').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_font_width').unbind('change').bind('change', this.setStyleOptions);
		},
		image: function(){
			$('.toolbar_image_x').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_image_y').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_image_width').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_image_height').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_image_zindex').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_image_link').unbind('change').bind('change', this.setPropOptions);
		},
		button: function(){
			$('.toolbar_button_text').unbind('change').bind('change', this.setTextOptions);
			$('.toolbar_button_link').unbind('change').bind('change', this.setPropOptions);
			$('.toolbar_button_family').unbind('change').bind('change', this.tabOptions);
			$('.toolbar_button_size').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_bgcolor').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_borderWidth').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_borderColor').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_lineheight').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_width').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_height').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_radius').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_opacity').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_color').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_x').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_y').unbind('change').bind('change', this.setStyleOptions);
			$('.toolbar_button_zindex').unbind('change').bind('change', this.setStyleOptions);
		},
		animate: function(){
			$('.animation_duration').unbind('change').bind('change', this.setAnimateOptions);
			$('.animation_delay').unbind('change').bind('change', this.setAnimateOptions);
		},
		// 更换select中option字体
		tabOptions: function(){
			var checkValue = $(this).find('option:selected').val();
			var classname = $(this).attr('data-className');
			// 获取当前id
			var id = appstore.state.currentId;

			// 更新模型与预览视图
			toolbar_model.setSingelViewModel(classname, checkValue, 'styles');
			// 更新文本高度
			if (/font_/g.test(id)) {
				var height = $('#' + id).find('.create_font').height();
				toolbar_model.setSingelViewModel('height', height, 'styles');
			}
		},
		setStyleOptions: function(){
			var value = this.value;
			var classname = $(this).attr('data-className');
			// 获取当前id
			var id = appstore.state.currentId;

			// 更新模型与预览视图
			toolbar_model.setSingelViewModel(classname, value, 'styles');
			// 如果为字体为其更新模型中高度
			if (/font_/g.test(id)) {
				var height = $('#' + id).find('.create_font').height();
				toolbar_model.setSingelViewModel('height', height, 'styles');
			}
		},
		setAnimateOptions: function(){
			var value = this.value;
			var propName = $(this).attr('data-propName');
			if (propName === '-webkit-animation-duration' || propName === '-webkit-animation-delay') {
				value = value + 's';
			}
			// 更新模型与预览视图
			toolbar_model.setSingelViewModel(propName, value, 'animate');
		},
		setPropOptions: function(){
			var value = this.value;
			var propName = $(this).attr('data-propName');
			// 获取当前id
			var id = appstore.state.currentId;
			// 更新模型与预览视图
			toolbar_model.setSingelViewModel(propName, value);
		},
		setTextOptions: function(){
			var value = this.value;
			// 获取当前id
			var id = appstore.state.currentId;
			// 更新模型与预览视图
			toolbar_model.setModel({text: value});
			// // 更新文本显示
			$('#' + id).html(value);
			$('#' + id + '_th').html(value);
		}
	},
	setFormViewPreBg: function(value){
		$('.create_item_bgColor').css('background-color', value);
	},
	// 更新背景表单视图
	setBgFormView: function(obj){
		for (var className in obj) {
			$('.' + className).val(obj[className]);
			$('.create_item_bgColor').css('background-color', obj[className]);
		}

		return this;
	},
	focusUIItem: function(){},
	blurUIItem: function(objId){
		for (var i = 0; i < appstore.UIArr.length; i++) {
			if (appstore.UIArr[i] != objId) {
				$('#' + appstore.UIArr[i]).removeClass('editing');
			}
		}
	}
}

module.exports = toolbar_model;