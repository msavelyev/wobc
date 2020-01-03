var rjs = require('requirejs');
rjs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/static/js'
});

var express = rjs('express');
var app = express();
var server = rjs('http').Server(app);
var io = rjs('socket.io')(server);
var _ = rjs('underscore');

var guid = rjs('guid');
var Direction = rjs('Direction');
var World = rjs('World');
var log = rjs('log');

server.listen(process.env.PORT || 8080);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var players = {};

app.use('/static', express.static(__dirname + '/static'));

var createSimplePlayer = function(player) {
    return {
        id: player.id,
        moving: player.moving,
        pos: player.pos,
        direction: player.direction.toString()
    };
};

var dir = function(direction) {
    return Direction.fromStr(direction);
};

var world = new World(800, 576);

io.on('connection', function(socket) {
    var id = guid();
    log.info('connected', id);

    world.addTank(id, 32, 32, Direction.RIGHT);

    var simplePlayer = world.getPlayer(id);
    socket.broadcast.emit('connected', simplePlayer);
    socket.emit('start', simplePlayer);
    socket.emit('players', world.getPlayers());

    socket.on('shoot', function() {
        log.info('shoot', id);
        world.shoot({id: id});
        socket.broadcast.emit('shoot', world.getPlayer(id));
    });

    socket.on('rotate', function(direction) {
        log.info('rotate', id, direction);
        var tank = world.getTank(id);
        tank.rotate(dir(direction));
        socket.broadcast.emit('rotate', world.getPlayer(id));
    });

    socket.on('stop', function() {
        log.info('stop', id);
        var tank = world.getTank(id);
        tank.stopMoving();
        socket.broadcast.emit('stop', world.getPlayer(id));
    });

    socket.on('disconnect', function() {
        log.info('disconnected', id);
        world.removeTank(id);
        socket.broadcast.emit('disconnected', id);
    });
});

setInterval(function () {
    io.emit('sync', world.getPlayers());
}, 1000);

var prevTime = new Date();
setInterval(function() {
    var newTime = new Date();
    var delta = newTime.getTime() - prevTime.getTime();
    world.tick({
        delta: delta
    });
    prevTime = newTime;
}, 1);

console.log('started server on 0.0.0.0:8080');
