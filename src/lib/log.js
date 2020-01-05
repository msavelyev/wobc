"use strict";
exports.__esModule = true;
var logFunc = function (type) {
    return console[type].bind(console);
};
exports["default"] = {
    info: logFunc('info'),
    debug: logFunc('debug'),
    warn: logFunc('warn'),
    error: logFunc('error')
};
