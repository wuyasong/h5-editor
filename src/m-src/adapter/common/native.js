var store = require('../../store/dataSet');
var defaultStore = require('../../store/defaultData'); 
var vm = require('../common/vm');
var nativeListView = require('../../view/edit/nativelist.hbs');

var nativeCtrls = {
    init: function () {
        var _this = this;
        $('.set-native').unbind('click').bind('click', function(e){ e.stopPropagation(); _this.nativeProSel(this); });
        $('.set-native-method').unbind('click').bind('click', function(e){ e.stopPropagation(); _this.nativeMethodSel(this); });
        $('.set-native-param-input').unbind('keyup').bind('keyup', function(){ _this.changeIdHandler(this); });
    },
    nativeProSel: function (self) {
        var _this = this;
        var currElem = store.elements[store.currElemId];
        var $list = $(self).children('.options-item-select');
        var $list_item = $list.children('li');
        var $list_selected = $(self).children('.set-native-selected');
        $list.show();
        $list_item.unbind('mousedown').bind('mousedown', function(e){ e.stopPropagation(); });
        $list_item.unbind('click').bind('click', function(e){
            e.stopPropagation();
            var app = $(this).attr('data-app');
            var str = $(this).html();
            // 更新表单视图
            $list_selected.html(str);
            // 更新模型
            currElem.native.name = app;
            currElem.native.method = '';
            // 更新method列表
            $('.set-native-method .set-native-method-selected').html('选择功能');
            if (app) {
                $('.set-native-method .options-item-select').html(nativeListView(defaultStore.native[app].item));
            } else {
                $('.set-native-param .set-native-param-input').val('');
            }
            $list.hide();
        });
    },
    nativeMethodSel: function (self) {
        var currElem = store.elements[store.currElemId];
        var $list = $(self).children('.options-item-select');
        var $list_item = $list.children('li');
        var $list_selected = $(self).children('.set-native-method-selected');
        if (!currElem.native.name) {
            alert('请选择应用');
            return;
        }
        $list.show();
        $list_item.unbind('mousedown').bind('mousedown', function(e){ e.stopPropagation(); });
        $list_item.unbind('click').bind('click', function(e){
            e.stopPropagation();
            var method = $(this).attr('data-type');
            var str = $(this).html();
            // 更新表单视图
            $list_selected.html(str);
            // 更新模型
            currElem.native.method = method;
            $list.hide();
        });
    },
    changeIdHandler: function (self) {
        var currElem = store.elements[store.currElemId];
        // console.info(self.value)
        if (currElem) {
            var id = self.value;
            // 更新模型
            currElem.native.id = id;
        }
    }
};

module.exports = nativeCtrls;