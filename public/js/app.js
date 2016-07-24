var socket = io();

socket.on('connect', function() {
	console.log('connected to socket.io server');
});

socket.on('message', function(message){
	console.log('new message!');
	console.log(message.text);

	var $messageDiv = jQuery('.messages');
	$messageDiv.append('<p>' + message.text + "</p>");
});

// handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault(); // prevents page refresh

	var $messageField = $form.find('input[name=message]');
	socket.emit('message', {
		text: $messageField.val() // selector locates any input tag within $form with a name attribute that equals 'message'
	});

	// Clear the field
	$messageField.val('');
});