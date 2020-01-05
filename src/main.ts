import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as http from 'http';
import * as SocketIo from 'socket.io';

import guid from './lib/guid';

// const Direction = rjs('Direction');
// const World = rjs('World');
import log from './lib/log';

const app = new Koa();
const router = new Router();
router.get('/', async (ctx, next) => {
    await send(ctx, 'index.html', { root: __dirname + '/web' });
});
app.use(router.routes());
app.use(serve('static'));

const httpServer = http.createServer(app.callback());
const io = SocketIo(httpServer);

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

const PORT = process.env.PORT || 8080;
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

log.info('started server on 0.0.0.0:' + PORT);
