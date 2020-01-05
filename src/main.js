"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Koa = require("koa");
var Router = require("koa-router");
var send = require("koa-send");
var serve = require("koa-static");
var http = require("http");
var SocketIo = require("socket.io");
// const Direction = rjs('Direction');
// const World = rjs('World');
var log_1 = require("./lib/log");
var app = new Koa();
var router = new Router();
router.get('/', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, send(ctx, 'index.html')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.use(router.routes());
app.use(serve('static'));
var httpServer = http.createServer(app.callback());
var io = SocketIo(httpServer);
// const world = new World(800, 576);
//
// io.on('connection', function(socket) {
//     const id = guid();
//     log.info('connected', id);
//
//     world.addTank(id, 32, 32, Direction.RIGHT);
//
//     const simplePlayer = world.getPlayer(id);
//     socket.broadcast.emit('connected', simplePlayer);
//     socket.emit('start', simplePlayer);
//     socket.emit('players', world.getPlayers());
//
//     socket.on('shoot', function() {
//         log.info('shoot', id);
//         world.shoot({id: id});
//         socket.broadcast.emit('shoot', world.getPlayer(id));
//     });
//
//     socket.on('rotate', function(direction) {
//         log.info('rotate', id, direction);
//         const tank = world.getTank(id);
//         tank.rotate(Direction.fromStr(direction));
//         socket.broadcast.emit('rotate', world.getPlayer(id));
//     });
//
//     socket.on('stop', function() {
//         log.info('stop', id);
//         const tank = world.getTank(id);
//         tank.stopMoving();
//         socket.broadcast.emit('stop', world.getPlayer(id));
//     });
//
//     socket.on('disconnect', function() {
//         log.info('disconnected', id);
//         world.removeTank(id);
//         socket.broadcast.emit('disconnected', id);
//     });
//
//     socket.on('ping', function() {
//         log.info('ping', id);
//         socket.emit('pong');
//     });
// });
var PORT = process.env.PORT || 8080;
httpServer.listen(PORT);
// setInterval(function () {
//     io.emit('sync', world.getPlayers());
// }, 1000);
//
// let prevTime = new Date();
// let tick = 1;
// setInterval(function() {
//     const newTime = new Date();
//     const delta = newTime.getTime() - prevTime.getTime();
//     world.tick({
//         delta: delta
//     });
//     prevTime = newTime;
//     tick += 1;
// }, 1);
//
// let previousTick = tick;
// setInterval(function() {
//     const fps = (tick - previousTick);
//     log.info('fps', fps);
//
//     previousTick = tick;
// }, 1000);
log_1["default"].info('started server on 0.0.0.0:' + PORT);
