var model = {
    appId: null,  // 应用程序唯一标识
    title: '',  // 应用程序title
    description: '',  // 分享描述
    shareImg: '',  // 分享图
    pageNumber: 1,  // 页数
    bgMusic: null, // 背景音乐
    currentIndex: 0,  // 当前创建元素索引数
    currentId: null,  // 当前选中元素id
    currentPage: 1, // 当前所在页码
    currentTools: 'page',   // 当前选中类型
    eventComponent: null, // 事件实例(表单-事件操作)
    tools:{},   // 存储工具栏各实例
    // isTextEdit: false, // 是否处于文本编辑状态
    history: {
        undo: [],  // 撤销栈
        redo: [],   // 恢复栈
        index: 1000
    },  // 历史记录
    clipboard: {
        element: null,  // 元素剪切板
        animation: null  // 动画剪切板
    },
    preview: {
        width: 320,
        height: 504
    }, // 预览视图
    pages: [],  // 页面元素
    elemKey: {}, // 页面元素索引表
    setOptions: {  // 页面设置选项
        isOpenLikes: false,  // 是否开启点赞
        isOpenCmt: false,  // 是否开启评论
        isOpenLook: false,  // 是否开启浏览次数
        isShowLayer: true  // 是否显示图层窗口
    }
};

module.exports = model;
window.model = model;