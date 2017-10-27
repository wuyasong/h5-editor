var preview = {
    // 加载预览页面
    openPage: function () {
        $('.window-preview-show-box').html('<iframe src="/h5/page/' + model.appId + '" class="window-preview-iframe"></iframe>');
    },
    // 执行滑屏动画
    go: function (index) {
        // 滑屏动画
        $(".window-preview-iframe").contents().find("#wrapper").css({
            '-webkit-transition': 'all .4s ease-out',
            '-moz-transition': 'all .4s ease-out',
            '-ms-transition': 'all .4s ease-out',
            'transition': 'all .4s ease-out',
            '-webkit-transform': 'translate(0,' + (-model.preview.height * index) + 'px)',
            '-moz-transform': 'translate(0,' + (-model.preview.height * index) + 'px)',
            '-ms-transform': 'translate(0,' + (-model.preview.height * index) + 'px)',
            'transform': 'translate(0,' + (-model.preview.height * index) + 'px)'
        });
        // 当前屏显示，其余屏隐藏
        setTimeout(function() {
            $(".window-preview-iframe").contents().find(".screen_box").hide();
            $(".window-preview-iframe").contents().find(".screen_box").eq(index).show();
        }, 300);
    },
    // 显示二维码
    getQrcode: function () {
        $('.window-preview-qrcode').attr('src', '/h5/api/qrcode?appId=' + model.appId);
    },
    getLink: function () {
        var href = location.protocol + '//' + location.hostname + ':' + location.port + '/h5/page/' + model.appId;
        $('.window-preview-link-input').val(href);
        $('.window-preview-href').attr('title', href).attr('href', href);
    }
};

module.exports = function () {
    // 滑动页数索引
    var index = 0;
    // 加载预览页面
    preview.openPage();
    // 显示二维码
    preview.getQrcode();
    // 显示链接
    preview.getLink();
    // 绑定事件指令
    handy.create({
        el: ['.window-preview-prev-btn', '.window-preview-next-btn'],
        methods: {
            // 点击上滑
            swipe_prev: function () {
                if (index <= 0) return;
                index--;
                // 上滑一屏
                preview.go(index);
            },
            // 点击下滑
            swipe_next: function () {
                if (index >= model.pageNumber - 1) return;
                index++;
                // 下滑一屏
                preview.go(index);
            }
        }
    });
};