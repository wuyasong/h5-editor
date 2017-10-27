// 引入应用启动文件
var Presenter = require('./adapter/main-adapter');
// 引入全局方法
require('./lib/handy');  // 指令绑定

// 应用程序启动
Presenter.init();