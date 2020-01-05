interface Logger {
    info(...args: any[]);
    debug(...args: any[]);
    warn(...args: any[]);
    error(...args: any[]);
}

const logFunc = function (type) : (...args: any[]) => void {
    return console[type].bind(console);
};

export default {
    info: logFunc('info'),
    debug: logFunc('debug'),
    warn: logFunc('warn'),
    error: logFunc('error')
};
