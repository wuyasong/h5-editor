/**
 * Web前端代码异常监控
 * @author owys
 * 基于jQuery
 * 
 * 引入本js
 * 头部写入<link rel="console" href="上报接口url">即可
 */

(function(window, $){
    // 上报接口url
    var console_url = $('head link[rel="console"]').attr('href');

    // 使用onerror事件捕获页面中的错误
    window.onerror = function (_message, _url, _line, _column, _error) {
        // 异步捕获
        setTimeout(function() {
            var _data = {
                message: _message,  // 堆栈异常信息
                url: _url,    // 抛出错误文件url
                line: _line,  // 错误行数
                column: _column || (window.event && window.event.errorCharacter) || 0,  // 错误列号
                ua: navigator.userAgent
            };

            // 如果有错误详情 赋值到stack属性中
            if (_error && _error.stack) {
                // 打印错误堆栈
                _data.stack = (_error.stack || _error.stacktrace).toString();
            }

            // 上报异常信息
            if (console_url) {
                if (_data.stack) {
                    $.post(console_url, _data);
                } else {
                    $.get(console_url, _data);
                }
            }
        }, 0);

        return true;
    }
})(window, $);