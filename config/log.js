var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'console'
        }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups: 4,
            category: 'normal'
        },
    ],
    replaceConsole: true,
    // levels: {
    //     log_info: 'ALL',
    //     log_stat: 'ALL',
    //     log_trace: 'ALL',
    //     log_error: 'ALL',
    //     log_todo: 'ALL'
    // }
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

exports.logger = logger;

exports.use = function (app) {
    app.use(log4js.connectLogger(logger, { level: 'auto', format: ':method :url' }));
}