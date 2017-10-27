var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({ imageMagick : true });
var DB = require('../../db/database.js');

/* POST upload image. */
router.post('/', function(req, res, next) {
	// 创建表单上传
	var form = new formidable.IncomingForm();
	// 设置编码
	form.encoding = 'utf-8' ;
	// 设置文件存储路径
	form.uploadDir = './source/img';
	// 保留后缀
	form.keepExtensions = true;
	// 设置文件大小限制
	// form.maxFieldsSize = 2 * 1024 * 1024;

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'content-type': 'text/plain'});

		if (!err) {
            // 解析图片尺寸
            gm(files['container_bg'].path).size(function(err, size){
                var path = files['container_bg'].path.replace('source', '').replace(/\\/g, '/');
                // 存储到数据库
                DB.query(res, {sql: 'INSERT INTO edit_m_image SET ?', data: {sessionId: req.session.sessionId, src: path, width: size.width, height: size.height, uid: null}});
                // 返回图片信息
                res.end(JSON.stringify({
                    retcode: 1, 
                    path: path,
                    width: size.width,
                    height: size.height
                }));
            });
		}
		else {
			res.end(JSON.stringify({retcode: -1, errMsg: err}));
		}
		
	});

});

module.exports = router;
