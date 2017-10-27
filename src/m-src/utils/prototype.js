Function.prototype.bind = function(context){
    var self = this,
        args = Array.prototype.slice.call(arguments, 1);

    return function(){
        return self.apply(context, args);
    }
}