var Cache = {
    /**
     * @method save
     * 存储键值对到缓存中
     * @param key {String} 键值
     * @param value {String或Object} 存储对象或数组
     */
    save: function(key, value){
        var data;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
        return value;
    },
    /**
     * @method add
     * 添加键值对到缓存中
     * @param key {String} 键值
     * @param value {Object} 存储对象(必须为对象)
     */
    add: function(key, object){
        var data = [];
        if (localStorage[key]) {
            data = JSON.parse(localStorage[key]);
            data.push(object);
            data = JSON.stringify(data);
        } else {
            data = JSON.stringify([object]);
        }
        localStorage.setItem(key, data);
        return data;
    },
    /**
     * @method get
     * 获取到缓存中键值对
     * @param key {String} 键值
     */
    get: function(key){
        var res = localStorage.getItem(key);
        if (typeof res === 'string') {
            return JSON.parse(res) 
        } else {
            return res;
        }
    }
};

module.exports = Cache;