var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

var shareImageHandler = {
    create: function(self) {
        var _this = this;

        this.uploadImg(self);
        this.deleteHandler();
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
    deleteHandler: function() {
        $('#create_item_shareImg_close').unbind('click').bind('click', function() {

            var r = confirm('确认删除图片？');

            if (r) {
                // DOM移除
                $('#create_item_shareImg_thumbPic').css('background-image', '');
            }
        });
    },
    setImage: function(src) {
        // 右侧表单项缩略图展示
        $('#create_item_shareImg_thumbPic').css('background-image', 'url(' + src + ')');
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
        formData.append('create_shareImg', file);
        formData.append('sessionid', exp.sessionid);
        // 上传进度
        xhr.upload.onprogress = function(e) {
            // 判断进度信息是否可用的布尔值
            if (e.lengthComputable) {
                // 获取已经传输的字节
                var loaded = e.loaded;
                // 获取要传输的总字节
                var total = e.total;
                // 计算百分比
                $('#shareImg_currProgress').width(Math.ceil(loaded / total * 100) + '%');
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
                        $('#shareImg_currProgress').width('1%');
                    }, 200);
                    // 插入图片库
                    // _this.insertIntoImgLib(this.width, this.height, data.path);
                    // callback.call(this, this.width, this.height, data.path);
                    // _this.setImage(this.width, this.height, data.path);
                    // 右侧表单项缩略图展示
                    $('#create_item_shareImg_thumbPic').css('background-image', 'url(' + data.path + ')');
                    // 模型中创建分享图
                    appstore.shareImg = data.path;
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
        };
        // 请求服务器接口文件
        xhr.open('POST', '/h5/uploadShareImg');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(formData);

        // 显示进度条
        $('.upimg_progress').show();
        // 显示loading状态
        $('.loading').show();
    },
};

module.exports = shareImageHandler;