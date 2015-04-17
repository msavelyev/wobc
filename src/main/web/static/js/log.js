define(['require'], function(require) {
    //if(module !== undefined) {
    try {
        var winston = require('winston');

        return new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({json: false, timestamp: true}),
                //new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
            ],
            exceptionHandlers: [
                new (winston.transports.Console)({json: false, timestamp: true}),
                //new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
            ],
            exitOnError: false
        });
    } catch(e) {
        var logFunc = function(type) {
            return console[type].bind(console);
        };
        return {
            info: logFunc('info'),
            debug: logFunc('debug'),
            warn: logFunc('warn'),
            error: logFunc('error')
        };
    }
});
