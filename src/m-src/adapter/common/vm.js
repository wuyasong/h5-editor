var store = require('../../store/dataSet'); 

var ViewModel = {
    unexecuteCmd: null,
    setPreViewModel: function(key, value, isStyle){
        var currElem = $('#' + store.currElemId);
        // key = key.replace(/([A-Z])/g,"-$1").toLowerCase();
        if (!isStyle) {
            // 通知模型更新
            store.elements[store.currElemId].style[key] = value;
        }
        // 更新元素位置
        if (key === 'width' || key === 'height' || key === 'left' || key === 'top' || key === 'right' || key === 'bottom') {
            // 例如 上为空 下为90，所以要将css的top去除
            value ? currElem.css(key, parseInt(value) + 'px') : currElem.css(key, '');
        } else if (key === 'borderRadius' || key === 'fontSize' || key === 'lineHeight') {
            currElem.children('.drag-ele').css(key, parseInt(value) + 'px');
        } else if (key === 'backgroundImage') {
            value ? currElem.children('.drag-ele').css(key, 'url(' + value + ')') : currElem.children('.drag-ele').css(key, '');
        } else {
            currElem.children('.drag-ele').css(key, value);
        }
    },
    setFormViewModel: function(selector, key, value, isStyle){
        var currElem = $('#' + store.currElemId);
        if (!isStyle) {
            // 通知模型更新
            store.elements[store.currElemId].style[key] = value;
        }
        // 更新元素表单项
        $(selector).val(value).blur();
    },
    updatePreviewStyle: function(){
        var currElem = $('#' + store.currElemId);
        var elements = store.elements[store.currElemId];
        var styles = elements.style;
        for (var key in styles) {
            var value = styles[key];
            // 更新元素位置
            if (key === 'width' || key === 'height' || key === 'left' || key === 'top' || key === 'right' || key === 'bottom') {
                // 例如 上为空 下为90，所以要将css的top去除
                value ? currElem.css(key, parseInt(value) + 'px') : currElem.css(key, '');
            } else if (key === 'borderRadius') {
                currElem.children('.drag-ele').css(key, parseInt(value) + 'px');
            } else if (key === 'backgroundImage') {
                value ? currElem.children('.drag-ele').css(key, 'url(' + value + ')') : currElem.children('.drag-ele').css(key, '');
            } else if (key === 'position') {
                continue;
            } else {
                currElem.children('.drag-ele').css(key, value);
            }
        }
        // 单独处理
        // 更新音频icon
        if (elements.image && elements.image.play) {
            currElem.children('.drag-ele').css('backgroundImage', 'url(' + elements.image.play + ')');
        }
        // 更新视频默认图
        if (elements.poster) {
            currElem.children('.drag-ele').css('backgroundImage', 'url(' + elements.poster + ')');
        }
    },
    // 键盘微调
    keyToMove: function(key, value){
        if (store.currElemId) {
            var currElem = $('#' + store.currElemId);
            if (value != undefined) {
                var val = parseInt(currElem.css(key)) + value;
                // 通知模型更新
                store.elements[store.currElemId].style[key] = val;
                // 更新元素位置
                currElem.css(key, val + 'px');
                // 更新表单视图
                $('.set-' + store.currEditTool + '-' + key).val(val);
            }
        }
    },
    // 元素移动
    move: function(dragbox, callback){
        var $dragEle = $('#' + dragbox.id);
        dragbox.offsetX != undefined ? $dragEle.css('left', dragbox.offsetX + 'px') : void 0;
        dragbox.offsetY != undefined ? $dragEle.css('top', dragbox.offsetY + 'px') : void 0;
        dragbox.width != undefined ? $dragEle.css('width', dragbox.width + 'px') : void 0;
        dragbox.height != undefined ? $dragEle.css('height', dragbox.height + 'px') : void 0;
        // 添加拖拽框
        $dragEle.addClass('active').siblings().removeClass('active');
        callback ? callback() : void 0;
        // 更新表单视图模型
        dragbox.width != undefined ? ViewModel.setFormViewModel('.set-' + store.currEditTool + '-width', 'width', dragbox.width) : void 0;
        dragbox.height != undefined ? ViewModel.setFormViewModel('.set-' + store.currEditTool + '-height', 'height', dragbox.height) : void 0;
        dragbox.offsetX != undefined ? ViewModel.setFormViewModel('.set-' + store.currEditTool + '-left', 'left', dragbox.offsetX) : void 0;
        dragbox.offsetY != undefined ? ViewModel.setFormViewModel('.set-' + store.currEditTool + '-top', 'top', dragbox.offsetY) : void 0;
    },
    // 更新元素id，编辑工具
    updateCurrTools: function(id, tools){
        // 更新当前选中元素id
        store.currElemId = id;
        // 更新当前选中编辑工具
        store.currEditTool = tools;
        // 添加拖拽框
        $('#' + id).addClass('active').siblings().removeClass('active');
        // 显示右侧表单栏
        $('.aside-options-' + tools).show().siblings().hide();
        ViewModel.updateFormCtrls[tools] ? ViewModel.updateFormCtrls[tools]() : void 0;
    },
    // 更新右侧表单项方法
    updateFormCtrls: {
        text: null,
        view: null,
        image: null,
        audio: null,
        video: null,
    },
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
            this.refreshUndoRedoBtn();
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
            this.refreshUndoRedoBtn();
        }
    },
    // 执行命令（新动作）
    execute: function(command){
        // undo栈写入新动作
        store.history.undo.push(command);
        // redo栈清空
        store.history.redo.length = 0;
        // undo按钮可用
        $('.menu-btn-revoke').addClass('enabled').removeClass('disabled');
        // redo按钮不可用
        $('.menu-btn-recover').addClass('disabled').removeClass('enabled');
    },
    // 更新撤销重做按钮状态
    refreshUndoRedoBtn: function(){
        // undo按钮 redo按钮状态改变
        store.history.redo.length > 0
            ? $('.menu-btn-recover').addClass('enabled').removeClass('disabled')
            : $('.menu-btn-recover').addClass('disabled').removeClass('enabled');
        store.history.undo.length > 0
            ? $('.menu-btn-revoke').addClass('enabled').removeClass('disabled')
            : $('.menu-btn-revoke').addClass('disabled').removeClass('enabled');
    }
};

module.exports = ViewModel;