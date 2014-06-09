var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    console.log('A user has connected!');
    io.emit('chat message', 'A user has connected!');
    socket.on('disconnect', function () {
        console.log('A user has disconnected!');
        io.emit('chat message', 'A user (' + clients[socket] + ') has disconnected!');
    });
    socket.on('chat message', function (msg) {
        console.log(msg);
        io.emit('chat message', clients[socket] + ': ' + msg);
    });
    socket.on('nick change', function (nick) {
        console.log(socket.id + ' changed their nick to ' + nick + '!');
        clients[socket] = nick;
    });
});

io.sockets.on('connect', function(client) {
    clients[client] = client.id;

    client.on('disconnect', function() {
        delete clients[client];
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});