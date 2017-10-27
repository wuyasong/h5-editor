var template = require('../lib/template');
var pageView = require('../views/page.tpl');
var loading = require('./loading');
var animationHandler = require('./animation');
var eventHandler = require('./events');
var mediaHandler = require('./media');
var appHandler = require('./cmtlike');

var ua = navigator.userAgent,
    isWechat = (/micromessenger/gi).test(ua), 
    isWeibo = (/weibo/gi).test(ua),
    isQQ = (/qq/gi).test(ua) && (!(/qqbrowser/gi).test(ua)),
    isAndroid = (/android/gi).test(ua),
    isIOS = (/iphone|ipad|ipod/gi).test(ua),
    isvvlive = (/vvlive/gi).test(ua),
    isVVmusic = (/vvmusic/gi).test(ua);

module.exports = {
    // 页面渲染
    init: function () {
        var _this = this;
        loading.init(function () {
            $('#contain').html('<div class="wrapper" id="wrapper"></div>');
            // 分享api
            _this.getSign();
            $('#wrapper').html(pageView(pageData));
            // 渲染上滑箭头
            _this.renderArrow();
            // 动画操作
            animationHandler.init();
            // 事件操作
            eventHandler.init();
            // 音视频操作
            mediaHandler.init();
            // 渲染页码
            _this.pageNumber();
            // 评论点赞操作
            appHandler.init();
        });
    },
    // 初始加载动画
    loading: function () {
        $('#contain').html('<div class="loading"><div class="progress-wrap"><div class="progress"></div></div></div>');
    },
    // 渲染页码
    pageNumber: function () {
        $('#contain').append('<div class="page-num"><span id="curPage">1</span>/<span>' + pageData.pageNumber + '</span></div>');
    },
    // 渲染上滑箭头
    renderArrow: function () {
        if (pageData.pageNumber > 1) {
            $('#contain').append('<div class="arrow"></div>');
        }
    },
    // 分享微信、QQ操作
    getSign: function () {
        var _this = this;
        if ('wx' in window || isQQ) {
            $.ajax({
                type: 'POST',
                url: '/wechat_signs',
                dataType: 'json',
                data: {
                    url: location.href.split('#')[0]
                },
                success: function (data) {
                    _this.shareTo(data);
                }
            });
        }
    },
    // 分享微信、QQ操作
    shareTo: function (sign) {
        var shareInfo = {
            title: pageData.title,
            desc: pageData.description,
            link: location.href.split('#')[0],
            imgUrl: pageData.shareImg ? 'http://ppt.51vv.com' + pageData.shareImg : ''
        };
        if ('wx' in window) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: sign.appid, // 必填，公众号的唯一标识
                timestamp: sign.timestamp, // 必填，生成签名的时间戳
                nonceStr: sign.nonceStr, // 必填，生成签名的随机串
                signature: sign.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(){
                wx.showOptionMenu();
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage(shareInfo);
                // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline(shareInfo);
                wx.onMenuShareQQ(shareInfo);
                wx.onMenuShareWeibo(shareInfo);
                wx.onMenuShareQZone(shareInfo);
            });
        }

        if (isQQ) {
            setShareInfo({
                title: shareInfo.title, // 分享标题
                summary: shareInfo.desc, // 分享内容
                pic: shareInfo.imgUrl, // 分享图片
                url: shareInfo.link, // 分享链接
                // 微信权限验证配置信息，若不在微信传播，可忽略
                WXconfig: {
                    swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
                    appId: sign.appid, // 公众号的唯一标识
                    timestamp: sign.timestamp, // 生成签名的时间戳
                    nonceStr: sign.nonceStr, // 生成签名的随机串
                    signature: sign.signature // 签名
                }
            });
        }
    }
};