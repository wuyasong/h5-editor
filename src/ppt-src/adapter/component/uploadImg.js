var Cache = require('../component/cache');

function checkSize(file) {
    if (file.size > 2 * 1024 * 1024) {
        alert('请上传小于2MB的图片');
        return false;
    } else {
        return true;
    }
}

function checkType(file) {
    if (!/jpeg|jpg|png|bmp|gif/gi.test(file.type)) {
        alert('请上传jpg,png,bmp,gif类型图片');
        return false;
    } else {
        return true;
    }
}

// 上传图片至服务器操作
module.exports = function (input, callback) {
    var formData = new FormData(),
        file = input.files[0],
        img = {};

    // 检测图片类型
    if (!checkType(file)) return;
    // 检测图片大小
    if (!checkSize(file)) return;
    // 添加表单项
    formData.append('ppt_upd_img', file);
    // 显示loading层
    $('.loading-window').show();
    // 上传至服务器操作
    $.ajax({
        url: '/h5/api/uploadImg',
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(res){
            img.src = res.path;
            img.width = res.width;
            img.height = res.height;
            // 移除loading层
            $('.loading-window').hide();
            // 存储至本地缓存
            Cache.add('edit_ppt_img', img);
            // 执行回调
            callback(img);
        },
        error: function(){
            alert('上传图片失败');
            // 移除loading层
            $('.loading-window').hide();
        }
    });
}