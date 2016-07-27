var name = getQueryVariable('name') || 'Mystery Dude';
var room = getQueryVariable('room');

var socket = io();

var $room = jQuery(".room-title").text(room);


socket.on('connect', function() {
	console.log('connected to socket.io server');

	socket.emit('joinroom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message){

	if (typeof message.recipientName !== 'undefined') {
		if (message.recipientName !== name) {
			// it's not for us
			return;
		}
	}

	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	var formattedLocalTime = moment.utc(message.timeStamp).local().format('h:mma');
	$message.append('<p><strong>' + message.name + ' ' + formattedLocalTime + '</strong>');
	$message.append('<p>' + message.text + "</p>");
	$messages.append($message);
});

// handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault(); // prevents page refresh

	var $messageField = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $messageField.val() // selector locates any input tag within $form with a name attribute that equals 'message'
	});

	// Clear the field
	$messageField.val('');
});