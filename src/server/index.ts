import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as http from 'http';
import * as SocketIo from 'socket.io';

import guid from '../lib/guid';
import {World} from "../lib/game/World";
import {Direction} from "../lib/game/Direction";
import {Socket} from "socket.io";
import {Player} from "../lib/game/Player";

const app = new Koa();
const router = new Router();
router.get('/', async (ctx, next) => {
    await send(ctx, 'index.html', { root: __dirname + '../../../public' });
});
app.use(router.routes());
app.use(serve('static'));

const httpServer = http.createServer(app.callback());
const io = SocketIo(httpServer);

const world = new World(800, 576);

io.on('connection', (socket: Socket) => {
    const id = guid();
    console.info('connected', id);

    world.addTank(id, 32, 32, Direction.RIGHT);

    const simplePlayer = world.getPlayer(id);
    socket.broadcast.emit('connected', simplePlayer);
    socket.emit('start', simplePlayer);
    socket.emit('players', world.getPlayers());

    socket.on('shoot', () => {
        console.info('shoot', id);
        world.shoot(id);
        socket.broadcast.emit('shoot', world.getPlayer(id));
    });

    socket.on('rotate', (direction: Direction) => {
        console.info('rotate', id, direction);
        const tank = world.getTank(id);
        tank.rotate(direction);
        socket.broadcast.emit('rotate', world.getPlayer(id));
    });

    socket.on('stop', () => {
        console.info('stop', id);
        const tank = world.getTank(id);
        tank.stopMoving();
        socket.broadcast.emit('stop', world.getPlayer(id));
    });

    socket.on('disconnect', () => {
        console.info('disconnected', id);
        world.removeTank(id);
        socket.broadcast.emit('disconnected', id);
    });

    socket.on('ping', () => {
        console.info('ping', id);
        socket.emit('pong');
    });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT);

setInterval(function () {
    io.emit('sync', world.getPlayers());
}, 1000);

let prevTime = new Date();
let tick = 1;
setInterval(function() {
    const newTime = new Date();
    const delta = newTime.getTime() - prevTime.getTime();
    world.tick({
        delta: delta
    });
    prevTime = newTime;
    tick += 1;
}, 1);

let previousTick = tick;
setInterval(function() {
    const fps = (tick - previousTick);
    console.info('fps', fps);

    previousTick = tick;
}, 1000);

console.info('started server on 0.0.0.0:' + PORT);
