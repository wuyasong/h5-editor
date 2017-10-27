module.exports = {
    show: function(e, type){
        var position = this.position(e);
        if (type === 'text') {
            selector = '#contextmenu-text'
        } else if (type === 'view') {
            selector = '#contextmenu-view'
        }
        $(selector).show();
        $(selector).css({
            left: position.left,
            top: position.top
        });
    },
    hide: function(){
        $('.contextmenu').hide();
        // $('.main-toolbar-image-menu').hide();
    },
    position: function(e){
        var x = e.clientX,
            y = e.clientY, 
            menu = $('.contextmenu')[0],
            html = document.documentElement, 
            vx = html.clientWidth, 
            vy = html.clientHeight,
            mw =  menu.offsetWidth, 
            mh =  menu.offsetHeight;
        return {
            left : (x + mw) > vx ? (vx - mw ) : x,
            top : (y + mh) > vy ? (vy - mh ) : y
        }
    }
};