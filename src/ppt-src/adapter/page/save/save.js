var dialog = require('../../../lib/dialog.class.js');

var Save = (function(saveTxt, callback, isShowWin){
    var dataset = {
        appId: model.appId,
        title: model.title,  // 应用程序title
        description: model.description,  // 分享描述
        shareImg: model.shareImg,  // 分享图
        pageNumber: model.pageNumber,  // 页数
        bgMusic: model.bgMusic, // 背景音乐
        currentIndex: model.currentIndex,  // 当前创建元素索引数
        currentId: model.currentId,  // 当前选中元素id
        currentPage: model.currentPage, // 当前所在页码
        currentTools: model.currentTools,   // 当前选中类型
        history: {
            index: model.history.index
        },
        pages: model.pages,  // 页面元素
        setOptions: model.setOptions  // 页面设置选项
    };
    if (!model.title) {
        alert('请输入标题');
        return;
    }
    console.time('save');
    // 发送数据模型到服务器
    $.ajax({
        type: 'POST',
        url: '/h5/api/saveData?ran=' + Math.random(),
        data: {
            data: JSON.stringify(dataset)
        },
        dataType: 'json',
        success: function (data) {
            console.timeEnd('save');
            if (data.retcode === 1) {
                dialog.show(saveTxt + '成功');
            } else {
                dialog.show(saveTxt + '失败' + '（' + data.retcode + '）');
            }
            callback && callback();
        },
        error: function () {
            alert('保存失败，网络错误');
        }
    });
});

module.exports = Save;