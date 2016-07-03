var socket = io();

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(message){
    console.log('New message recieved:');
    console.log(message.text);
});
