var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');

var rjs = require('requirejs');
rjs.config({
    nodeRequire: require,
    baseUrl: __dirname + '/static/js'
});

var guid = rjs('guid');
var Direction = rjs('Direction');

server.listen(8080);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var socketIdToPlayerId = {};
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

var simplePlayers = function() {
    return _.map(_.values(players), createSimplePlayer);
};

io.on('connection', function(socket) {
    var id = guid();
    socketIdToPlayerId[socket.client.id] = id;
    console.log('connected', id);

    players[id] = {
        id: id,
        socket: socket,
        moving: false,
        pos: {
            x: 32,
            y: 32
        },
        direction: Direction.RIGHT
    };
    var simplePlayer = createSimplePlayer(players[id]);
    socket.broadcast.emit('connected', simplePlayer);
    socket.emit('start', simplePlayer);
    socket.emit('players', simplePlayers());

    socket.on('shoot', function() {
        console.log('someone is shooting');
        var id = socketIdToPlayerId[socket.client.id];
        var player = createSimplePlayer(players[id]);

        socket.broadcast.emit('shoot', player);
    });

    socket.on('rotate', function(direction) {
        var id = socketIdToPlayerId[socket.client.id];
        var player = players[id];
        player.direction = direction;
        player.moving = true;
        socket.broadcast.emit('rotate', createSimplePlayer(player));
    });

    socket.on('stop', function() {
        var id = socketIdToPlayerId[socket.client.id];
        var player = players[id];
        player.moving = false;
        socket.broadcast.emit('stop', createSimplePlayer(player));
    });
});

setInterval(function () {
    io.emit('sync', simplePlayers());
}, 1000);
