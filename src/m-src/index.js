// 依赖模块
var Adapter = require('./adapter/main-adapter');
require('./utils/prototype');

/**
 * 本文件为应用路由文件
 * 厚重的业务逻辑全部部署在adapter目录下
 * 模型在store目录下
 * 视图最薄部署在view目录下
 * 一些依赖工具类放在utils目录下
 */
var MEditor = {
    start: function(){
        // 初始化适配器类
        new Adapter();
    },
};

// 启动编辑器应用程序
MEditor.start();

