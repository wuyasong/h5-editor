(function () {
    // 缓存jquery
    var $ = jQuery;

    Function.prototype.bind = function(context){
        var self = this,
            args = Array.prototype.slice.call(arguments, 1);

        return function(){
            return self.apply(context, args);
        }
    }

    var _handy = (function () {
        var _utils = {},
            _this = this;
        /**
         * 参数数据类型仅为数组或字符串
         * @param el {String} 
         * @param el {Array} 
         */
        _utils.getElement = function getElement(el) {
            if (!el) {
                throw 'el参数有误';
            }

            if (typeof el === 'string') {
                return $(el);
            } else if (typeof el === 'object' && el instanceof Array) {
                if (el.length < 2) {
                    return $(el[0])
                }
                for (var i = 0; i < el.length; i++) {
                    el[i] = $(el[i]);
                }
                return el;
            } else {
                throw 'el参数类型不正确';
            }
        }

        _utils.parseDirectives = function parseDirectives(directives) {
            var directivesArr, evenType, callbackName;
            if (directives) {
                directivesArr = directives.split(':');
                evenType = directivesArr[0];
                callbackName = directivesArr[1];
                if (evenType && callbackName) {
                    return {
                        evenType: evenType,
                        callbackName: callbackName
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        _utils.makeMethods = function makeMethods(methods, name) {
            if (!methods) throw '未找到methods参数';
            if (typeof methods !== 'object') throw 'methods参数有误';
            if (!methods[name]) return (function () {});

            return methods[name];
        }

        _utils.foreachDirectives = function ($elem, options, directives) {
            if (!directives) return;
            for (var k = 0; k < directives.length; k++) {
                var listener = this.parseDirectives(directives[k]);
                listener.callback = this.makeMethods(options.methods, listener.callbackName);
                (function (listener) {
                    $elem.unbind(listener.evenType).bind(listener.evenType, function (e) {
                        listener.callback.bind(this, e, $(this))();
                    });
                })(listener);
            }
        }
        
        /**
         * 创建ViewModel方法
         * options参数
         * @param el {String} {Array} dom元素或dom元素集合 执行DOM listeners 和 获取directives指令时使用
         * @param data {Object} data作为数据模型 将数据绑定到DOM listeners中
         * @param methods {Object} methods为业务逻辑层 DOM listeners的callback回调可调用其中方法
         */
        function create(options) {
            var $el = _utils.getElement(options.el),
                len = typeof options.el !== 'string' && options.el.length,
                directives;

            // 1个el参数
            if (len < 2) {
                if ($el.attr('data-hdy-ev')) {
                    var directives = $el.attr('data-hdy-ev').split(',');
                    _utils.foreachDirectives($el, options, directives);
                }
            } 
            // 多个el参数
            else {
                for (var i = 0; i < $el.length; i++) {{
                    if ($el[i].attr('data-hdy-ev')) 
                        var directives = $el[i].attr('data-hdy-ev').split(',');
                        _utils.foreachDirectives($el[i], options, directives);
                    }
                }
            }
        }

        return {
            create: create,

        }
    }());
    
    /**
     * 定义Handy类指向私有的_Handy实例
     * 私有的_Handy实例只存在一个export方法
     * 通过Handy.export将第一个参数（方法名）赋予到_Handy的原型对象中
     */
    var Handy = (function (options) {
        return new _Handy(options);
    }());

    function _Handy(options) {
        this.version = '0.1.0';
    }

    _Handy.prototype.export = function (path, object) {
        // 切分调用方法名
        var tokens = path.split('.');

        // target指向Handy类
        // 遍历导出的方法到Handy类中
        var target = this;

        for (var i = 0; i < tokens.length - 1; i++) {
            target = target[tokens[i]];
        }
        target[tokens[tokens.length - 1]] = object;
    }

    Handy.export('create', _handy.create);

    window.handy = Handy;
})();