var picList = [];

var Loading = {
    init: function (callback) {
        this.renderLoading(callback);
    },
    // 渲染loading视图
    renderLoading: function (callback) {
        $('#contain').html('<div class="loading"><div class="progress-wrap"><div class="progress"></div></div></div>');
        // 获取图片列表
        this.getPicList();
        // 加载进度
        this.progress(callback);
    },
    // 获取图片列表
    getPicList: function () {
        // 遍历页对象中有图片的
        for (var i = 0; i < pageData.pages.length; i++) {
            pageData.pages[i].background.backgroundImage && picList.push(pageData.pages[i].background.backgroundImage);  // 存入图片
            $.each(pageData.pages[i].component, function (id, element) {
                if (element.type === 'image') {
                    picList.push(element.src);  // 存入图片
                } else if (element.type === 'view') {
                    element.style.backgroundImage && picList.push(element.style.backgroundImage);  // 存入图片
                } else if (element.type === 'audio') {
                    element.image.play && picList.push(element.image.play);  // 存入图片
                    element.image.pause && picList.push(element.image.pause);  // 存入图片
                }
            });
        }
    },
    progress: function (callback) {
        var len = picList.length,
            index = 0,
            image = new Image();

        //有图片就加载，没有就直接到100%
        if (len > 0) {
            load();
        } else {
            progress('100%');
            // 执行页面业务
            setTimeout(function() {
                callback && callback();
            }, 350);
        }

        function progress(precent){
            document.querySelector('.progress').style.width = precent;
        }

        function load(){
            image.src = picList[index];
            image.onload = function(){
                progress( Math.floor((index + 1) / len * 100) + '%' );
                index++;
                //没加载完继续递归，执行完就去回调
                if (index < len) {
                    load();
                } else {
                    // 加载完成
                    // 执行页面业务
                    setTimeout(function() {
                        callback && callback();
                    }, 350);
                }
            }
            image.onerror = function(){
                progress( Math.floor((index + 1) / len * 100) + '%' );
                index++;
                //没加载完继续递归，执行完就去回调
                if (index < len) {
                    load();
                } else {
                    // 加载完成
                    // 执行页面业务
                    setTimeout(function() {
                        callback && callback();
                    }, 350);
                }
            }
        }
    }
};

module.exports = Loading;