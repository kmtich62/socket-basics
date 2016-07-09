var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name +'wants to join '+ room);

jQuery('.RoomName').text(room);

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
    //jQuery('.messages').append(name +' joined '+ room);
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function(message){
    var momentTimestamp = moment.utc(message.timeStamp);
    //var mytime = momentTimestamp.format('h:mm a');
    var myMessage = momentTimestamp;
    var $message = jQuery('.messages');

    console.log('New message recieved:');
    console.log(myMessage);

    $message.append('<p><strong>'+ message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>')
    $message.append('<p>'+ message.text +'</p>')
    //jQuery('.messages').append('<p><strong>'+ momentTimestamp.local().format('h:mm a') +':</strong> '+ message.text +'</p>')

});

//handles submitting of new messages


var $form = jQuery('#message-Form');
$form.on('submit', function(event){
    var $inputBox = $form.find('input[name=message]');
    event.preventDefault();
    socket.emit('message', {
        name: name,
        text: $inputBox.val()
    });
    $inputBox.val('');
});
