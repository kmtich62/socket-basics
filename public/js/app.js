var socket = io();
var moment = moment();

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(message){
    var momentTimestamp = moment.utc(message.timeStamp);
    //var mytime = momentTimestamp.format('h:mm a');
    var myMessage = momentTimestamp + ' ' + message.text;

    console.log('New message recieved:');
    console.log(myMessage);
    jQuery('.messages').append('<p><strong>'+ momentTimestamp.local().format('h:mm a') +':</strong> '+ message.text +'</p>')

});

//handles submitting of new messages


var $form = jQuery('#message-Form');
$form.on('submit', function(event){
    var $inputBox = $form.find('input[name=message]');
    event.preventDefault();
    socket.emit('message', {text: $inputBox.val()});
    $inputBox.val('').focus();
});
