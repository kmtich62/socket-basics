var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//send current usres to provided socket
function sendCurrentUsers(socket){
    var info = clientInfo[socket.id];
    var users = [];

    if(typeof info === 'undefined'){ return;}

    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo = clientInfo[socketId];
        if(info.room === userInfo.room){
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current Users ' + users.join(', '),
        timeStamp: moment().valueOf()

    });
}

function sendPrivateMessage(socket, message){
    var info = clientInfo[socket.id];
    if(typeof info === 'undefined'){return;}

    var parts = message.text.split(' ');
    //need to remove the command and username + 2 spaces here
    var messageStart = parts[0].toString().length + parts[1].toString().length + 2;
    var sendMessage = message.text.substring(messageStart);

    //now loop the current users to find the right socket(s) to receive message
    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo = clientInfo[socketId];
        if(userInfo.name === parts[1].toString()){
            io.to(socketId).emit('message', {
                name: info.name,
                text: sendMessage,
                timeStamp: moment().valueOf()
            });
        }
    })
}

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
        console.log('message recieved: ' + message.text);

        if(message.text === '/cu'){
            sendCurrentUsers(socket);
        }
        else if(message.text.substring(0,2)==='/p'){
            console.log('sending private message');
            sendPrivateMessage(socket, message);
        }
        else{
            message.timeStamp = moment().valueOf();
            //socket.broadcast.emit('message', message);
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
    });
    
    socket.emit('message', {
        name:'System',
        text:'Welcome to the chat application',
        timeStamp: moment().valueOf()
    })
});

http.listen(PORT, function(){
    console.log ('Sockets server started');
});
