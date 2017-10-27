/**
 * 网页截屏操作
 * windows下通过可执行文件phantom.exe运行命令phantomjs xxx.js
 * 获取标准输出流中参数
 * 步骤：
    * 创建网页对象
    * 设置窗口大小
    * 设置页面信息
    * 加载页面
    * 生成图片
 */
var system = require('system');
var publicImgKey = require('../lib/publicImgKey');
var url = system.args[1];
var appId = system.args[2];
var pageNumber = system.args[3];
var path = system.args[4];
var page = require('webpage').create();

//生成图片名称算法
function createRandomName(len){
    len = len || 8;
    // 图片编码密钥
    var parseCode = [2,0,1,3,0,4,0,7,8,2];
    var chars = pageNumber + '-' + appId;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(parseCode[i]);
    }
    return pwd;
}

if (system.length === 1) {
    console.info('命令参数有误');
    phantom.exit(1);
} else {
    // 设置窗口大小
    page.viewportSize = { width: 320, height: 504 };
    // 页面信息设置
    page.settings = {
        javascriptEnabled: true, // 允许加载javascript脚本
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
    };
    page.clipRect = {
        top:    pageNumber * 504,
        left:   0,
        width:  320,
        height: 504
    };
    // 加载页面
    page.open(url, function (status) {
        if (status === 'success') {
            // 生成图片
            var createImg = path + 'card_' + publicImgKey(10) + '.jpg';
            console.info(createImg); // 向主进程输出标准输出流
            page.render( createImg );
        }
        // page.close();
        phantom.exit();
    });

}