var AnimationHandler = {
    init: function () {
        // 实例化滑屏组件
        new mScroll({
            bindEle: document.querySelector("#contain"),
            touchUl: document.querySelector("#wrapper"),
            touchLi: document.querySelectorAll(".screen"),
            callback: function(i) {
                // 更新页码
                $('#curPage').text(i + 1);
            },
            endCallback: function(i) {
                var pageNumber = pageData.pageNumber;
                // 箭头显示隐藏
                i >= pageNumber - 1 ? $('.arrow').hide() : $('.arrow').show();
            }
        });
    }
};

module.exports = AnimationHandler;