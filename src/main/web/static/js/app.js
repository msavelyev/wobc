requirejs.config({
    baseUrl: '/static/js'
});

var app = {
    init: function() {
        requirejs(['Main'], function(Main) {
            Main.init();
        });
    }
};
