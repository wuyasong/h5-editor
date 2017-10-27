// 数据模型
var DataSet = {
    sessionid: null,  // 应用程序唯一标识
    title: '',  // 应用程序title
    description: '',
    shareImg: '',
    preview: {  // 预览视图
        width: 320,
        height: null,
        backgroundColor: '#ffffff'
    },
    contentEditors: {}, // 文本编辑器集合
    draggables: {},  // 所有元素拖拽类集合
    currElemId: null,  // 当前选中元素id
    currEditTool: null,  // 当前选中编辑工具
    currContentEditor: null, // 当前选中文本编辑器
    contentEditorState: false, // 当前文本编辑器正在编辑状态
    fullScreen: false,  // 页面高度撑满屏幕
    history: {
        undo: [],  // 撤销
        redo: []   // 恢复
    },  // 历史记录
    elements: {},  // 创建的元素集合
    setOptions: {  // 页面设置选项
        isOpenLikes: false,  // 是否开启点赞
        isOpenCmt: false,  // 是否开启评论
        isShowLayer: true  // 是否显示图层窗口
    }
};

module.exports = DataSet;
window.store = DataSet;