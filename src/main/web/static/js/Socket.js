define(function() {
    return function(main) {
        console.log('connecting');
        io.connect('http://' + config.host);
    };
});
