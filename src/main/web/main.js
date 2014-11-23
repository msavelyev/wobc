var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static(__dirname + '/static'));

io.on('connection', function(socket) {
    socket.emit('hello', {hello: new Date()});
    socket.on('why hello', function(data) {
        console.log(data);
    })
});
