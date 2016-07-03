var socket = io();

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(message){
    console.log('New message recieved:');
    console.log(message.text);

    jQuery('.messages').append('<p>'+ message.text +'</p>')

});

//handles submitting of new messages


var $form = jQuery('#message-Form');
$form.on('submit', function(event){
    var $inputBox = $form.find('input[name=message]');
    event.preventDefault();
    socket.emit('message', {text: $inputBox.val()});
    $inputBox.val('').focus();
});
