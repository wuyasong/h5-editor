appstore = {
    expandTitle: '',
    expandPage: 1,
    currentPage: 0,
    preview: {
        width: 320,
        height: 504
    },
    // 实际音乐id
    music: {
        src: null
    },
    shareImg: null,
    state: {
        currentId: null,
        currentPageId: null,
    },
    setOptions: {
        comment: true,
        like: false
    },
    defaultsProp: {
        font: {
            'styles': {
                'width': 180,
                'height': 20,
                'font-family': '微软雅黑',
                'color': '#333333',
                'font-size': '18px',
                'line-height': '18px',
                'left': 0,
                'top': 0,
                'z-index': 1,
                'position': 'absolute'
            },
            'text': '',
            'animate': {
                'animationType': '',
                '-webkit-animation-name': '',
                '-webkit-animation-duration': '1s',
                '-webkit-animation-timing-function': 'ease-out',
                '-webkit-animation-delay': '0s',
                '-webkit-animation-fill-mode': 'both',
            }
        },
        image: {
            src: '',
            'styles': {
                width: '',
                height: '',
                left: 0,
                top: 0,
                'z-index': 1,
                'position': 'absolute'
            },
            'animate': {
                'animationType': '',
                '-webkit-animation-name': '',
                '-webkit-animation-duration': '1s',
                '-webkit-animation-timing-function': 'ease-out',
                '-webkit-animation-delay': '0s',
                '-webkit-animation-fill-mode': 'both',
            },
            'audio': {
                'imgId': null,
                'src': null,
                'songName': null,
                'singer': null,
                'playbtn': null,
                'pausebtn': null
            },
            'link': null
        },
        button: {
            'styles': {
                'font-family': '微软雅黑',
                'background-color': '#ff6600',
                'border-width': '0px',
                'border-style': 'solid',
                'border-color': '#ffffff',
                'font-size': '18px',
                'width': 120,
                'height': 40,
                'line-height': '40px',
                'border-radius': 4,
                'opacity': 1,
                'color': '#ffffff',
                'text-align': 'center',
                'left': 0,
                'top': 0,
                'z-index': 1,
                'position': 'absolute'
            },
            'text': '按钮',
            'animate': {
                'animationType': '',
                '-webkit-animation-name': '',
                '-webkit-animation-duration': '1s',
                '-webkit-animation-timing-function': 'ease-out',
                '-webkit-animation-delay': '0s',
                '-webkit-animation-fill-mode': 'both',
            }
        },
        background: {
            'background-image': '',
            'background-color': '#ffffff',
            'background-position': 'center center',
            'background-size': 'cover'
        }
    },
    UIArr: [],
    // 多音频列表
    audioList: [],
    // 页对象
    pages: [],
    // 模板html
    template: {
        // 侧边栏页面导航
        pageNavItem: function(pageIndex) {
            return '<li data-index="' + parseInt(pageIndex + 1) + '"><div class="page_number">' + parseInt(pageIndex + 1) + '</div><div class="page_thumb_ele"><div class="page_thumb"></div><div class="page_del" data-index="' + pageIndex + '">X</div></div></li>';
        },
        // preview预览栏中元素html
        previewItem: function() {
            return '<li></li>';
        },
        fontItem: function() {
            return '<div class="create_font_ctrls" data-navIndex="0"><div class="create_font" contenteditable="false">请双击输入文字</div></div>';
        },
        fontItemThumb: function() {
            return '<div class="create_font">请双击输入文字</div>';
        },
        buttonItem: function() {
            return '<div class="create_button" data-navIndex="2">按钮</div>';
        },
        // ui-resizable组件html
        ui_resizable: function(src, id) {
            return '<div class="ui-draggable" id="' + id + '" data-id="' + id + '" data-navIndex="1"><img src="' + src + '" class="create_image" draggable="false" data-navIndex="1"><em class="ui-resizable ui-resizable_' + id + ' ui-resizable-nw">左上</em><em class="ui-resizable ui-resizable_' + id + ' ui-resizable-ne">右上</em><em class="ui-resizable ui-resizable_' + id + ' ui-resizable-sw">左下</em><em class="ui-resizable ui-resizable_' + id + ' ui-resizable-se">右下</em></div>';
        },
        // audio音频元素
        audioItem: function(src) {
            return '<div class="musicIcon songplay"><audio id="page_music" src="' + src + '" autoplay></audio></div>';
        },
        // 二维码弹层
        qrcodeLayer: function(sessionid) {
            return '<div class="releasebox">' +
                '<div class="releasebox_qrcodebox">' +
                '<p class="releasebox_tip">恭喜您，作品保存成功</p>' +
                '<img src="/h5/qrcode?id=' + sessionid + '">' +
                '<p>手机预览</p>' +
                '</div>' +
                '<div class="releasebox_linkbox">' +
                '<p>点击链接进入查看</p>' +
                '<a href="/expand/' + sessionid + '" class="releasebox_link" target="_blank">http://' + window.location.host + '/expand/' + sessionid + '</a>' +
                '</div>' +
                '<div class="releasebox_closebtn">X</div>' +
                '</div>';
        },
        // 设置选项弹层
        setLayer: function () {
                console.info(appstore.setOptions.comment);
                console.info(appstore.setOptions.like);
            return '<div class="setLayer">' +
                '<div class="setTitle">其他配置</div>' +
                '<ul class="setBox">' +
                    '<li>' +
                        (function () {
                            if (appstore.setOptions.comment) {
                                return '<div class="setItem" data-options="comment">是否开启评论<div class="setItem_btn setItem_open" id="setItem_btn_comment"></div></div>';
                            } else {
                                return '<div class="setItem" data-options="comment">是否开启评论<div class="setItem_btn setItem_close" id="setItem_btn_comment"></div></div>';
                            }
                        })() +
                        // '<div class="setItem" data-options="comment">是否开启评论<div class="setItem_btn setItem_open" id="setItem_btn_comment"></div></div>' +
                    '</li>' +
                    '<li>' +
                        (function () {
                            if (appstore.setOptions.like) {
                                return '<div class="setItem" data-options="like">是否开启点赞<div class="setItem_btn setItem_open" id="setItem_btn_like"></div></div>';
                            } else {
                                return '<div class="setItem" data-options="like">是否开启点赞<div class="setItem_btn setItem_close" id="setItem_btn_like"></div></div>';
                            }
                        })() +
                        // '<div class="setItem" data-options="like">是否开启点赞<div class="setItem_btn setItem_close" id="setItem_btn_like"></div></div>' +
                    '</li>' +
                '</ul>' +
                '<div class="setBox_closeBtn" id="setBox_closeBtn">X</div>' +
            '</div>';
        },
        // 图片库列表
        imglibList: function(data) {
            var wrapper, list = '';
            for (var i = 0; i < data.length; i++) {
                list += '<li data-src="' + data[i].src + '" data-width="' + data[i].width + '" data-height="' + data[i].height + '" style="background-image:url(' + data[i].src + ')"><em class="op"></em></li>';
            }

            wrapper = '<ul class="imglib_list">' + list + '</ul>';

            return wrapper;
        },
        animationBox: function() {
            return '<div class="animation_box">' +
                '<button class="animate_button btn_none current" data-animation="none">无动画</button>' +
                '<button class="animate_button btn_bounceInUp" data-animation="bounceInUp">从上滑入</button>' +
                '<button class="animate_button btn_bounceInDown" data-animation="bounceInDown">从下滑入</button>' +
                '<button class="animate_button btn_bounceInLeft" data-animation="bounceInLeft">从左滑入</button>' +
                '<button class="animate_button btn_bounceInRight" data-animation="bounceInRight">从右滑入</button>' +
                '<button class="animate_button btn_fadeInUp" data-animation="fadeInUp">从上淡入</button>' +
                '<button class="animate_button btn_fadeInDown" data-animation="fadeInDown">从下淡入</button>' +
                '<button class="animate_button btn_fadeInLeft" data-animation="fadeInLeft">从左淡入</button>' +
                '<button class="animate_button btn_fadeInRight" data-animation="fadeInRight">从右淡入</button>' +
                '<button class="animate_button btn_fadeIn" data-animation="fadeIn">淡入</button>' +
                '<button class="animate_button btn_bounceIn" data-animation="bounceIn">飞入</button>' +
                '<button class="animate_button btn_zoomIn" data-animation="zoomIn">从小到大</button>' +
                '<button class="animate_button btn_zoomOut" data-animation="zoomOut">从大到小</button>' +
                '<button class="animate_button btn_bounceOut" data-animation="bounceOut">弹性放大</button>' +
                '</div>';
        },
        searchSong: {
            state: {
                loading: function () {
                    return '<img src="/images/search_loading.gif" class="searchResult_loading">正在为您查询结果，请稍后...';
                },
                none: function () {
                    return '未找到相关结果';
                },
                error: function () {
                    return '查询失败';
                }
            },
            info: function (src, songName, singer) {
                return '<div class="songInfoLine">' +
                        '<p class="songInfoName" title="' + songName + ' - ' + singer + '">' + songName + ' - ' + singer + '</p>' +
                        '<span class="searchResult_addSong" data-src="' + src + '" data-songName="' + songName + '" data-singer="' + singer + '">添加</span>' +
                    '</div>';
            }
        },
        moreAudio: {
            listView: function (data) {
                return '<div class="pageSongInfo" data-src="' + data.src + '">' +
                            '<div class="songInfoName" title="' + data.src + '">' + data.songName + ' - ' + data.singer + '</div>' +
                            '<span class="delsongbtn">删除</span>' +
                        '</div>';
            },
            img: function (data) {
                return '<li style="background-image: url(' + data.src + ')" data-src="' + data.src + '" data-id="' + data.id + '"></li>'
            }
        }
    }
};

module.exports = appstore;