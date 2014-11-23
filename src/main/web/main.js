var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');

server.listen(8080);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static(__dirname + '/static'));

io.on('connection', function(socket) {
    console.log('connected', socket.client.id);
    socket.emit('hello', {hello: new Date()});
    socket.on('why hello', function(data) {
        console.log(data);
    })
});
