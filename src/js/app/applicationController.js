var $ = require('jquery');
// 全局数据堆
var appstore = require('appStore');

function appstart() {

    // headerController
    var headerController = require('../controller/headerController.js');

    // pageController
    var pageController = require('../controller/pageController.js');

    // toolbar
    var toolbarController = require('../controller/toolbarController.js');

    // preview
    var previewController = require('../controller/previewController.js');

    // 更新appstore模型
    if (exp.store) {
        appstore.expandTitle = exp.store.expandTitle;  // 标题
        appstore.expandPage = exp.store.expandPage;  // 页数
        appstore.currentPage = exp.store.currentPage;   // 当前编辑页码
        appstore.music = exp.store.music;   // 背景音乐
        appstore.shareImg = exp.store.shareImg;  // 分享图
        appstore.state = exp.store.state;  // 当前编辑状态
        appstore.UIArr = exp.store.UIArr; // UIItem所有元素集合
        appstore.pages = exp.store.pages; // 页对象
        appstore.audioList = exp.store.audioList ? (exp.store.audioList.length ? exp.store.audioList : []) : [];  // 音频列表
    }

    headerController();
    pageController();
    toolbarController();
    // previewController();

    window.onbeforeunload = function() {
        // return ('是否离开本页？ 请确认已保存');
    }

}

module.exports = {
    start: appstart
};