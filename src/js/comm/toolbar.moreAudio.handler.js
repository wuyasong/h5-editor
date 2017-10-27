var $ = require('jquery');

// 引入数据模型
var appstore = require('appStore');

// 引入公用model方法
var toolbar_model = require('./toolbar.model.js');

var moreAudio = {
    init: function () {
        var _this = this;
        // 读取本地搜索记录 渲染UI
        this.getStorage();
        // 添加音频导航li绑定点击事件
        $('#searchSongNav li').unbind('click').bind('click', this.tabSourceType);
        // 查询按钮绑定点击事件
        $('#searchSubmit').unbind('click').bind('click', function () {
            _this.submitSearch(this);
        });
        // 绑定添加歌曲事件
        $('.searchResult_addSong').unbind('click').bind('click', function () {
            _this.handleAddAudio(this);
        });
        // 点击选择播放状态图片
        $('#relaPic_select_play').unbind('click').bind('click', this.handleSelectPlayImg);
        // 点击选择暂停状态图片
        $('#relaPic_select_pause').unbind('click').bind('click', this.handleSelectPauseImg);
    },
    // 选择播放图片处理
    handleSelectPlayImg: function () {
        if (!appstore.audioList[appstore.currentPage]) {
            alert('请先为本页添加音频');
        } else {
            if ($('#relaPic_selectbox_play').is(':hidden')) {
                // 获取已选图片list
                moreAudio.getUIImgList();
            } else {
                $('#relaPic_selectbox_play').hide();
            }
        }
    },
    // 选择暂停图片处理
    handleSelectPauseImg: function () {
        if (!appstore.audioList[appstore.currentPage]) {
            alert('请先为本页添加音频');
        } else {
            if ($('#relaPic_selectbox_pause').is(':hidden')) {
                // 获取图片库list
                moreAudio.getLibImgList();
            } else {
                $('#relaPic_selectbox_pause').hide();
            }
        }
    },
    // 获取已选图片并渲染
    getUIImgList: function () {
		// 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var model = appstore.pages[currentPageIndex].UIitem;
        var isHasImg = false;

        $('#relaPic_selectbox_play ul').html('');
        $('#relaPic_selectbox_play').show();
        for (var key in model) {
            if (model[key].type === 'image') {
                isHasImg = true;
                $('#relaPic_selectbox_play ul').append( appstore.template.moreAudio.img({src: model[key].src, id: model[key].id}) );
            }
        }

        // 如果没有图片
        if (!isHasImg) {
            $('#relaPic_selectbox_play ul').html('请先上传图片');
        } else {
            $('#relaPic_selectbox_play li').unbind('click').bind('click', this.concatPlayImage);
        }
    },
    // 获取图片库list
    getLibImgList: function () {
        var _this = this;
        // 获取当前page索引
		var currentPageIndex = appstore.currentPage;
		var currAudioModel = appstore.audioList[currentPageIndex];
        var id = currAudioModel.imgId;
		var model = appstore.pages[currentPageIndex].UIitem[id];

        if (!id) {
            alert('请先关联播放按钮图！');
            return;
        }
        $.ajax({
            type: 'GET',
            url: '/h5/getImageLib',
            success: function(data) {
                var data = JSON.parse(data);
                // 获取到数据
                if (data.retcode == 1) {
                    // 图片库中没有数据
                    if (data.imglib.length === 0) {
                        $('#relaPic_selectbox_pause ul').html('图片库中没有数据');
                        return;
                    } else {
                        $('#relaPic_selectbox_pause').show();
                        $('#relaPic_selectbox_pause ul').html('');
                        data.imglib.forEach(function(imglib) {
                            $('#relaPic_selectbox_pause ul').append( appstore.template.moreAudio.img({src: imglib.src, id: id}) );
                            $('#relaPic_selectbox_pause li').unbind('click').bind('click', _this.concatPauseImage);
                        }, this);
                        
                    }
                }
                // 获取数据失败
                else {
                    $('#relaPic_selectbox_pause ul').html('查询图片库失败');
                }
            }
        });
    },
    // 关联播放图片操作
    concatPlayImage: function () {
        var playbtnSrc = $(this).attr('data-src'),
            id = $(this).attr('data-id');
        
        // 模型树中关联图片音频
        toolbar_model.setConcatAudioModel({playbtn: playbtnSrc, imgId: id});
        // 在relaPicBox_preview中显示图片
        moreAudio.showPlayBtnImage(playbtnSrc);
        // 隐藏已选图片list
        $('.relaPic_selectbox').hide();
    },
    // 关联暂停图片操作
    concatPauseImage: function () {
        var pausebtnSrc = $(this).attr('data-src'),
            id = $(this).attr('data-id');

        // 模型树中关联图片音频
        toolbar_model.setConcatAudioModel({pausebtn: pausebtnSrc, imgId: id});
        // 在relaPicBox_preview中显示图片
        moreAudio.showPauseBtnImage(pausebtnSrc);
        // 隐藏list
        $('.relaPic_selectbox').hide();
    },
    // 切换资源类型
    tabSourceType: function () {
        var sourceType = $(this).attr('data-type');
        var defaultValue = '请输入歌曲id';
        // 改变默认值
        if (sourceType === '3') {
            $('#searchSong_input').attr('placeholder', '请输入歌曲地址');
        } else {
            $('#searchSong_input').attr('placeholder', defaultValue);
        }
        // 添加高亮
        $(this).addClass('current').siblings().removeClass('current');
        // 改变查询按钮的sourceType属性值
        $('#searchSubmit').attr('data-sourceType', sourceType);
    },
    // 提交查询请求
    submitSearch: function (self) {
        var _this = this;
        var val = $('#searchSong_input').val();
        var sourceType = $(self).attr('data-sourceType');

        if (val == '') {
            alert('请输入歌曲地址或id');
            return;
        }
        // 显示状态
        $('.searchState').html( appstore.template.searchSong.state.loading() );

        // 非音频地址
        if (sourceType !== '3') {
            $.ajax({
                type: 'GET',
                url: '/h5/searchSongInfo?avid=' + val + '&sourceType=' + sourceType + '&ran=' + Math.random(),
                success: function (params) {
                    var data = JSON.parse(params),
                        songUrl, singer, songName;
                        
                    // 状态移除
                    setTimeout(function() {
                         $('.searchState').html('');

                        if (sourceType === '1') {
                            // 没有查到歌曲信息
                            if (!data.spaceav) {
                                $('.searchState').html( appstore.template.searchSong.state.none() );
                                return;
                            }
                            songUrl = data.spaceav.fileURL;
                            singer = data.spaceav.nickName;
                            songName = data.spaceav.name;
                        } else if (sourceType === '2') {
                            // 没有查到歌曲信息
                            if (!data.listenUrl) {
                                $('.searchState').html( appstore.template.searchSong.state.none() );
                                return;
                            }
                            songUrl = data.listenUrl;
                            singer = data.singerName;
                            songName = data.name;
                        }

                        // 显示歌曲信息
                        $('.searchResultList').prepend( appstore.template.searchSong.info(songUrl, songName, singer) );
                        // 绑定添加歌曲事件
                        $('.searchResult_addSong').unbind('click').bind('click', function () {
                            _this.handleAddAudio(this);
                        });
                        // 本地存储记录
                        _this.saveStorage({src: songUrl, songName: songName, singer: singer});
                    }, 300);
                },
                error: function () {
                    $('.searchState').html( appstore.template.searchSong.state.error() );
                }
            });
        }
        // 查询音频地址
        else {
            // 检测是否为音频地址
            if (!/^(http:\/\/)(.*)\.(mp3|aac|m4a|mpeg)$/gi.test(val)) {
                alert('请输入正确音频地址');
                $('.searchState').html('');
                return;
            } else {
                // 显示结果
                setTimeout(function() {
                    $('.searchState').html('');
                    // 显示歌曲信息
                    $('.searchResultList').prepend( appstore.template.searchSong.info(val, '未知歌曲', '未知歌手') );
                    // 本地存储记录
                    _this.saveStorage({src: val, songName: '未知歌曲', singer: '未知歌手'});
                    // 绑定添加歌曲事件
                    $('.searchResult_addSong').unbind('click').bind('click', function () {
                        _this.handleAddAudio(this);
                    });
                }, 300);
            }
        }
    },
    handleAddAudio: function (self) {
        var songInfo = {
            src: $(self).attr('data-src'),
            songName: $(self).attr('data-songName'),
            singer: encodeURIComponent($(self).attr('data-singer'))
        };
        // 更新模型
        toolbar_model.setAudioListModel(songInfo);
        // 更新本页歌曲界面
        toolbar_model.setAudioListView(songInfo);
    },
    // 本地存储搜索记录
    saveStorage: function (data) {
        var searchSongList;
        // 没有存过搜索记录
        if (!localStorage.getItem('h5_expand_searchSong')) {
            searchSongList = [];
        }
        // 存过记录
        else {
            searchSongList = JSON.parse(localStorage.getItem('h5_expand_searchSong'));
        }
        searchSongList.push({
            src: data.src,
            songName: data.songName,
            singer: data.singer
        });
        localStorage.setItem('h5_expand_searchSong', JSON.stringify(searchSongList));
    },
    // 获取搜索记录
    getStorage: function (){
        var searchSongList;
        if (localStorage.getItem('h5_expand_searchSong')) {
            searchSongList = JSON.parse(localStorage.getItem('h5_expand_searchSong'));
            
            searchSongList.forEach(function(item){
                // 显示歌曲信息
                $('.searchResultList').prepend( appstore.template.searchSong.info(item.src, item.songName, item.singer) );
            });
        }
    },
    showPlayBtnImage: function (src){
        $('#relaPicBox_preview_play').css('background-image', 'url(' + src + ')');
    },
    showPauseBtnImage: function (src){
        $('#relaPicBox_preview_pause').css('background-image', 'url(' + src + ')');
    },
    // 初始化更新界面
    add: function (data) {
        // 更新本页歌曲界面
        toolbar_model.setAudioListView(data);
        // 更新关联图片界面
        this.showPlayBtnImage(data.playbtn);
        this.showPauseBtnImage(data.pausebtn);
    }
};

module.exports = moreAudio;