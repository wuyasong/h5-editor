var model = require('../../model/store');
var defaultData = require('../../model/defaultData');
var component = require('../component/common');
var mainEdit = require('../mainEdit/main-editor');
var thumbItemView = require('../../views/thumb/thumblist.tpl');
var layerlist = require('../component/layer');
var pageForm = require('../panel/page-form');
var contextmenuView = require('../../views/win/contextmenu.tpl');
var save = require('../page/save/save');

var view = {
    text: require('../../views/thumb/textView.tpl'),
    view: require('../../views/thumb/divView.tpl'),
    button: require('../../views/thumb/buttonView.tpl'),
    image: require('../../views/thumb/imageView.tpl'),
    audio: require('../../views/thumb/audioView.tpl'),
    video: require('../../views/thumb/videoView.tpl')
};

var thumblist = {
    init: function () {
        var _this = this;
        // 绑定指令
        handy.create({
            el: [
                '.main-thumb-preview-add',
                '.main-thumb-preview-topbar-del',
                '.main-thumb-item',
                '.contextmenu-item-copyPage',
                '.contextmenu-item-delPage',
                '.contextmenu-item-favPage'
            ],
            methods: {
                create: this.createPageHandle,
                // createBlankPage: this.createBlankPage,
                // createFavPage: this.createFavPage,
                delete: function (e, $el) { e.stopPropagation(); _this.deletePage($el.parents('li').index()); },
                select: this.selectPage,
                // 右键菜单
                onContextmenu: function (e, $el) {
                    e.preventDefault();
                    $('.contextmenu-list').show().css({ left: e.clientX, top: e.clientY }).html(contextmenuView({ type: model.currentTools }));
                    handy.create({
                        el: [
                            '.contextmenu-item-copyPage',
                            '.contextmenu-item-delPage',
                            '.contextmenu-item-favPage'
                        ],
                        methods: {
                            copyPage: _this.copyPage.bind(_this, $el.index()), // 复制本页
                            delPage: function () { _this.deletePage($el.index()); }, // 删除本页
                            favPage: _this.favPage.bind(_this, $el.index()) // 收藏本页
                        }
                    });
                }
            }
        });
    },
    getFavouriteData: function (key, callback) {
        $.ajax({
            type: 'GET',
            url: '/h5/api/getFavourite?key=' + key + '&r=' + Math.random(),
            dataType: 'json',
            success: function (data) {
                if (data.retcode === 1) {
                    callback && callback(data.data);
                }
            },
            error: function () {},
        });
    },
    /**
     * @method createPageHandle 添加页面操作
     * 显示收藏模板弹窗
     * 收藏模板列表绑定点击事件
     */
    createPageHandle: function (e, $el) {
        e.stopPropagation();
        // 显示收藏模板弹窗
        $('.fav-window').fadeIn(200);
        $('.main-thumb-mask').show();

        // 点击空白模板创建新页面
        $('.fav-list li.fav-item-blank').off('click').on('click', function(){
            closeFavWin();
            thumblist.createPage(e, $el);
        });
        // 点击收藏模板创建新页面
        $('.fav-list li.fav-item-temp').off('click').on('click', function(){
            closeFavWin();
            // 获取收藏数据
            thumblist.getFavouriteData($(this).attr('data-key'), function (pageData) {
                thumblist.createPage(e, $el, pageData);
            });
        });

        // 移除收藏模板弹窗
        function closeFavWin(){
            $('.fav-window').fadeOut(200);
            $('.main-thumb-mask').hide();
        }
    },
    /**
     * 添加一页数据
     * 获取当前点击的索引数
     * 更新model.pages模型
     * 更新页数模型
     * 更新选中页模型
     * 重置一些状态
     * 缩略图视图添加页面
     * 主编辑区视图添加页面
     * 重置指令
     * 更新图层列表视图
     */
    createPage: function (e, $el, pageData) {
        e.stopPropagation();
        var index = $el.parents('li').index();
        var pageObj;
        // 选择空白模板
        if (!pageData) {
            pageObj = {
                background: {},
                component: {}
            };
            // 继承默认背景对象
            $.extend(true, pageObj.background, defaultData.background);
        }
        // 选择收藏模板
        else {
            pageObj = pageData;
        }
        // 添加模型
        model.pages.splice((index + 1), 0, pageObj);
        // 更新选中页模型
        model.pageNumber++;
        // 更新选中页模型
        model.currentPage = (index + 1) + 1;
        // 更新当前选中元素和选中类型
        component.resetModel();
        // 添加缩略视图
        $('.main-thumb-list').html(thumbItemView(model));

        if (pageData) {
            // 粘贴元素
            $.each(pageObj.component, function (key, element) {
                // 更新模型-history.index
                var elemId = 'wz_' + element.type + '_' + (++model.history.index);
                // 将本元素复制到新的id上
                pageObj.component[elemId] = element;
                // 删除原来的元素模型
                delete pageObj.component[key];
                // 更新模型-元素id
                pageObj.component[elemId].id = elemId;
                // 更新模型-currentIndex
                var currentIndex = ++model.currentIndex;
                currentIndex = String(currentIndex).length < 2 ? '0' + currentIndex : currentIndex;
                // 更新模型-元素命名
                pageObj.component[elemId].name = defaultData[element.type].name + '_' + currentIndex;
            });
        }
        // 添加主编辑区视图
        mainEdit.createPage(index);
        // 重置指令
        thumblist.init();
        // 更新图层列表视图
        layerlist.render();
        // 更新表单-页面属性
        component.panel.updatePageView();
        if (pageData) {
            // 创建元素视图
            this.createMainEditElementView(index);
        }
    },
    /**
     * 删除一页数据
     * 更新model.pages模型
     * 更新页数模型
     * 更新选中页模型
     * 重置一些状态
     * 缩略图视图删除页面
     * 主编辑区视图删除页面
     * 重置指令
     * 更新图层列表视图
     */
    deletePage: function (index) {
        if (model.pages.length < 2) {
            alert('仅有1页，不能删除！');
            return;
        }
        var warn = confirm('确定删除该页？');
        if (warn) {
            // 删除模型
            model.pages.splice(index, 1);
            // 更新选中页模型
            model.pageNumber--;
            // 更新选中页模型
            model.currentPage = index > 0 ? index : 1;
            // 更新当前选中元素和选中类型
            component.resetModel();
            // 更新缩略视图
            $('.main-thumb-list').html(thumbItemView(model));
            // 删除主编辑区视图
            mainEdit.deletePage(index);
            // 重置指令
            thumblist.init();
            // 更新图层列表视图
            layerlist.render();
            // 更新表单-页面属性
            component.panel.updatePageView();
        }
    },
    /**
     * 选择页面
     * 缩略图列表项添加选中状态
     * 主编辑区切换为选中页
     * 更新选中页模型
     * 重置一些状态
     * 更新图层列表视图
        // 更新表单-页面属性
     */
    selectPage: function (e, $el) {
        var index = $el.index();
        $('.main-thumb-item').eq(index).addClass('current').siblings().removeClass('current');
        // 主编辑区切换
        mainEdit.selectPage(index);
        // 更新选中页模型
        model.currentPage = index + 1;
        // 更新当前选中元素和选中类型
        component.resetModel();
        // 更新图层列表视图
        layerlist.render();
        // 更新表单-页面属性
        component.panel.updatePageView();
    },
    /**
     * @method copyPage 复制本页
     * 复制本页模型
     * 更新model.pages模型
     * 更新页数模型
     * 更新选中页模型
     * 重置一些状态
     * 缩略图视图添加页面
     * 主编辑区视图添加页面
     * 重置指令
     * 更新图层列表视图
     * 创建元素视图
     */
    copyPage: function (pageIndex) {
        var _this = this;
        // 复制本页模型
        var copyPageModel = { background: {}, component: {} };
        // 先复制背景
        $.extend(true, copyPageModel.background, model.pages[pageIndex].background);
        // 粘贴模型
        model.pages.splice((pageIndex + 1), 0, copyPageModel);
        // 更新页数模型
        model.pageNumber++;
        // 更新选中页模型
        model.currentPage = (pageIndex + 1) + 1;
        // 更新当前选中元素和选中类型
        component.resetModel();
        // 添加缩略视图
        $('.main-thumb-list').html(thumbItemView(model));
        // 再复制元素
        $.extend(true, copyPageModel.component, model.pages[pageIndex].component);
        // 粘贴元素
        $.each(copyPageModel.component, function (key, element) {
            // 更新模型-history.index
            var elemId = 'wz_' + element.type + '_' + (++model.history.index);
            // 将本元素复制到新的id上
            copyPageModel.component[elemId] = element;
            // 删除原来的元素模型
            delete copyPageModel.component[key];
            // 更新模型-元素id
            copyPageModel.component[elemId].id = elemId;
            // 更新模型-currentIndex
            var currentIndex = ++model.currentIndex;
            currentIndex = String(currentIndex).length < 2 ? '0' + currentIndex : currentIndex;
            // 更新模型-元素命名
            copyPageModel.component[elemId].name = defaultData[element.type].name + '_' + currentIndex;
        });
        // 添加主编辑区视图
        mainEdit.createPage(pageIndex);
        // 重置指令
        thumblist.init();
        // 更新图层列表视图
        layerlist.render();
        // 更新表单-页面属性
        component.panel.updatePageView();
        // 创建元素视图
        this.createMainEditElementView(pageIndex);
    },
    /**
     * 创建主编辑区各元素视图
     */
    createMainEditElementView: function (pageIndex) {
        // 创建元素视图
        $.each(model.pages[pageIndex + 1].component, function (id, element) {
            // 更正由于创建元素后再新建页面引起的pageIndex错误问题
            element.pageIndex = pageIndex + 1;
            switch (element.type) {
                case 'text':
                    model.tools.textComponent.build(element);
                    break;
                case 'view':
                    model.tools.viewComponent.build(element);
                    break;
                case 'button':
                    model.tools.buttonComponent.build(element);
                    break;
                case 'image':
                    model.tools.imageComponent.build(element);
                    break;
                case 'audio':
                    model.tools.audioComponent.build(element);
                    break;
                case 'video':
                    model.tools.videoComponent.build(element);
                    break;
            }
        });
    },
    /**
     * 收藏本页
     * 先执行保存操作
     * POST请求携带页码、标题、appId、本页json数据 参数
     */
    favPage: function (pageIndex) {
        $('.tip-favourite').fadeIn().html('页面收藏中');
        save('保存', function () {
            console.time('fav');
            // POST 收藏接口
            $.ajax({
                type: 'POST',
                url: '/h5/api/favourite',
                data: ({
                    appId: model.appId,
                    title: model.title,
                    page: pageIndex,
                    data: JSON.stringify(model.pages[pageIndex])
                }),
                dataType: 'json',
                success: function (data) {
                    console.timeEnd('fav');
                    if (data.retcode === 1) {
                        $('.tip-favourite').html('收藏成功').delay(2000).fadeOut();
                    } else {
                        $('.tip-favourite').html('收藏失败(' + data.retcode + ')').delay(2000).fadeOut();
                        alert('收藏失败(' + data.retcode + ')');
                    }
                },
                error: function () { console.info('收藏失败error'); }
            });
        });
    },
    /**
     * 缩略图创建元素
     */
    createElement: function (id, type) {
        var currentPage = model.currentPage - 1;
        // 从索引表中拿出数据渲染
        $('.main-thumb-preview-content').eq(currentPage).append(view[type](model.elemKey[id].data));
    },
    // 修改缩略列表元素属性
    setProps: function (key, value, type) {
        var currentPage = model.currentPage - 1;
        var currentId = model.currentId;
        if (type === 'style') {
            $('.' + currentId + '_thumb').css(key, value);
        }
        else if (type === 'props') {
            $('.' + currentId + '_thumb')[key](value);
        }
    },
    setImage: function (img) {
        var currentId = model.currentId;
        $('.' + currentId + '_thumb img').attr('src', img.src);
        $('.' + currentId + '_thumb').css('width', img.width);
        $('.' + currentId + '_thumb').css('height', img.height);
    }
};

module.exports = thumblist;