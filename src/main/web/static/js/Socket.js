var Socket = (function() {
    var obj = function(main) {
        console.log('connecting');
        io.connect('http://' + config.host);
    };

    return obj;
})();
