var express = require('express');
var router = express.Router();
var fs = require('fs');
var DB = require('../common/database.js');
var domain = require('../../config/domain');
var https = require('https');
var jsSHA = require('jssha');
var querystring = require('querystring');
var appInfo = {
    appId: 'xxxxxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxxx'
};
// 2小时后过期，需要重新获取数据后计算签名
var expireTime = 7200 - 100;
var cachedSignatures = {};

/* GET template page. */
router.get('/:sessionId', function(req, res, next) {
    var once = 0;
    var signData;
    var _url = 'http://ppt.51vv.com/m/page' + req.url;
    console.info(req.url);
    // 微信分享SDK
    // 输出数字签名对象
	var responseWithJson = function (res, data) {
        signData = data;
        pageHander();
	};
	// 随机字符串产生函数
	var createNonceStr = function() {
		return Math.random().toString(36).substr(2, 15);
	};

	// 时间戳产生函数
	var createTimeStamp = function () {
		return parseInt(new Date().getTime() / 1000) + '';
	};
	var errorRender = function (res, info, data) {
		if(data){
			console.log(data);
			console.log('---------');
		}
		responseWithJson(res, {errmsg: 'error', message: info, data: data});
	};
	// 计算签名
	var calcSignature = function (ticket, noncestr, ts, url) {
		var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
		shaObj = new jsSHA(str, 'TEXT');
		return shaObj.getHash('SHA-1', 'HEX');
	}
	// 获取微信签名所需的ticket
	var getTicket = function (url, res, accessData) {
		https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ accessData.access_token +'&type=jsapi', function(_res){
			var str = '', resp;
			_res.on('data', function(data){
				str += data;
			});
			_res.on('end', function(){
				try {
					resp = JSON.parse(str);
				} catch(e) {
			        return errorRender(res, '解析远程JSON数据错误', str);
				}
				
				var appid = appInfo.appId;
				var ts = createTimeStamp();
				var nonceStr = createNonceStr();
				var ticket = resp.ticket;
				var signature = calcSignature(ticket, nonceStr, ts, url);

				cachedSignatures[url] = {
					nonceStr: nonceStr,
					appid: appid,
					timestamp: ts,
					signature: signature,
					url: url
				};
				
				responseWithJson(res, {
					nonceStr: nonceStr,
					timestamp: ts,
					appid: appid,
					signature: signature,
					url: url
				});
			});
		});
	};
    var signatureObj = cachedSignatures[_url];
    if(!_url){
        errorRender(res, '缺少url参数');
    }
    // 如果缓存中已存在签名，则直接返回签名
    if(signatureObj && signatureObj.timestamp){
        var t = createTimeStamp() - signatureObj.timestamp;
        // 未过期，并且访问的是同一个地址
        // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
        if(t < expireTime && signatureObj.url == _url){
            console.log('======== result from cache ========');
            responseWithJson(res, {
                nonceStr: signatureObj.nonceStr,
                timestamp: signatureObj.timestamp,
                appid: signatureObj.appid,
                signature: signatureObj.signature,
                url: signatureObj.url
            });
        }
        // 此处可能需要清理缓存当中已过期的数据
    }

    
    // 获取微信签名所需的access_token
    https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appInfo.appId +'&secret=' + appInfo.secret, function(_res) {
        var str = '';
        _res.on('data', function(data){
            str += data;
        });
        _res.on('end', function(){
            try{
                var resp = JSON.parse(str);
            }catch(e){
                return errorRender(res, '解析access_token返回的JSON数据错误', str);
            }

            getTicket(_url, res, resp);
        });
    }).on("error", function (err) {  
        console.info(err);
    }); 




    function pageHander() {
        // 读取jsonPath
        DB.query(res, {sql: 'SELECT storePath, likesCount, readCount from edit_m_data WHERE sessionId="' + req.params.sessionId + '"'}, function(result){
            if (!result[0]) 
                res.render('404/404');
            else
                readJsonFile(result[0].storePath, result[0].likesCount, result[0].readCount);

            // 更新浏览量
            if (once === 0) updatePageViews(result[0].readCount);
        });
    }

    function updatePageViews(readCount) {
        var newReadCount = parseInt(readCount) + 1;
        DB.query(res, {
            sql: 'UPDATE edit_m_data SET ? WHERE sessionId="' + req.params.sessionId + '"', 
            data: {
                readCount: newReadCount
            } 
        });
        once = 1;
    }


    function readJsonFile(filePath, likesCount, readCount){
        fs.readFile('./source' + filePath, function(err, data){
            if (err) {
                res.end('error');
                throw err;
            }
            // 获取html文本数据
            var results = data.toString();
            var json = JSON.parse(results);
            var store = {
                sessionId: json.sessionid, 
                body: json.preview, 
                fullScreen: json.fullScreen,
                title: json.title, 
                desc: json.description,
                imgUrl: json.shareImg,
                elements: json.elements,
                sign: signData,
                setOptions: json.setOptions,
                likesCount: parseInt(likesCount),
                readCount: parseInt(readCount)
            };
            // 转换单位px —> rem
            formatStyle(store);
            res.render('m-editor/m-template', store);
        });
        
    }
    
    function formatStyle(store){
        var body = store.body;
        var elements = store.elements;
        for (var key in body) {
            var element = body[key];
            if (key === 'width' || key === 'height') {
                if (key === 'width' && element == 320) {
                    body[key] = '100%';
                } else if (key === 'height' && store.fullScreen) {
                    body['overflow'] = 'hidden';
                    body[key] = '100%';
                } else {
                    body[key] = element * 2 / 100 + 'rem';
                }
            }
        }

        key = null;

        for (var key in elements) {
            var styles = elements[key].style;
            if (elements[key].type === 'image') {
                elements[key].src = 'http://' + domain + elements[key].src;
            }
            if (elements[key].type === 'audio') {
                if (elements[key].image.play) {
                    elements[key].image.play = 'http://' + domain + elements[key].image.play;
                }
                if (elements[key].image.pause) {
                    elements[key].image.pause = 'http://' + domain + elements[key].image.pause;
                }
            }
            if (elements[key].type === 'video') {
                if (elements[key].poster) {
                    elements[key].poster = 'http://' + domain + elements[key].poster;
                }
            }
            if (elements[key].type === 'text') {
                var fontsizeList = elements[key].text.match(/font-size[^\d]+(\d+)px/g);
                if (fontsizeList) {
                    for (var i = 0; i < fontsizeList.length; i++) {
                        var pixel = fontsizeList[i].match(/\d+px/);
                        elements[key].text = elements[key].text.replace(pixel[0], parseInt(pixel[0]) * 2 / 100 + 'rem;line-height: 120%;')
                    }
                }
            }
            for (var p in styles) {
                var style = styles[p];
                if (p === 'width' || p === 'height' || p === 'left' || p === 'top' || p === 'right' || p === 'bottom' || p === 'borderRadius') {
                    if (style) {
                        if (p === 'width' && style == 320) {
                            styles[p] = '100%';
                        } else {
                            styles[p] = style * 2 / 100 + 'rem';
                        }
                    }
                } else if (p === 'backgroundImage') {
                    styles[p] = 'url(http://' + domain + style + ')';
                } else if (p === 'borderWidth') {
                    styles[p] = style + 'px';
                }
            }
        }
    }
});

module.exports = router;