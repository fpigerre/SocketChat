var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    console.log('A user has connected!');
    io.emit('chat message', socket.id + ' has connected!');
    socket.on('disconnect', function () {
        console.log(clients[socket] + ' has disconnected!');
        io.emit('chat message', clients[socket] + ' has disconnected!');
        delete clients[socket];
    });
    socket.on('chat message', function (msg) {
        console.log(clients[socket] + ': ' + msg);
        io.emit('chat message', clients[socket] + ': ' + msg);
    });
    socket.on('nick change', function (nick) {
        console.log(clients[socket] + ' changed their nick to ' + nick + '!');
        io.emit('chat message', clients[socket] + ' is now know as ' + nick + '!');
        clients[socket] = nick;
    });
});

io.sockets.on('connect', function(client) {
    clients[client] = client.id;
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});