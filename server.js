var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
    console.log('User connected via socket.io');

    socket.on('disconnect', function(){
        var userData = clientInfo[socket.id];

        if(typeof clientInfo[socket.id]!== 'undefined'){
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left the room',
                timeStamp : moment().valueOf()
            });
            delete(clientInfo[socket.id]);
        }
    });

    socket.on('joinRoom', function(req){
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message',{
            name: 'System',
            text: req.name + ' has joined',
            timeStamp: moment.valueOf()
        })
    });

    socket.on('message', function(message){
        message.timeStamp = moment().valueOf();
        console.log('message recieved: ' + message.text);
        //socket.broadcast.emit('message', message);
        io.to(clientInfo[socket.id].room).emit('message', message);
    });
    
    socket.emit('message', {
        name:'System',
        text:'Welcome to the chat application',
        timeStamp: moment().valueOf()
    })
});

http.listen(PORT, function(){
    console.log ('Sockets server started');
})
