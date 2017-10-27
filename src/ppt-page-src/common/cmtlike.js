var likeView = require('../views/like.tpl');
var cmtView = require('../views/cmt.tpl');

var cmtLikeHandler = {
    init: function () {
        // 渲染外框
        $('#contain').append('<div class="box"></div>');
        // 渲染评论icon
        this.renderCmtIcon();
        // 渲染点赞icon
        this.renderLikeIcon();
    },
    // 渲染评论icon
    renderCmtIcon: function () {
        if (pageData.setOptions.isOpenCmt) {
            $('.box').append(cmtView());
            // 执行评论事件
            this.cmtEvent();
        }
    },
    // 渲染点赞icon
    renderLikeIcon: function () {
        if (pageData.setOptions.isOpenLikes) {
            $('.box').append(likeView({likesCount: pageData.likesCount}));
            // 执行点赞事件
            this.likeEvent();
        }
    },
    cmtEvent: function () {
        // 评论操作
        var hmProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");
        var commentBaseURL = hmProtocol + 'cm.51vv.com/comment/';
        var curPageUrlvvCommentM = resetUrl(window.location.href);
        var parm = 'URL=' + curPageUrlvvCommentM +'&beginIndex=0&rows=30'; 
        function resetUrl(fullUrl){
            var newUrl = '';
            fullUrl = fullUrl.replace(/&qq-pf-to=pcqq.c2c/, '');
            fullUrl = fullUrl.replace(/#rd/, '');
            newUrl = fullUrl.split('?')[0];
            return newUrl;
        }
        $.get(commentBaseURL + 'comment/getcomment.htm', parm, function(data) {
            var l=data.total;
            $('#commentMBtn').text(l).unbind('click').bind('click', function() {
                window.location.href = hmProtocol + 'www.51vv.com/vvmusic/comment/vvComment.html?curPageUrlvvCommentM='+curPageUrlvvCommentM+'';
            });
        }, 'jsonp');
    },
    likeEvent: function () {
        // 点赞操作
        $('#likebox').bind('click', function() {
            var newLikeNum = parseInt(pageData.likesCount) + 1;
            $('.likeNum').html(newLikeNum);
            $('.likeBtn').addClass('animate');
            setTimeout(function() {
                $('.likeBtn').removeClass('animate');
            }, 400);

            $.ajax({type: 'GET', url: '/h5/api/toPraise?appId=' + pageData.appId + '&likesCount=' + newLikeNum + '&ran=' + Math.random()});
            $(this).unbind('click');
        });
    }
};

module.exports = cmtLikeHandler;