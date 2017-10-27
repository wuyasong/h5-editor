var editData = {
    notes: {
        position: {
            top: '居上',
            left: '居左',
            bottom: '居下',
            right: '居右',
            center: '居中'
        }
    },
    fullScreen: false,  // 页面高度撑满屏幕
    title: '',
    preview: {
        'type': 'body',
        'height': null,
        'backgroundColor': '#ffffff'
    },
    text: {
        'type': 'text',
        'text': null,
        'style': {
            'width': 320,
            'height': 53,
            'display': 'block',
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'zIndex': 1
        }
    },
    view: {
        'type': 'view',
        'link': null,
        'border': null,
        'style': {
            'width': 100,
            'height': 100,
            'display': 'block',
            'borderColor': '#333333',
            'borderStyle': 'solid',
            'borderWidth': 0,
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'zIndex': 1,
            'borderRadius': 0,
            'opacity': 1,
            'backgroundColor': '#efefef',
            'backgroundImage': null,
            'backgroundSize': 'cover',
            'backgroundPosition': 'center'
        }
    },
    button: {
        'type': 'button',
        'text': '按钮',
        'link': null,
        'style': {
            'width': 80,
            'height': 30,
            'display': 'block',
            'lineHeight': '30px',
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'textAlign': 'center',
            'zIndex': 1,
            'borderRadius': 15,
            'opacity': 1,
            'backgroundColor': '#ffffff',
            'borderColor': '#fa7d3c',
            'borderStyle': 'solid',
            'borderWidth': 1,
            'fontSize': '14px',
            'fontFamily': '黑体',
            'color': '#fa7d3c'
        }
    },
    image: {
        'type': 'image',
        'src': null,
        'link': null,
        'style': {
            'width': 100,
            'height': 100,
            'display': 'block',
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'zIndex': 1,
            'borderRadius': 0,
            'opacity': 1,
        }
    },
    audio: {
        'type': 'audio',
        'info': '',
        'src': null,
        'image': {
            'play': null,
            'pause': null
        },
        'style': {
            'width': 80,
            'height': 80,
            'display': 'block',
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'zIndex': 1,
        }
    },
    video: {
        'type': 'video',
        'info': '',
        'src': null,
        'poster': null,
        'style': {
            'width': 320,
            'height': 180,
            'display': 'block',
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'right': null,
            'bottom': null,
            'zIndex': 1,
        }
    },
    native: {
        vvlive: { 
            name: 'VV直播',
            type: 'vvlive',
            method: {
                toShare: '弹出分享框',
                toLivePage: '进入直播页',
                toSpace: '进入个人主页',
                toDownload: '下载应用',
                // toAtten: '关注'
            },
            item: [
                {name: '弹出分享框', type: 'toShare'},
                {name: '进入直播页', type: 'toLivePage'},
                {name: '进入个人主页', type: 'toSpace'},
                {name: '下载应用', type: 'toDownload'},
                // {name: '关注', type: 'toAtten'}
            ]
        },
        vvmusic: {
            name: 'VV音乐',
            type: 'vvmusic',
            method: {
                toUserZone: '进入个人空间',
                toUserPlayerMV: '进入用户MV',
                toUserPlayerSong: '进入用户歌曲',
                toDownload: '下载应用'
            },
            item: [
                {name: '进入个人空间', type: 'toUserZone'},
                {name: '进入用户MV', type: 'toUserPlayerMV'},
                {name: '进入用户歌曲', type: 'toUserPlayerSong'},
                {name: '下载应用', type: 'toDownload'}
            ]
        }
    }
};

module.exports = editData;