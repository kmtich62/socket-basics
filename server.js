var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var now = moment();

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    console.log('User connected via socket.io');

    socket.on('message', function(message){
        message.timeStamp = moment().valueOf();
        console.log('message recieved: ' + message.text);
        //socket.broadcast.emit('message', message);
        io.emit('message', message);
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
