// 连接mysql
var connConfig = require('../../config/connection.js');
var mysql = require('mysql');
// 创建连接池对象
// var connection = mysql.createConnection(connConfig);
var pool = mysql.createPool(connConfig);

var DB = {
    query: function(res, s, succCb){
        this.connect(res, function(connection){
            // 有data参数
            if (s.data) {
                connection.query(s.sql, s.data, function(err, result) {
                    if (err) {
                        res.end(JSON.stringify({ retcode: -11, errMsg: err }));
                        return connection.rollback(function() { throw err; });
                    }
                    if (!/select/gi.test(s.sql)) {
                        connection.commit(function(err) {  
                            if (err) {   
                                res.end(JSON.stringify({ retcode: -12, errMsg: 'COMMIT ERROR' }));
                                return connection.rollback(function() { throw err; });
                            }  
                            succCb ? succCb(result) : void 0;
                        }); 
                    }
                    connection.release();
                });
            } 
            // 没有data参数
            else {
                connection.query(s.sql, function(err, result) {
                    if (err) {
                        res.end(JSON.stringify({ retcode: -13, errMsg: err }));
                        return connection.rollback(function() { throw err; });
                    }
                    if (!/select/gi.test(s.sql)) {
                        connection.commit(function(err) {  
                            if (err) {   
                                res.end(JSON.stringify({ retcode: -14, errMsg: 'COMMIT ERROR' }));
                                return connection.rollback(function() { throw err; });
                            }  
                            succCb ? succCb(result) : void 0;
                        }); 
                    } else {
                        succCb(result);
                    }
                    connection.release();
                });
            }
        });
    },
    connect: function(res, callback){
        // 建立与数据库连接
        pool.getConnection(function(err, conn) {
            if (err) {
                res.end(JSON.stringify({retcode: -15, errMsg: 'CONNECT ERROR'}));
            } else {
                callback(conn);
            }
        });
    }
};

module.exports = DB;