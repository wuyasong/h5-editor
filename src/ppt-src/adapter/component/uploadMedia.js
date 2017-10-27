var Cache = require('../component/cache');

function checkSize(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('请上传5MB以内的歌曲');
        return false;
    } else {
        return true;
    }
}

function checkType(file) {
    if (!/audio/gi.test(file.type)) {
        alert('请上传音频格式文件');
        return false;
    } else {
        return true;
    }
}

// 上传歌曲至服务器操作
module.exports = function (input, callback) {
    var formData = new FormData(),
        file = input.files[0],
        music = {};

    // 检测歌曲类型
    if (!checkType(file)) return;
    // 检测歌曲大小
    if (!checkSize(file)) return;
    // 添加表单项
    formData.append('ppt_upd_audio', file);
    // 显示loading层
    $('.loading-window').show();
    // 上传至服务器操作
    $.ajax({
        url: '/h5/api/uploadAudio',
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(res){
            music.src = res.path;
            music.name = res.path.substring(res.path.lastIndexOf('\/') + 1);
            // 移除loading层
            $('.loading-window').hide();
            // 存储至本地缓存
            Cache.add('edit_ppt_audio', music);
            // 执行回调
            callback && callback(music);
        },
        error: function(){
            alert('上传歌曲失败');
            // 移除loading层
            $('.loading-window').hide();
        }
    });
}