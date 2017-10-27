var store = require('../model/store');

function history () {
    this.version = '1.0.0';
}

history.prototype = {
    canUndo: function(){
        return store.history.undo.length > 0;
    },
    canRedo: function(){
        return store.history.redo.length > 0;
    },
    // 撤销操作
    undo: function(){
        // 获取撤销栈
        var undoStack = store.history.undo;
        // 撤销栈可用
        if (this.canUndo()) {
            // undo栈最后一个动作出栈
            var command = undoStack.pop();
            // 执行undo动作
            command.undo();
            //  放入redo栈
            store.history.redo.push(command);
            // 更新撤销重做按钮状态
            // this.refreshUndoRedoBtn();
        } 
    },
    // 重做操作
    redo: function(){
        // 获取重做栈
        var redoStack = store.history.redo;
        // 重做栈可用
        if (this.canRedo()) {
            // redo栈最后一个动作出栈
            var command = redoStack.pop();
            // 执行execute动作
            command.execute();
            // 放入undo栈内
            store.history.undo.push(command);
            // 更新撤销重做按钮状态
            // this.refreshUndoRedoBtn();
        }
    },
    // 执行命令（新动作）
    execute: function(command){
        // undo栈写入新动作
        store.history.undo.push(command);
        // redo栈清空
        store.history.redo.length = 0;
        // // undo按钮可用
        // $('.menu-btn-revoke').addClass('enabled').removeClass('disabled');
        // // redo按钮不可用
        // $('.menu-btn-recover').addClass('disabled').removeClass('enabled');
    },
    // 更新撤销重做按钮状态
    refreshUndoRedoBtn: function(){
        // undo按钮 redo按钮状态改变
        // store.history.redo.length > 0
        //     ? $('.menu-btn-recover').addClass('enabled').removeClass('disabled')
        //     : $('.menu-btn-recover').addClass('disabled').removeClass('enabled');
        // store.history.undo.length > 0
        //     ? $('.menu-btn-revoke').addClass('enabled').removeClass('disabled')
        //     : $('.menu-btn-revoke').addClass('disabled').removeClass('enabled');
    }
};

module.exports = history;