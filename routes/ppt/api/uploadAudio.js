var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var DB = require('../../common/database.js');

/* POST upload image. */
router.post('/', function(req, res, next) {
	// 创建表单上传
	var form = new formidable.IncomingForm();
	// 设置编码
	form.encoding = 'utf-8' ;
	// 设置文件存储路径
	form.uploadDir = './source/music/public';
	// 保留后缀
	form.keepExtensions = true;
	// 设置文件大小限制
	form.maxFieldsSize = 5 * 1024 * 1024;

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {'content-type': 'text/plain'});

		if (!err) {
            // 解析图片尺寸
            var path = files['ppt_upd_audio'].path.replace('source', '').replace(/\\/g, '/');
            // 返回图片信息
            res.end(JSON.stringify({
                retcode: 1, 
                path: path
            }));
		}
		else {
			res.end(JSON.stringify({retcode: -1, errMsg: err}));
		}
		
	});

});

module.exports = router;
