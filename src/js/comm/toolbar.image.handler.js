var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

// 引入验证组件
var validate = require('../lib/validate.class.js');

// 引入拖拽组件
var Drag = require('../lib/drag.class.js');

// 引入缩放组件
var Zoom = require('../lib/zoom.class.js');

var imageHandler = {
    create: function(self) {
        var _this = this;

        this.uploadImg(self);
    },
    add: function(path, objId, width, height, pageIndex) {
        var _this = this;
        // 右侧表单项缩略图展示
        $('#create_item_image_thumbPic').css('background-image', 'url(' + path + ')');
        // 创建id
        // var objId = toolbar_model.setKey('image'); 
        // 设置为当前id
        appstore.state.currentId = objId;
        appstore.currentPage = pageIndex;
        // 添加元素数组
        // appstore.UIArr.push(objId);
        // 实例ui_resizable组件
        _this.ui_resizable.init(path, objId, width, height, pageIndex);
        toolbar_model.setAnimateStyle();
        // 表单视图修改事件
        toolbar_model.setFormView.image();
    },
    setImage: function(width, height, path) {
        var _this = this;
        // 右侧表单项缩略图展示
        $('#create_item_image_thumbPic').css('background-image', 'url(' + path + ')');
        // 创建id
        var objId = toolbar_model.setKey('image');
        // 设置为当前id
        appstore.state.currentId = objId;
        // 添加元素数组
        appstore.UIArr.push(objId);
        // 实例ui_resizable组件
        _this.ui_resizable.init(path, objId, width, height);
        // 表单视图修改事件
        toolbar_model.setFormView.image();
    },
    checkType: function(file) {
        if (!/jpeg|jpg|png|bmp|gif/gi.test(file.type)) {
            alert('请上传jpg,png,bmp,gif类型图片');
            return false;
        } else {
            return true;
        }
    },
    checkSize: function(file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('请上传小于2MB的图片');
            return false;
        } else {
            return true;
        }
    },
    // 上传图片操作
    uploadImg: function(self, callback) {
        var _this = this,
            xhr = new XMLHttpRequest(),
            formData = new FormData(),
            file = self.files[0],
            img = new Image();

        // 检测图片类型
        if (!this.checkType(file)) {
            return;
        }
        // 检测图片大小
        if (!this.checkSize(file)) {
            return;
        }
        // 添加表单项
        formData.append('create_img', file);
        // 上传进度
        xhr.upload.onprogress = function(e) {
            // 判断进度信息是否可用的布尔值
            if (e.lengthComputable) {
                // 获取已经传输的字节
                var loaded = e.loaded;
                // 获取要传输的总字节
                var total = e.total;
                // 计算百分比
                $('#img_currProgress').width(Math.ceil(loaded / total * 100) + '%');
            }
        };
        // 服务器响应成功后
        xhr.onload = function() {
            self.value = '';
            // 返回图片url
            var data = JSON.parse(xhr.responseText);
            if (data.retcode === 1) {
                img.src = data.path;
                img.onload = function() {
                    // loading移除
                    $('.loading').hide();
                    // 进度条移除
                    setTimeout(function() {
                        $('.upimg_progress').hide();
                        $('#img_currProgress').width('1%');
                    }, 200);
                    // 插入图片库
                    // _this.insertIntoImgLib(this.width, this.height, data.path);
                    // callback.call(this, this.width, this.height, data.path);
                    _this.setImage(this.width, this.height, data.path);
                };
            } else {
                $('.loading').hide();
                $('.upimg_progress').hide();
                $('#img_currProgress').width('1%');
                alert('上传失败，错误原因：' + data.errMsg);
            }
        };
        xhr.onerror = function() {
                self.value = '';
                alert('上传失败');
            }
            // 请求服务器接口文件
        xhr.open('POST', '/h5/uploadImg');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(formData);

        // 显示进度条
        $('.upimg_progress').show();
        // 显示loading状态
        $('.loading').show();
    },
    ui_resizable: {
        init: function(src, id, width, height, pageIndex) {
            var $imgObj = $(appstore.template.ui_resizable(src, id));
            $imgObj.addClass('editing');
            // 获取当前page索引
            var currentPageIndex = appstore.currentPage;
            // 插入DOM
            $('#previewList li').eq(currentPageIndex).append($imgObj);
            // 创建图片缩略图并插入DOM
            $('.page_thumb').eq(currentPageIndex).append('<div class="ui-draggable" id="' + id + '_th"><img src="' + src + '" class="create_image"></div>');
            // 初始化宽高
            var zoom = this.initZoomIn($imgObj, width, height);
            // 非首次创建
            if (pageIndex !== undefined) {
                zoom.width = width;
                zoom.height = height;
            }

            // 更新模型
            toolbar_model.setAllViewModel({
                'src': src,
                'styles': {
                    'width': zoom.width,
                    'height': zoom.height,
                }
            });
            // 绑定单击事件
            $imgObj.unbind('mousedown').bind('mousedown', function(event) {
                event.stopPropagation();
                $(this).addClass('editing');
                // 其余UI元素失去焦点（编辑状态）
                toolbar_model.blurUIItem(id);
            });
            $imgObj.unbind('mouseup').bind('mouseup', function(event) {
                $(this).addClass('editing');
                // 其余UI元素失去焦点（编辑状态）
                toolbar_model.blurUIItem(id);
            });
            // 拖拽操作
            this.draggableHandler($imgObj);
            // 实例缩放类
            this.zoomHandler();
            // 删除操作
            this.deleteHandler();
        },
        initZoomIn: function(selector, imgW, imgH) {
            var winW = appstore.preview.width,
                winH = appstore.preview.height,
                ratioW,
                ratioH;

            // 保持原始尺寸
            if (imgW < winW && imgH < winH) {
                ratioW = imgW;
                ratioH = imgH;
            }
            // 缩放到预览窗大小
            else {
                if ((imgW / imgH) >= (winW / winH)) {
                    // 缩放宽度 
                    ratioW = winW;
                    ratioH = winW / (imgW / imgH);
                } else {
                    // 缩放高度
                    ratioW = (imgW / imgH) * winH;
                    ratioH = winH;
                }
            }

            return {
                'width': parseInt(ratioW),
                'height': parseInt(ratioH)
            };
        },
        draggableHandler: function(imgElem) {
            var node = $('#' + appstore.state.currentId);
            // 获取当前page索引
            var currentPageIndex = appstore.currentPage;
            //实例化拖拽类并执行
            var drag = new Drag('image', node, function(id) {
                var imgObj = appstore.pages[currentPageIndex].UIitem[id];
                // 显示当前navtable
                var navIndex = node.attr('data-navIndex');
                $('#toolbarNavList li').eq(navIndex).trigger('click');
                imgElem.addClass('editing');
                // 其余UI元素失去焦点（编辑状态）
                toolbar_model.blurUIItem(id);
                // 所有input失去焦点
                $('.toolbar_input').blur();
                // 动画按钮高亮
                if (imgObj.animate.animationType) {
                    // 切换动画按钮状态
                    $('.toolbar_box').eq(1).find('.btn_' + imgObj.animate.animationType).addClass('current').siblings().removeClass('current');
                    // 切换持续延迟时间状态
                    $('.toolbar_box').eq(1).find('.animation_duration').val(parseFloat(imgObj.animate['-webkit-animation-duration']));
                    $('.toolbar_box').eq(1).find('.animation_delay').val(parseFloat(imgObj.animate['-webkit-animation-delay']));
                } else {
                    $('.toolbar_box').eq(1).find('.animate_button').removeClass('current');
                    $('.toolbar_box').eq(1).find('.btn_none').addClass('current');
                    $('.toolbar_box').eq(1).find('.animation_duration').val(1);
                    $('.toolbar_box').eq(1).find('.animation_delay').val(0);
                }
                $('#create_item_image_thumbPic').css('background-image', 'url(' + imgObj.src + ')');
                // 更新右侧表单项视图
                toolbar_model.setView.image();
            }, function(x, y) {
                // 更新模型
                toolbar_model.setAllViewModel({
                    'styles': {
                        left: x,
                        top: y
                    }
                });
            });
            drag.init();
        },
        zoomHandler: function() {
            var id = appstore.state.currentId;
            var elem = $('#' + id);
            new Zoom({
                'view': elem,
                'resizable': '.ui-resizable_' + id, // 缩放点的选择器
                onResizeStart: function(id) {
                    appstore.state.currentId = id;
                },
                onResizeMove: function(w, h, x, y) {
                    // 更新模型
                    toolbar_model.setFormViewModel({
                        styles: {
                            width: w,
                            height: h,
                            left: x,
                            top: y
                        }
                    });
                    // 更新缩略图样式
                    toolbar_model.setStyle();
                }
            });
        },
        deleteHandler: function() {
            $('#create_item_image_close').unbind('click').bind('click', function() {

                // 获取当前page索引
                var id = appstore.state.currentId;
                // 获取当前page索引
                var currentPageIndex = appstore.currentPage;
                var r = confirm('确认删除图片？');

                if (r) {
                    // 有音频关联则删除音频列表中选项
                    if (appstore.pages[currentPageIndex].UIitem[id].audio.src) {
                        console.info(appstore.audioList);
                        // 删除模型关联
                        // toolbar_model.deleteAudioListModel();
                        delete appstore.audioList[currentPageIndex].imgId;
                        console.info(appstore.audioList);
                        // 更新视图
                        toolbar_model.setConcatAudioView(null);
                    }
                    // 删除对应模型
                    delete appstore.pages[currentPageIndex].UIitem[id];
                    // DOM移除
                    $('#create_item_image_thumbPic').css('background-image', '');
                    $('#' + id).remove();
                    $('#' + id + '_th').remove();
                }
            });
        }
    },
    insertIntoImgLib: function(width, height, path) {
        $.ajax({
            type: 'GET',
            url: '/insertImageLib',
            data: {
                src: path,
                width: width,
                height: height
            },
            success: function(data) {
                if (JSON.parse(data).retcode == 1) {
                    // console.info('存储到图片资源库成功');
                } else {
                    // console.info('存储到图片资源库失败');
                }
            }
        });
    },
    getImgLib: function() {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: '/h5/getImageLib',
            success: function(data) {
                var data = JSON.parse(data);
                // 获取到数据
                if (data.retcode == 1) {
                    // 图片库中没有数据
                    if (data.imglib.length === 0) {
                        $('#imglib_box').html('<p class="imglib_txt">图片库中还没有数据</p>');
                        return;
                    } else {
                        $('#imglib_box').html(appstore.template.imglibList(data.imglib));
                        $('.imglib_list li').unbind('click').bind('click', function() {
                            // $('.imglib_box').hide();
                            // $('.upimg_box').show();
                            $('.selectImg_nav li').eq(0).addClass('current').siblings().removeClass('current');
                            // _this.createHandler($(this).attr('data-width'), $(this).attr('data-height'), $(this).attr('data-src'));
                            _this.setImage($(this).attr('data-width'), $(this).attr('data-height'), $(this).attr('data-src'));
                        });
                    }
                }
                // 获取数据失败
                else {
                    console.info('查询图片库失败');
                }
            }
        });
    },
};

module.exports = imageHandler;