var express = require('express');
var router = express.Router();
var fs = require('fs');
var archiver = require('archiver');
// var zlib = require("zlib");
// var mime = require('mime');
// var path = require('path');

router.get('/:sessionId', function(req, res, next) {
    var sessionId = req.params.sessionId;
    var title = req.query.title;
    var files = [
        {  // html
            path: './source/webpage/' + sessionId + '/index.html',
            name: 'index.html'
        },
        {  // css
            path: './source/webpage/' + sessionId + '/style.css',
            name: 'style.css'
        }
    ];
    exists = fs.existsSync(files[0].path);
    // 判断文件夹是否存在 没有则
    if (!exists) {
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end('该文件不存在');
        return;
    }

    // 输出打包文件路径
    var outputPath = './source/webpage/' + sessionId + '.zip';
    // 创建打包文件输出流
    var output = fs.createWriteStream(outputPath);
    // 创建archiver对象 打包类型为zip
    var archive = archiver('zip');
    archive.on('error', function(err){
        throw err;
    });
    output.on('close', function(a){
        //压缩完毕生成文件
        console.log(archive.pointer() + ' total bytes');
        res.download(outputPath, title + '.zip');
        // res.end('123');
    });
    // 数据导入输出文件流中
    archive.pipe(output);
    // 创建输入流文件 添加到archiver对象中
    archive.append(fs.createReadStream(files[0].path), {name: files[0].name});  // html
    archive.append(fs.createReadStream(files[1].path), {name: files[1].name});  // css
    // 完成压缩文件流
    archive.finalize();
});

module.exports = router;