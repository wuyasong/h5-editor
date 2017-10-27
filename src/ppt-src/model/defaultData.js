var originalData = {
    // 背景
    background: {
        'backgroundColor': '#ffffff',
        'backgroundImage': '',
        'backgroundPosition': 'center center',
        'backgroundSize': 'cover'
    },
    // 文本
    text: {
        'type': 'text',
        'name': '文本',
        'text': '',
        'style': {
            'width': 180,
            'height': 21,
            'display': 'block',
            'left': 0,
            'top': 0,
            'zIndex': 1,
            'fontFamily': '',
            'fontSize': 18,
            'lineHeight': 1.2,
            'color': '#333333'
        }
    },
    // 容器
    view: {
        'type': 'view',
        'name': '形状',
        'link': null,
        'style': {
            'width': 100,
            'height': 100,
            'display': 'block',
            'borderColor': '#333333',
            'borderWidth': 0,
            'left': 0,
            'top': 0,
            'zIndex': 1,
            'borderRadius': 0,
            'opacity': 1,
            'backgroundColor': '#efefef',
            'backgroundImage': null,
            'backgroundSize': 'cover',
            'backgroundPosition': 'center'
        }
    },
    // 按钮
    button: {
        'type': 'button',
        'name': '按钮',
        'text': '按钮',
        'link': null,
        'style': {
            'width': 80,
            'height': 30,
            'display': 'block',
            'lineHeight': 30,
            'left': 0,
            'top': 0,
            'textAlign': 'center',
            'zIndex': 1,
            'borderRadius': 4,
            'opacity': 1,
            'backgroundColor': '#fa7d3c',
            'borderColor': '#fa7d3c',
            'borderStyle': 'solid',
            'borderWidth': 0,
            'fontFamily': '',
            'fontSize': 16,
            'color': '#ffffff'
        }
    },
    // 图片
    image: {
        'type': 'image',
        'name': '图片',
        'src': null,
        'link': null,
        'style': {
            'width': 100,
            'height': 100,
            'display': 'block',
            'left': 0,
            'top': 0,
            'zIndex': 1,
            'borderColor': '#fa7d3c',
            'borderStyle': 'solid',
            'borderWidth': 0,
            'borderRadius': 0,
            'opacity': 1
        }
    },
    // 音频
    audio: {
        'type': 'audio',
        'name': '音频',
        'src': null,
        'image': {
            'play': null,
            'pause': null
        },
        'style': {
            'width': 80,
            'height': 80,
            'display': 'block',
            'left': 0,
            'top': 0,
            'zIndex': 1
        }
    },
    // 视频
    video: {
        'type': 'video',
        'name': '视频',
        'src': null,
        'poster': null,
        'style': {
            'width': 320,
            'height': 180,
            'display': 'block',
            'left': 0,
            'top': 0,
            'zIndex': 1
        }
    },
    animate:{
        // 动画
        animation: {
            name: '',
            duration: '1s',
            count: 1,
            delay: '0s'
        }
    },
    // 事件
    events: {
        eventType: 'click',
        eventTypeName: '点击时',
        eventHandle: 'show',
        eventHandleName: '显示',
        eventId: '',
        name: '无'
    }
};

module.exports = originalData;