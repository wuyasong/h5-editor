var store = require('../../store/dataSet');
var dialog = require('../../utils/dialog.class.js');

var saveHandle = {
    start: function(saveType){
        console.time('a');
        var dataSet = {};
        var contentEditors = {};
        // 深拷贝store数据，以防指向修改
        $.extend(true, dataSet, store);
                console.info(dataSet.elements);
        // 清空历史记录栈
        dataSet.history.undo.length = 0;
        dataSet.history.redo.length = 0;
        // 删除百度文本编辑器实例集合 以避免执行JSON.stringify时导致循环引用报错
        delete dataSet.contentEditors;
        // 发送数据store
        $.ajax({
            type: 'POST',
            url: '/m/saveData?ran=' + Math.random(),
            data: {
                data: JSON.stringify(dataSet)
            },
            dataType: 'json',
            success: function(data){
                console.timeEnd('a');
                console.info(data);
                if (data.retcode === 1) {
                    saveType === 1 ? 
                    dialog.show('保存成功') : 
                    dialog.show('发布成功');
                } else {
                    saveType === 1 ? 
                    dialog.show('保存失败' + '（' + data.retcode + '）') : 
                    dialog.show('发布失败' + '（' + data.retcode + '）');
                }
            },
            error: function(){
                alert('保存失败，网络错误');
            }
        });
    }
};

module.exports = saveHandle;