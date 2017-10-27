//生成图片名称算法
function createRandomName(len){
    len = len || 8;
    // 图片编码密钥
    var parseCode = [2,0,1,3,0,4,0,7,8,2];
    var chars = pageNumber + '-' + appId;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(parseCode[i]);
    }
    return pwd;
}

module.exports = createRandomName;